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
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Player
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
              WPM
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
              Accuracy
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
              Games
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((entry) => (
              <tr
                key={`${entry.userId}-${entry.rank}`}
                className={`hover:bg-gray-50 transition-colors ${getUserRowClass(
                  entry.userId,
                  currentUserId
                )}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
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
                      <div className="font-semibold text-gray-800">
                        {entry.username}
                        {entry.userId === currentUserId && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-blue-600">
                    {entry.compositeScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-green-600">
                    {entry.averageAccuracy ?? "-"}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-600">
                    {entry.gamesPlayed ?? 0}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                No players found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
