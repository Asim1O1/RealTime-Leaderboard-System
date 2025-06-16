import {
  HelpCircle,
  History,
  Pause,
  RefreshCw,
  RotateCcw,
  Settings,
} from "lucide-react";

interface GameHeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  loadingText: boolean;
  isGameActive: boolean;
  gameCompleted: boolean;
  handleNewText: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  handleViewScores: () => void;
  setShowKeyboardHelp: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  showSettings,
  setShowSettings,
  loadingText,
  isGameActive,
  gameCompleted,
  handleNewText,
  pauseGame,
  resetGame,
  handleViewScores,
  setShowKeyboardHelp,
}) => (
  <div
    className="rounded-3xl shadow-2xl p-5 mb-6 transition-all duration-500 hover:-translate-y-1"
    style={{
      background: "var(--card-background)",
      border: "1px solid var(--card-border)",
      boxShadow: "var(--shadow-lg)",
    }}
  >
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Title Section */}
      <div className="text-center sm:text-left">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--heading)" }}
        >
          🚀 TypeIt
        </h1>
        <p style={{ color: "var(--text-tertiary)" }} className="text-xs">
          Let's type together!
        </p>
      </div>

      {/* Button Group */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="group relative px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          style={{
            background: showSettings ? "var(--secondary)" : "var(--button-bg)",
            color: showSettings ? "white" : "var(--button-text)",
            boxShadow: showSettings ? "var(--shadow-md)" : "none",
          }}
          aria-expanded={showSettings}
        >
          <div className="flex items-center gap-1.5">
            <Settings
              className="h-4 w-4 transition-transform duration-300"
              style={{
                transform: showSettings ? "rotate(90deg)" : "none",
              }}
            />
            <span className="hidden sm:block">Settings</span>
          </div>
        </button>

        {/* New Text Button */}
        <button
          onClick={handleNewText}
          disabled={isGameActive || loadingText}
          className="group relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0"
          style={{
            background:
              isGameActive || loadingText
                ? "var(--button-hover)"
                : "var(--primary-button-bg)",
            color: "var(--primary-button-text)",
            boxShadow: "var(--shadow-md)",
            opacity: isGameActive || loadingText ? 0.7 : 1,
          }}
        >
          <div className="flex items-center gap-1.5">
            <RefreshCw
              className="h-4 w-4 transition-transform duration-300"
              style={{
                animation: loadingText ? "spin 1s linear infinite" : "none",
                transform: loadingText ? "none" : "group-hover:rotate-180",
              }}
            />
            <span className="hidden sm:block">
              {loadingText ? "Loading..." : "New Text"}
            </span>
          </div>
        </button>

        {/* Pause Button (Conditional) */}
        {isGameActive && (
          <button
            onClick={pauseGame}
            className="group px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            style={{
              background: "var(--accent)",
              color: "white",
              boxShadow: "var(--shadow-md)",
              animation: "bounce 1s infinite",
            }}
          >
            <div className="flex items-center gap-1.5">
              <Pause className="h-4 w-4" />
              <span className="hidden sm:block">Pause</span>
            </div>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={resetGame}
          className="group px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          style={{
            background: "var(--button-hover)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <RotateCcw
              className="h-4 w-4 transition-transform duration-500"
              style={{
                transform: "group-hover:-rotate-180",
              }}
            />
            <span className="hidden sm:block">Reset</span>
          </div>
        </button>

        {/* Scores Button */}
        <button
          onClick={handleViewScores}
          className="group px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          style={{
            background: "var(--success-bg)",
            color: "var(--success-text)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <History
              className="h-4 w-4 transition-transform duration-300"
              style={{
                transform: "group-hover:scale-125",
              }}
            />
            <span className="hidden sm:block">Scores</span>
          </div>
        </button>

        {/* Help Button */}
        <button
          onClick={() => setShowKeyboardHelp(true)}
          className="group px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            boxShadow: "var(--shadow-sm)",
          }}
          title="Keyboard Shortcuts (F1)"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle
              className="h-4 w-4 transition-transform duration-300"
              style={{
                transform: "group-hover:scale-125",
              }}
            />
            <span className="hidden sm:block">Help</span>
          </div>
        </button>
      </div>
    </div>

    {/* Status Indicator */}
    {(isGameActive || gameCompleted) && (
      <div className="mt-3 flex justify-center">
        <div
          className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
          style={{
            background: isGameActive
              ? "var(--success-bg)"
              : "var(--primary-button-hover)",
            color: isGameActive
              ? "var(--success-text)"
              : "var(--primary-button-text)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isGameActive
                ? "var(--success-text)"
                : "var(--primary-button-text)",
              animation: isGameActive ? "pulse 1.5s infinite" : "none",
            }}
          ></div>
          {isGameActive ? "✨ Typing in progress..." : "🎉 Great job!"}
        </div>
      </div>
    )}
  </div>
);
