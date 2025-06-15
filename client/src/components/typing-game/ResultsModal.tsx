import { RefreshCw, Save, Trophy, X } from "lucide-react";

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  userInputLength: number;
  error: string | null;
  scoreSaved: boolean;
  loading: boolean;
  resetGame: () => void;
  handleNewText: () => void;
  handleSaveScore: () => void;
  onClose: () => void; // ✅ Add this line
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  wpm,
  accuracy,
  userInputLength,
  error,
  scoreSaved,
  loading,
  resetGame,
  handleNewText,
  handleSaveScore,
  onClose, // ✅ Accept the prop
}) => (
  <div className="relative bg-white rounded-xl shadow-lg p-8 border-2 border-green-200 mb-6">
    {/* ✅ Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <X className="h-6 w-6" />
    </button>

    <div className="text-center">
      <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Complete!</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{wpm} WPM</div>
          <div className="text-gray-600">Words Per Minute</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
          <div className="text-gray-600">Accuracy</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {userInputLength}
          </div>
          <div className="text-gray-600">Characters Typed</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {scoreSaved && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-4">
          Score saved successfully!
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={handleNewText}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Challenge
        </button>
        <button
          onClick={handleSaveScore}
          disabled={loading || scoreSaved}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : scoreSaved ? "Saved!" : "Save Score"}
        </button>
      </div>
    </div>
  </div>
);
