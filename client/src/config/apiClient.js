import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// API interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry on login or refresh endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Only try refresh if it's a 401 and retry hasn't been attempted
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const result = await API.post("/auth/refresh");

        if (result.status === 200) {
          // Retry the original request after refresh
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optional: Redirect only if the original request was auth-protected
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
