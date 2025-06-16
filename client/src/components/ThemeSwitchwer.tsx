import { useThemeStore } from "../stores/theme.store";

export const ThemeSwitcher = () => {
  const { theme, themes, setTheme } = useThemeStore();

  return (
    <div className="theme-switcher p-4 bg-white/10 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-medium mb-2">Select Theme</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-4 py-2 rounded-full capitalize transition-colors ${
              theme === t
                ? "bg-primary text-white"
                : "bg-secondary/20 hover:bg-secondary/30"
            }`}
            aria-label={`Switch to ${t} theme`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};
