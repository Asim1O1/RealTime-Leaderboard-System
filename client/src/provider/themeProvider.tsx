import React, { useEffect } from "react";
import { useThemeStore } from "../stores/theme.store";
import { themeStyles } from "../styles/themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme variables to root element
    const root = document.documentElement;
    const currentTheme = themeStyles[theme];

    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Set data-theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
};
