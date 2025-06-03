import API from "../config/apiClient";

export const submitScoreApi = async (scoreData) => {
  try {
    const response = await API.post("/score/submit", scoreData);
    console.log("Submit Score response:", response);

    // Check if the response contains a success field
    if (!response.data.success) {
      throw new Error(response.data.message || "Score submission failed");
    }

    return response.data;
  } catch (error) {
    console.error("Score submission failed:", error);
    throw error;
  }
};

export const getMyScoresApi = async () => {
  try {
    const response = await API.get("/score/my-scores");
    console.log("Get My Scores response:", response);

    // Check if the response contains a success field
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch scores");
    }

    return response.data.scores;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    throw error;
  }
};
