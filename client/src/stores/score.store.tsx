import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getMyScoresApi, submitScoreApi } from "../api/score.api";

interface Score {
  id: number;
  userId: number;
  score: number;
  accuracy: number;
  createdAt: string;
}
interface ScoreData {
  score: number;
  accuracy: number;
}

interface ScoreState {
  scores: Score[];
  loading: boolean;
  error: string | null;
  submitScore: (scoreData: ScoreData) => Promise<void>;
  getMyScores: () => Promise<void>;
}
export const useScoreStore = create<ScoreState>()(
  persist(
    (set) => ({
      scores: [],
      loading: false,
      error: null,

      submitScore: async (scoreData) => {
        set({ loading: true, error: null });
        try {
          const data = await submitScoreApi({
            score: scoreData.score, // Map to your API expected format
            accuracy: scoreData.accuracy,
          });
          set((state) => ({
            scores: [...state.scores, data.score],
            loading: false,
          }));
        } catch (err: any) {
          set({
            error: err.message || "Score submission failed",
            loading: false,
          });
          throw err;
        }
      },

      getMyScores: async () => {
        set({ loading: true, error: null });
        try {
          const scores = await getMyScoresApi();
          console.log("Fetched scores:", scores);
          set({ scores, loading: false });
        } catch (err: any) {
          console.error("Error fetching scores:", err);
          set({
            error: err.message || "Failed to fetch scores",
            loading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "score-storage",
    }
  )
);
