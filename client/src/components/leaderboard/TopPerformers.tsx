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
        className={`rounded-xl p-6 border-2 shadow-lg transition-all duration-300 ${
          entry.rank === 1 ? "hover:scale-[1.02]" : "hover:scale-[1.01]"
        }`}
        style={{
          background: `var(--rank-${entry.rank}-bg)`,
          borderColor: `var(--rank-${entry.rank}-border)`,
          boxShadow: "0 4px 6px var(--card-shadow)",
        }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {getRankIcon(entry.rank)}
          </div>
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center"
            style={{
              background: "var(--avatar-bg)",
            }}
          >
            {entry.profileImage ? (
              <img
                src={entry.profileImage}
                alt={`${entry.username} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="font-bold text-lg"
                style={{
                  color: "var(--avatar-text)",
                }}
              >
                {entry.username.charAt(0)}
              </span>
            )}
          </div>
          <h3
            className="font-bold text-lg mb-2"
            style={{
              color: `var(--rank-${entry.rank}-text)`,
            }}
          >
            {entry.username}
          </h3>
          <div className="space-y-1">
            <div
              className="text-2xl font-bold"
              style={{
                color: `var(--rank-${entry.rank}-score)`,
              }}
            >
              {entry.score} WPM
            </div>
            <div
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {entry.accuracy ?? "-"}% accuracy
            </div>
            <div
              className="text-xs"
              style={{
                color: "var(--text-tertiary)",
              }}
            >
              {entry.gamesPlayed ?? 0} games
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
