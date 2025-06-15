import { History, Pause, RefreshCw, RotateCcw, Settings } from "lucide-react";

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
}) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-5 mb-6 border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Cute Title */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-700 mb-1">🚀 TypeMaster</h1>
        <p className="text-xs text-gray-500">Let's type together!</p>
      </div>

      {/* Floating Button Cloud */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {/* Settings - Cute Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`group relative px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
            showSettings
              ? "bg-purple-100 text-purple-700 shadow-lg shadow-purple-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:shadow-lg hover:shadow-gray-200"
          }`}
          aria-expanded={showSettings}
        >
          <div className="flex items-center gap-1.5">
            <Settings
              className={`h-4 w-4 transition-transform duration-300 ${
                showSettings ? "rotate-90" : "group-hover:rotate-45"
              }`}
            />
            <span className="hidden sm:block">Settings</span>
          </div>
        </button>

        {/* New Text - Primary Action */}
        <button
          onClick={handleNewText}
          disabled={isGameActive || loadingText}
          className="group relative px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200 disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          <div className="flex items-center gap-1.5">
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-300 ${
                loadingText ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span className="hidden sm:block">
              {loadingText ? "Loading..." : "New Text"}
            </span>
          </div>
        </button>

        {/* Pause - Only when active */}
        {isGameActive && (
          <button
            onClick={pauseGame}
            className="group px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-200 animate-bounce"
          >
            <div className="flex items-center gap-1.5">
              <Pause className="h-4 w-4" />
              <span className="hidden sm:block">Pause</span>
            </div>
          </button>
        )}

        {/* Reset - Soft Warning */}
        <button
          onClick={resetGame}
          className="group px-3 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-200"
        >
          <div className="flex items-center gap-1.5">
            <RotateCcw className="h-4 w-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="hidden sm:block">Reset</span>
          </div>
        </button>

        {/* Scores - Achievement */}
        <button
          onClick={handleViewScores}
          className="group px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-200"
        >
          <div className="flex items-center gap-1.5">
            <History className="h-4 w-4 group-hover:scale-125 transition-transform duration-300" />
            <span className="hidden sm:block">Scores</span>
          </div>
        </button>
      </div>
    </div>

    {/* Cute Status Bubble */}
    {(isGameActive || gameCompleted) && (
      <div className="mt-3 flex justify-center">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
            isGameActive
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isGameActive ? "bg-green-500 animate-pulse" : "bg-blue-500"
            }`}
          ></div>
          {isGameActive ? "✨ Typing in progress..." : "🎉 Great job!"}
        </div>
      </div>
    )}
  </div>
);
