import axios from "axios";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const API = axios.create(options);

// Modified interceptor
API.interceptors.response.use(
  (response) => response, // Success case
  async (error) => {
    const originalRequest = error.config;
    const { status, data } = error.response || {};

    // Case 1: Token expired (401 + specific error message)
    if (
      status === 401 &&
      (data?.message === "Token expired" || data?.message === "Invalid token")
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Prevents infinite loops
        try {
          // Attempt to refresh tokens
          await API.get("/auth/refresh");
          // Retry the original request
          return API(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          // Redirect to login if refresh fails
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    // Case 2: Other 401 errors (e.g., no token)
    if (status === 401) {
      window.location.href = "/login"; // Force logout
    }

    // For all other errors, reject normally
    return Promise.reject(error);
  }
);

export default API;
