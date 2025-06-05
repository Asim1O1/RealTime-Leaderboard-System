import React, { useEffect, useState } from "react";
import { EmptyState } from "../components/leaderboard/EmptyState";
import { ErrorState } from "../components/leaderboard/ErrorState";
import { LeaderboardHeader } from "../components/leaderboard/LeaderboardHeader";
import { LeaderboardSearch } from "../components/leaderboard/LeaderboardSearch";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { LeaderboardTabs } from "../components/leaderboard/LeaderboardTabs";
import { LoadingState } from "../components/leaderboard/LoadingState";
import { TopPerformers } from "../components/leaderboard/TopPerformers";
import { useAuthStore } from "../stores/auth.store";
import { useLeaderboardStore } from "../stores/leaderboard.store";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "daily" | "weekly" | "monthly" | "allTime"
  >("allTime");
  const [searchTerm, setSearchTerm] = useState("");

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

  const { user } = useAuthStore();
  const currentUserId = user?.id || 0;

  // Fetch data effects (same as original)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLeaderboard(true);
        await fetchUserRank();
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchLeaderboard(true);
        await fetchUserRank();
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const enhancedLeaderboardData = leaderboard.map((entry) => ({
    ...entry,
    isCurrentUser: entry.userId === currentUserId,
    performanceBadge:
      entry.score >= 100
        ? "expert"
        : entry.score >= 50
        ? "intermediate"
        : "beginner",
  }));

  const filteredData = enhancedLeaderboardData
    .filter((entry) =>
      entry.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.rank - b.rank);

  const handleRetry = async () => {
    try {
      await fetchLeaderboard(true);
      await fetchUserRank();
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={handleRetry} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <LeaderboardHeader />
          <LeaderboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <LeaderboardSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {leaderboard.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <TopPerformers data={filteredData.slice(0, 3)} />
            <LeaderboardTable
              data={filteredData}
              currentUserId={currentUserId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
