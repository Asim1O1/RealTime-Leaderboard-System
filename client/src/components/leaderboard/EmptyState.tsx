import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <div className="mx-auto max-w-md">
        <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Leaderboard is Empty
        </h2>
        <p className="text-gray-500 mb-6">
          No players have completed games yet. Be the first to compete!
        </p>
        <button
          onClick={() => navigate("/type")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Play Now
        </button>
      </div>
    </div>
  );
};
