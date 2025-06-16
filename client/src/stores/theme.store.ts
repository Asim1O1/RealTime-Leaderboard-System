import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "ocean" | "forest" | "sunset";

interface ThemeState {
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      themes: ["light", "dark", "ocean", "forest", "sunset"],
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage", // name for localStorage
    }
  )
);
