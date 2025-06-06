import API from "../config/apiClient";

export const userProfileApi = async () => {
  try {
    const response = await API.get("/user/profile");
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }
    return response?.data;
  } catch (error) {
    console.error("The error while fetching user profile is", error);
    throw error;
  }
};

export const updateUserProfileApi = async (updatedData) => {
  try {
    const response = await API.post("/user/profile");
    console.log("the result is", response);

    if (!response?.data?.sucess) {
      throw new Error(response.data.message || "User profile failed");
    }

    return response?.data;
  } catch (error) {
    console.error("The error is", error);
    throw error;
  }
};
