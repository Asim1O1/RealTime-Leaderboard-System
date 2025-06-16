import { Award, Crown, Medal } from "lucide-react";
import React from "react";
import { EnhancedLeaderboardEntry } from "./TopPerformers";

interface LeaderboardTableProps {
  data: EnhancedLeaderboardEntry[];
  currentUserId: number;
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

const getUserRowClass = (userId: number, currentUserId: number) => {
  return userId === currentUserId
    ? "bg-blue-50 border-l-4 border-blue-500"
    : "";
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  currentUserId,
}) => (
  <div
    className="rounded-xl shadow-lg overflow-hidden transition-colors duration-300"
    style={{
      background: "var(--table-bg)",
      boxShadow: "0 4px 6px var(--table-shadow)",
    }}
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead
          style={{
            background: "var(--table-header-bg)",
            borderBottom: "1px solid var(--table-border)",
          }}
        >
          <tr>
            <th
              className="px-6 py-4 text-left text-sm font-semibold"
              style={{ color: "var(--table-header-text)" }}
            >
              Rank
            </th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold"
              style={{ color: "var(--table-header-text)" }}
            >
              Player
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-semibold"
              style={{ color: "var(--table-header-text)" }}
            >
              WPM
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-semibold"
              style={{ color: "var(--table-header-text)" }}
            >
              Accuracy
            </th>
            <th
              className="px-6 py-4 text-center text-sm font-semibold"
              style={{ color: "var(--table-header-text)" }}
            >
              Games
            </th>
          </tr>
        </thead>
        <tbody
          style={{
            divideY: "1px solid var(--table-border)",
          }}
        >
          {data.length > 0 ? (
            data.map((entry) => (
              <tr
                key={`${entry.userId}-${entry.rank}`}
                className={`transition-colors duration-200 ${
                  entry.userId === currentUserId
                    ? "bg-[var(--current-user-row-bg)]"
                    : "hover:bg-[var(--table-row-hover)]"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: "var(--avatar-bg)",
                        color: "var(--avatar-text)",
                      }}
                    >
                      {entry.profileImage ? (
                        <img
                          src={entry.profileImage}
                          alt={`${entry.username} profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{entry.username.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--table-text-primary)" }}
                      >
                        {entry.username}
                        {entry.userId === currentUserId && (
                          <span
                            className="ml-2 text-xs px-2 py-1 rounded-full"
                            style={{
                              background: "var(--current-user-badge-bg)",
                              color: "var(--current-user-badge-text)",
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--wpm-text)" }}
                  >
                    {entry.score}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--accuracy-text)" }}
                  >
                    {entry.accuracy ?? "-"}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="text-sm"
                    style={{ color: "var(--table-text-secondary)" }}
                  >
                    {entry.gamesPlayed ?? 0}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center"
                style={{ color: "var(--table-text-secondary)" }}
              >
                No players found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
