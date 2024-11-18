import { useState, useEffect, useCallback } from "react";
import { LocalStorageHelper } from "../utils/localStorageHelper";
import { useAxios } from "./useAxios";
// import { loginData, loginPayload, OptionsResponse, orgDataResponse } from "../pages/login/loginModel";
import { ApiEndpoint } from "../utils/apiEndpoint";
import { toast } from "react-toastify";
// import { commonAPiResponse } from "../types/auth";

const AUTH_COOKIE_KEY = "auth_state";
const AUTH_COOKIE_ORG_KEY = "auth_org_state";
const AUTH_COOKIE_OPTIONData_KEY = "cookie_option_list";
const AUTH_COOKIE_Department_KEY = "cookie_dept_option_list";

export const useAuth = () => {
  const [authState, setAuthState] = useState<any | null>(() => {
    return LocalStorageHelper.getObject<any>(AUTH_COOKIE_KEY) || null;
  });

  const { loading, refetch, customApiCall } = useAxios<any, any>(ApiEndpoint.login, {
    method: "post",
    loader: true,
    shouldFetch: false,
  });

  useEffect(() => {
    if (authState && authState.access_token) {
      LocalStorageHelper.setObject(AUTH_COOKIE_KEY, authState);
    } else {
      LocalStorageHelper.removeAll();
    }
  }, [authState]);

  const logout = useCallback(() => {
    setAuthState(null);
    LocalStorageHelper.removeAll();
    window.location.href = "/login";
  }, []);

  const deptList = useCallback(async () => {
    try {
      const response = await customApiCall<null, any>(ApiEndpoint.common_api.deportment_list, "get");
      if (response) {
        // setUsers(response);
        LocalStorageHelper.setObject(AUTH_COOKIE_Department_KEY, response);
        // console.log("Fetched department list:", response);
      } else {
        // console.error("Failed to fetch department list.");
      }
    } catch (error) {
      // console.error("Error occurred while fetching department list:", error);
    }
  }, [customApiCall]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await refetch({
        payload: { username, password },
      });

      if (response?.status && response.data) {
        if (!response.data.org_data || response.data.org_data.length === 0) {
          toast.error("User not associated to any organization");
          logout();
          return false;
        }

        try {
          // Set cookies one by one
          LocalStorageHelper.setObject(AUTH_COOKIE_KEY, response.data);
          LocalStorageHelper.setObject(AUTH_COOKIE_ORG_KEY, response.data.org_data[0]);
          LocalStorageHelper.setObject(AUTH_COOKIE_OPTIONData_KEY, response.data.options);

          // Update state
          // setOptionList(response.data.options);
          // setCurrentOrg(response.data.org_data[0]);
          setAuthState(response.data);
          deptList()
          // Verify if cookies were set correctly
          // const authCookie = LocalStorageHelper.getObject(AUTH_COOKIE_KEY);
          // const orgCookie = LocalStorageHelper.getObject(AUTH_COOKIE_ORG_KEY);
          // const optionsCookie = LocalStorageHelper.getObject(AUTH_COOKIE_OPTIONData_KEY);

          // if (!authCookie || !orgCookie || !optionsCookie) {
          //   throw new Error("Failed to set one or more cookies");
          // }

          return true;
        } catch (error) {
          // console.error("Error setting cookies:", error);
          toast.error("Failed to save login information. Please try again.");
          logout();
          return false;
        }
      } else {
        return false;
      }
    },
    [deptList, logout, refetch],
  );

  const setCurrentOrgData = useCallback(
    (selectOrgID: string) => {
      if (!authState) {
        logout();
      }
      // if (selectOrgID && authState) {
      //   const findOrg = authState.org_data.find((item ) => item.value === Number(selectOrgID));
      //   if (findOrg) {
      //     LocalStorageHelper.setObject(AUTH_COOKIE_ORG_KEY, findOrg);
      //     setCurrentOrg(findOrg);
      //   }
      // }
    },
    [authState, logout],
  );

  return {
    authState,
    // optionList,
    loading,
    login,
    logout,
    // currentOrg,
    isAuthenticated: !!authState,
    setCurrentOrgData,
    deptList,
  };
}