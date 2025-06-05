import {
  History,
  Pause,
  Play,
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
  startGame: () => void;
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
  startGame,
  pauseGame,
  resetGame,
  handleViewScores,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-3xl font-bold text-gray-800">
        Dynamic Typing Speed Test
      </h1>
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          aria-expanded={showSettings}
          aria-controls="settings-panel"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Settings</span>
        </button>
        <button
          onClick={handleNewText}
          disabled={isGameActive || loadingText}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          aria-busy={loadingText}
        >
          <RefreshCw
            className={`h-4 w-4 ${loadingText ? "animate-spin" : ""}`}
          />
          <span className="sr-only md:not-sr-only">New Text</span>
        </button>
        {!isGameActive && !gameCompleted && (
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Start Game</span>
          </button>
        )}
        {isGameActive && (
          <button
            onClick={pauseGame}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Pause className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Pause</span>
          </button>
        )}
        <button
          onClick={resetGame}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Reset</span>
        </button>
        <button
          onClick={handleViewScores}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <History className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Scores</span>
        </button>
      </div>
    </div>
  </div>
);
