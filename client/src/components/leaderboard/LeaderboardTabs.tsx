import React from "react";

type TabKey = "allTime";

interface LeaderboardTabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  setActiveTab,
}) => (
  <div
    className="flex gap-1 rounded-lg p-1 mb-6"
    style={{ background: "var(--toggle-background)" }}
  >
    {[{ key: "allTime", label: "All Time" }].map(({ key, label }) => (
      <button
        key={key}
        onClick={() => setActiveTab(key as TabKey)}
        className={`px-6 py-2 rounded-md font-medium transition-all`}
        style={{
          background:
            activeTab === key
              ? "var(--toggle-active-background)"
              : "transparent",
          color:
            activeTab === key
              ? "var(--toggle-active-text)"
              : "var(--toggle-inactive-text)",
          boxShadow: activeTab === key ? "var(--shadow-sm)" : "none",
        }}
      >
        {label}
      </button>
    ))}
  </div>
);
