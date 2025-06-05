import React from "react";

type TabKey = "daily" | "weekly" | "monthly" | "allTime";

interface LeaderboardTabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  setActiveTab,
}) => (
  <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
    {[
      { key: "daily", label: "Daily" },
      { key: "weekly", label: "Weekly" },
      { key: "monthly", label: "Monthly" },
      { key: "allTime", label: "All Time" },
    ].map(({ key, label }) => (
      <button
        key={key}
        onClick={() => setActiveTab(key as TabKey)}
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
);
