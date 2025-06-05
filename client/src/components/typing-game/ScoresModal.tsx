import { Trophy } from "lucide-react";

interface ScoresModalProps {
  scores: any[];
  loading: boolean;
  error: string | null;
  setShowScores: (show: boolean) => void;
}

export const ScoresModal: React.FC<ScoresModalProps> = ({
  scores,
  loading,
  error,
  setShowScores,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Scores</h2>
      <button
        onClick={() => setShowScores(false)}
        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        aria-label="Close scores panel"
      >
        ×
      </button>
    </div>

    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading scores...</p>
      </div>
    ) : error ? (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        {error || "Failed to fetch scores"}
      </div>
    ) : scores.length > 0 ? (
      <div className="space-y-3">
        {scores
          .sort((a, b) => (b.value || b.score) - (a.value || a.score))
          .map((score, index) => (
            <div
              key={score.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                <span className="font-semibold text-gray-800">
                  #{index + 1}
                </span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {score.value || score.score} WPM
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(score.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        No scores yet. Complete a game to save your first score!
      </div>
    )}
  </div>
);
