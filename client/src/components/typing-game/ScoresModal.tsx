import { Award, Calendar, Star, Target, Trophy, X, Zap } from "lucide-react";

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
}) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Star className="w-6 h-6 text-amber-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200 shadow-lg transform hover:scale-105";
      case 1:
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200 shadow-md transform hover:scale-102";
      case 2:
        return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200 shadow-md transform hover:scale-102";
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200 hover:border-blue-300 transform hover:scale-101";
    }
  };

  const getPositionText = (index: number) => {
    const suffixes = ["st", "nd", "rd"];
    const suffix = suffixes[index] || "th";
    return `${index + 1}${suffix}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Scores</h2>
                <p className="text-indigo-100 text-sm">
                  Track your typing progress
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowScores(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 transform hover:scale-110"
              aria-label="Close scores panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-gray-600 font-medium">
                Loading your scores...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="p-4 bg-red-100 rounded-full">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium text-center">
                {error || "Failed to fetch scores"}
              </p>
            </div>
          ) : scores.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Personal Best Scores
                </h3>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {scores.length} record{scores.length !== 1 ? "s" : ""}
                </div>
              </div>

              {scores
                .sort((a, b) => (b.value || b.score) - (a.value || a.score))
                .map((score, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${getRankStyles(
                      index
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(index)}
                          <span className="font-bold text-gray-700 text-lg">
                            {getPositionText(index)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-indigo-500" />
                          <span className="text-2xl font-bold text-gray-800">
                            {score.value || score.score}
                          </span>
                          <span className="text-gray-600 font-medium">WPM</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(score.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {index < 3 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {index === 0
                              ? "Personal Best!"
                              : index === 1
                              ? "Runner Up"
                              : "Third Place"}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(3 - index)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                <Trophy className="w-16 h-16 text-indigo-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  No scores yet!
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Complete your first typing game to start tracking your
                  progress and see your scores here.
                </p>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium shadow-lg">
                Start Your First Game
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
