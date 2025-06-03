import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getLeaderboardApi, getUserRankApi } from "../api/leaderboard.api";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  profileImage?: string;
  score: number;
}
interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  userScore: number | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
  fetchUserRank: (userId: number) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      leaderboard: [],
      userRank: null,
      userScore: null,
      loading: false,
      error: null,

      fetchLeaderboard: async () => {
        set({ loading: true, error: null });
        try {
          const leaderboard = await getLeaderboardApi();
          set({ leaderboard, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch leaderboard",
            loading: false,
          });
          throw err;
        }
      },

      fetchUserRank: async () => {
        set({ loading: true, error: null });
        try {
          const { rank, score } = await getUserRankApi(); // no userId needed
          set({ userRank: rank, userScore: score, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch user rank",
            loading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "leaderboard-storage", // unique name for the storage
    }
  )
);
