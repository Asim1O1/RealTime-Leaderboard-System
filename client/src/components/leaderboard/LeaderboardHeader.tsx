import { TrendingUp, Trophy } from "lucide-react";

export const LeaderboardHeader = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <Trophy className="h-8 w-8 text-yellow-500" />
      <h1 className="text-4xl font-bold text-gray-800">Global Leaderboard</h1>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <TrendingUp className="h-4 w-4" />
      <span>Updated in real-time</span>
    </div>
  </div>
);
