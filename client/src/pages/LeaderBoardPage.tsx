import {
  AlertCircle,
  Award,
  Crown,
  Loader2,
  Medal,
  Search,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLeaderboardStore } from "../stores/leaderboard.store";

interface EnhancedLeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  profileImage?: string;
  score: number;
  accuracy?: number;
  gamesPlayed?: number;
}

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "daily" | "weekly" | "monthly" | "allTime"
  >("allTime");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");

  // Zustand store integration
  const {
    leaderboard,
    userRank,
    userScore,
    loading,
    error,
    fetchLeaderboard,
    fetchUserRank,
  } = useLeaderboardStore();

  console.log("Leaderboard Data:", leaderboard);

  // Fetch data on component mount and tab change
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLeaderboard();
        await fetchUserRank();
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      }
    };

    fetchData();
  }, [fetchLeaderboard, fetchUserRank, activeTab]);

  // Enhance leaderboard data with mock details for demonstration
  const enhancedLeaderboardData: EnhancedLeaderboardEntry[] = leaderboard.map(
    (entry, index) => ({
      ...entry,
      rank: index + 1,
      accuracy: Math.floor(Math.random() * 5) + 95,
      gamesPlayed: Math.floor(Math.random() * 200) + 50,
    })
  );

  // Add current user to leaderboard if not already present
  if (userRank !== null && userScore !== null) {
    const userAlreadyInLeaderboard = enhancedLeaderboardData.some(
      (entry) => entry.userId === 0 // Assuming userId 0 is current user
    );

    if (!userAlreadyInLeaderboard) {
      enhancedLeaderboardData.push({
        rank: userRank,
        userId: 0,
        username: "You",
        score: userScore,
        accuracy: Math.floor(Math.random() * 5) + 95,
        gamesPlayed: Math.floor(Math.random() * 200) + 50,
      });
    }
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

  const getUserRowClass = (userId: number) => {
    return userId === 0 ? "bg-blue-50 border-l-4 border-blue-500" : "";
  };

  const filteredData = enhancedLeaderboardData
    .filter((entry) => {
      const matchesSearch = entry.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => a.rank - b.rank);

  console.log("Filtered Data:", filteredData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-lg text-gray-700">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              fetchLeaderboard();
              fetchUserRank();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h1 className="text-4xl font-bold text-gray-800">
                Global Leaderboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Updated in real-time</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
            {[
              { key: "daily", label: "Daily" },
              { key: "weekly", label: "Weekly" },
              { key: "monthly", label: "Monthly" },
              { key: "allTime", label: "All Time" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {filteredData.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {filteredData.slice(0, 3).map((entry) => (
              <div
                key={entry.rank}
                className={`${getRankBg(
                  entry.rank
                )} rounded-xl p-6 border-2 shadow-lg`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                    {entry.username.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {entry.username}
                  </h3>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {entry.score} WPM
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.accuracy}% accuracy
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.gamesPlayed} games
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Leaderboard Table */}
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
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Country
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((entry) => (
                    <tr
                      key={`${entry.userId}-${entry.rank}`}
                      className={`hover:bg-gray-50 transition-colors ${getUserRowClass(
                        entry.userId
                      )}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {entry.username.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {entry.username}
                              {entry.userId === 0 && (
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
                          {entry.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-green-600">
                          {entry.accuracy}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600">
                          {entry.gamesPlayed}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        No players found matching your criteria
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More Button */}
        {filteredData.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Load More Players
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
