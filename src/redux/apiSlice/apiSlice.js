import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { logout } from "./authSlice";

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl);

// Navigation service for React Router
let navigate = null;
export const setNavigate = (navigateFn) => {
  navigate = navigateFn;
};

// Helper to safely navigate
const safeNavigate = (path) => {
  if (navigate) {
    navigate(path);
  } else {
    window.location.href = path;
  }
};

// Base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const textBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  responseHandler: (response) => response.text(),
});

// Custom base query with error handling
const customBaseQuery = async (args, api, extraOptions) => {
  const isTextResponse = typeof args === "object" && args?.url?.includes("/export/");

  const result = isTextResponse
    ? await textBaseQuery(args, api, extraOptions)
    : await baseQuery(args, api, extraOptions);

  // Handle 401 - Unauthorized (logout user)
  if (result?.error?.status === 401) {
    handleLogout(api);
    return result;
  }

  // Handle specific access denied scenario
  const accessDeniedMessage =
    result?.data?.message === "you do not have access to this account" ||
    result?.error?.data?.message === "you do not have access to this account";

  if (
    accessDeniedMessage &&
    !window.location.pathname.startsWith("/dashboard")
  ) {
    toast.error("You do not have access to this account");
    setTimeout(() => {
      safeNavigate("/dashboard/home");
    }, 800);
    return result;
  }

  if (result?.error?.status >= 500) {
    const errorMessage =
      result?.error?.data?.message || "Server error. Please try again later.";
    toast.error(errorMessage);
    return result;
  }

  // Handle network errors (no status code)
  if (result?.error && !result?.error?.status) {
    toast.error("Network error. Please check your connection.");
    return result;
  }

  return result;
};
let isLoggingOut = false;
const handleLogout = (api) => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  toast.error("Session expired. Please login again.");
  api.dispatch(logout());
  setTimeout(() => {
    safeNavigate("/login");
    isLoggingOut = false;
  }, 1000);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,

  // Cache configuration
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  // Refetch configuration
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: false, // Don't refetch on window focus
  refetchOnReconnect: true, // Refetch when internet reconnects

  tagTypes: ["User", "Scan", "Property", "UserProfile", "Affiliates", "ModerationQueue"],

  endpoints: () => ({}),
});
