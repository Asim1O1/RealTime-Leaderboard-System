import React, { useEffect, useState } from "react";
import { EmptyState } from "../components/leaderboard/EmptyState";
import { ErrorState } from "../components/leaderboard/ErrorState";
import { LeaderboardSearch } from "../components/leaderboard/LeaderboardSearch";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { LeaderboardTabs } from "../components/leaderboard/LeaderboardTabs";
import { LoadingState } from "../components/leaderboard/LoadingState";
import { TopPerformers } from "../components/leaderboard/TopPerformers";
import { useAuthStore } from "../stores/auth.store";
import { useLeaderboardStore } from "../stores/leaderboard.store";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"allTime">("allTime");
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
    <div
      className="min-h-screen p-4"
      style={{
        background: "var(--background)",
        color: "var(--text)",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Clean header with typing cursor animation */}
        <div
          className="rounded-lg p-6 mb-6 relative"
          style={{
            background: "var(--card-background)",
            border: "2px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold">⌨️ Leaderboard</span>
            <span
              className="w-0.5 h-6 bg-current animate-pulse"
              style={{
                animation: "blink 1s infinite",
                background: "var(--primary-color, #10b981)",
              }}
            />
          </div>

          <LeaderboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <LeaderboardSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {leaderboard.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{
              background: "var(--card-background)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="text-6xl mb-4">⌨️</div>
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 with typing-themed design */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "var(--card-background)",
                border: "2px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-lg">🏆 Top Typists</span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border)" }}
                />
              </div>
              <TopPerformers data={filteredData.slice(0, 3)} />
            </div>

            {/* Full rankings with terminal-like styling */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "var(--card-background)",
                border: "2px solid var(--border)",
              }}
            >
              <div className="p-6">
                <LeaderboardTable
                  data={filteredData}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating WPM indicator */}
        <div className="fixed bottom-6 right-6">
          <div
            className="px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2 shadow-lg"
            style={{
              background: "var(--card-background)",
              border: "2px solid var(--primary-color, #10b981)",
              color: "var(--primary-color, #10b981)",
            }}
          >
            <span>WPM</span>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--primary-color, #10b981)" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        .font-mono {
          font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
