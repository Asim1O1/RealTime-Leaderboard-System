import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, logOutApi, registerApi } from "../api/auth.api";

interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const data = await registerApi(userData);
          set({ user: data.user, isAuthenticated: true, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Registration failed",
            loading: false,
          });
          throw err;
        }
      },

      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const data = await loginApi(credentials);
          console.log("Login data:", data);
          set({ user: data.user, isAuthenticated: true, loading: false });
        } catch (err: any) {
          console.log("Login error:", err);
          set({
            error: err?.message || "Login failed",
            loading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          await logOutApi();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
