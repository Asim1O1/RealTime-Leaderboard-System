import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getLeaderboardApi, getUserRankApi } from "../api/leaderboard.api";

interface LeaderboardEntry {
  value: any;
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
  fetchLeaderboard: (forceRefresh?: boolean) => Promise<void>;
  fetchUserRank: () => Promise<void>;
  clearLeaderboard: (refetch?: boolean) => Promise<void>;
  reset: () => void;
}

const initialState = {
  leaderboard: [],
  userRank: null,
  userScore: null,
  loading: false,
  error: null,
  lastFetched: null,
};

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchLeaderboard: async (forceRefresh = false) => {
        const state = get();

        // Skip if data is fresh (less than 5 minutes old) and not forcing refresh
        if (
          !forceRefresh &&
          state.lastFetched &&
          Date.now() - state.lastFetched < 5 * 60 * 1000 &&
          state.leaderboard.length > 0 // Also check if we have data
        ) {
          return;
        }

        set({ loading: true, error: null });
        try {
          console.log("Fetching leaderboard...");
          const leaderboard = await getLeaderboardApi();
          console.log("Fetched leaderboard:", leaderboard);
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
          const { rank, score } = await getUserRankApi();
          set({ userRank: rank, userScore: score, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch user rank",
            loading: false,
          });
          throw err;
        }
      },

      clearLeaderboard: async (refetch = true) => {
        set({
          leaderboard: [],
          userRank: null,
          userScore: null,
          error: null,
          lastFetched: null,
        });

        if (refetch) {
          await get().fetchLeaderboard(true);
          await get().fetchUserRank();
        }
      },

      reset: () => {
        set(initialState);
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
