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
        className="rounded-lg p-4 border-2 transition-all duration-200 hover:border-opacity-80"
        style={{
          background: "var(--card-background)",
          borderColor:
            entry.rank === 1
              ? "var(--primary-color, #10b981)"
              : "var(--border)",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        <div className="text-center">
          {/* Rank indicator with typing theme */}
          <div className="flex justify-center items-center mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background:
                  entry.rank === 1
                    ? "var(--primary-color, #10b981)"
                    : entry.rank === 2
                    ? "#f59e0b"
                    : entry.rank === 3
                    ? "#ef4444"
                    : "var(--border)",
                color: entry.rank <= 3 ? "white" : "var(--text)",
              }}
            >
              #{entry.rank}
            </div>
          </div>

          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center"
            style={{
              background: "var(--border)",
              border: "2px solid var(--border)",
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
                className="font-bold text-sm"
                style={{
                  color: "var(--text)",
                }}
              >
                {entry.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Username */}
          <h3
            className="font-bold text-base mb-3"
            style={{
              color: "var(--text)",
            }}
          >
            {entry.username}
          </h3>

          {/* Stats in terminal style */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                wpm:
              </span>
              <span
                className="font-bold text-lg"
                style={{
                  color:
                    entry.rank === 1
                      ? "var(--primary-color, #10b981)"
                      : "var(--text)",
                }}
              >
                {entry.score}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                acc:
              </span>
              <span
                className="text-sm font-mono"
                style={{ color: "var(--text)" }}
              >
                {entry.accuracy ?? "-"}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                games:
              </span>
              <span
                className="text-sm font-mono"
                style={{ color: "var(--text-tertiary)" }}
              >
                {entry.gamesPlayed ?? 0}
              </span>
            </div>
          </div>

          {/* Progress bar for top performer */}
          {entry.rank === 1 && (
            <div
              className="mt-3 pt-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: "var(--text-secondary)" }}>champion</span>
                <div
                  className="flex-1 h-1 rounded-full"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="h-1 rounded-full animate-pulse"
                    style={{
                      background: "var(--primary-color, #10b981)",
                      width: "100%",
                    }}
                  />
                </div>
                <span style={{ color: "var(--primary-color, #10b981)" }}>
                  👑
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
