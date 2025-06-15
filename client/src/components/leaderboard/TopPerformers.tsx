import { Award, Crown, Medal } from "lucide-react";
import React from "react";

export interface EnhancedLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  profileImage?: string;
  score?: number;
  gamesPlayed?: number;
  isCurrentUser?: boolean;
  performanceBadge?: string;
  accuracy?: number;
}

interface TopPerformersProps {
  data: EnhancedLeaderboardEntry[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200";
    case 2:
      return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200";
    case 3:
      return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200";
    default:
      return "bg-white border-gray-200";
  }
};

export const TopPerformers: React.FC<TopPerformersProps> = ({ data }) => (
  <div className="grid md:grid-cols-3 gap-4 mb-8">
    {data.map((entry) => (
      <div
        key={entry.rank}
        className={`${getRankBg(entry.rank)} rounded-xl p-6 border-2 shadow-lg`}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {getRankIcon(entry.rank)}
          </div>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
            {entry.profileImage ? (
              <img
                src={entry.profileImage}
                alt={`${entry.username} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {entry.username.charAt(0)}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            {entry.username}
          </h3>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {entry.score} WPM
            </div>
            <div className="text-sm text-gray-600">
              {entry.accuracy ?? "-"}% accuracy
            </div>
            <div className="text-xs text-gray-500">
              {entry.gamesPlayed ?? 0} games
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
