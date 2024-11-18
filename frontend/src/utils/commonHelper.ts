// import { ApiResponse } from "../hooks/useAxios";
import * as XLSX from 'xlsx';
// import axiosInstance from "./api";
// import { ApiEndpoint } from "./apiEndpoint";
import { LocalStorageHelper } from "./localStorageHelper";

const AUTH_COOKIE_OPTIONData_KEY = "cookie_option_list";

export const getCookieOptionList = (): any | null => {
  return LocalStorageHelper.getObject<any>(AUTH_COOKIE_OPTIONData_KEY) || null;
};

const AUTH_COOKIE_Department_KEY = "cookie_dept_option_list";
export const getDeptOptionList = (): any | null => {
  return LocalStorageHelper.getObject<any>(AUTH_COOKIE_Department_KEY) || null;
};

export const getSelectedCourseList = (): any | null => {
  return LocalStorageHelper.getObject<any>("selectedCourse") || null;
};


export const formatTime = (date: Date) => {
  let hours = date.getHours(); // Use getHours() for local time
  const minutes = date.getMinutes(); // Use getMinutes() for local time
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Add leading zero to minutes if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  // Combine hours and minutes into a time string
  const time = `${hours}:${formattedMinutes}`;

  // Return the time and AM/PM separately
  return {
    time, // e.g. "1:15"
    ampm, // e.g. "PM"
  };
};

export const convertToTime = (timeString: string) => {
  // Create a new Date object for the current date
  const date = new Date();

  // Extract hours, minutes, and AM/PM from the time string
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format based on AM/PM
  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Set the hours and minutes on the current date
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

// downloadHelper.ts

export const downloadFile = (fileUrl: string, fileName: string) => {
  // Trigger file download by creating a temporary link element
  const baseUrl = window.location.origin;
  const link = document.createElement("a");
  link.href = baseUrl + fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};




export const exportToExcel = <T>(
  data: T[],
  fileName: string,
  sheetName: string = 'Sheet1'
): void => {
  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate and download the Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};