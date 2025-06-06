import API from "../config/apiClient";

export const registerApi = async (userData) => {
  try {
    const config =
      userData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await API.post("/auth/register", userData, config);
    console.log("Registration response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const loginApi = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    console.log("Login response:", response);
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logOutApi = async () => {
  try {
    const response = await API.post("/auth/logout");
    console.log("Logout response:", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Logout failed");
    }
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
