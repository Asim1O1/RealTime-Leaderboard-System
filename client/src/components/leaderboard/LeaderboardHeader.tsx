import { TrendingUp, Trophy } from "lucide-react";

export const LeaderboardHeader = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <Trophy
        className="h-8 w-8"
        style={{ color: "var(--trophy-icon, var(--accent))" }}
      />
      <h1
        className="text-4xl font-bold"
        style={{ color: "var(--heading-primary, var(--heading))" }}
      >
        Global Leaderboard
      </h1>
    </div>
    <div
      className="flex items-center gap-2 text-sm"
      style={{ color: "var(--text-secondary)" }}
    >
      <TrendingUp
        className="h-4 w-4"
        style={{ color: "var(--trending-icon, var(--accent))" }}
      />
      <span>Updated in real-time</span>
    </div>
  </div>
);
