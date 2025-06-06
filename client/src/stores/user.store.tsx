import { create } from "zustand";
import { updateUserProfileApi, userProfileApi } from "../api/user.api";

type User = {
  id: number;
  email: string;
  username: string;
  profileImage?: string;
  createdAt: string;
};

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updatedData: FormData) => Promise<void>;
  clearError: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      set({ loading: true, error: null });
      const data = await userProfileApi();
      set({ user: data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch user profile",
        loading: false,
      });
    }
  },

  updateUserProfile: async (updatedData) => {
    try {
      set({ loading: true, error: null });
      const data = await updateUserProfileApi(updatedData);
      set({ user: data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to update user profile",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
