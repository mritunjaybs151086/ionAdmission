import axios from "axios";
import { LocalStorageHelper } from "./localStorageHelper";
// import { loginData, orgDataResponse } from "../pages/login/loginModel";
import { toast } from "react-toastify";

const AUTH_COOKIE_KEY = "auth_state";
const AUTH_COOKIE_ORG_KEY = "auth_org_state";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }
    const authState = LocalStorageHelper.getObject<any>(AUTH_COOKIE_KEY);
    const authOrg = LocalStorageHelper.getObject<any>(AUTH_COOKIE_ORG_KEY);
    if (authState && authState?.access_token) {
      config.headers.Authorization = `Bearer ${authState.access_token}`;
    }
    // console.log('a-asd-asd-asd',authState, authOrg)
    if (authOrg && authOrg?.value) {
      config.headers["org-id"] = authOrg?.value;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 404) {
      toast.error(error.response.message);
    }
    if (error.response.status === 401) {
      LocalStorageHelper.removeAll();
      window.location.href = "/login";
    }
    // if (error.response) {
    //   LocalStorageHelper.removeAll();
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  },
);

export default axiosInstance;
