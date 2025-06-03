import API from "../config/apiClient";

export const getLeaderboardApi = async () => {
  try {
    const response = await API.get("/leaderboard");
    console.log("Get Leaderboard response:", response);

    // Check if the response contains a success field
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch leaderboard");
    }

    return response.data.leaderboard;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};

export const getUserRankApi = async () => {
  try {
    const response = await API.get(`/leaderboard/rank`);
    console.log("Get User Rank response:", response);

    // Check if the response contains a success field
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch user rank");
    }

    return response.data.rank;
  } catch (error) {
    console.error("Failed to fetch user rank:", error);
    throw error;
  }
};
