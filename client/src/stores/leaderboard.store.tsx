import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getLeaderboardApi, getUserRankApi } from "../api/leaderboard.api";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  profileImage?: string;
  score: number;
  accuracy?: number;
  gamesPlayed?: number;
}

interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  userScore: number | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchLeaderboard: () => Promise<void>;
  fetchUserRank: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      leaderboard: [],
      userRank: null,
      userScore: null,
      loading: false,
      error: null,
      lastFetched: null,

      fetchLeaderboard: async (forceRefresh = false) => {
        const state = get();

        // Skip if data is fresh (less than 5 minutes old) and not forcing refresh
        if (
          !forceRefresh &&
          state.lastFetched &&
          Date.now() - state.lastFetched < 5 * 60 * 1000
        ) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const leaderboard = await getLeaderboardApi();
          set({
            leaderboard,
            loading: false,
            lastFetched: Date.now(),
          });
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
      name: "leaderboard-storage",
      partialize: (state) => ({
        leaderboard: state.leaderboard,
        userRank: state.userRank,
        userScore: state.userScore,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
