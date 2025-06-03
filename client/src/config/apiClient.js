// api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // This is crucial for cookies to be sent
});

// Response interceptor for handling token refresh
// In your API interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh attempt for login endpoint
    if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // Only attempt refresh on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await API.get("/auth/refresh");
        return API(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
