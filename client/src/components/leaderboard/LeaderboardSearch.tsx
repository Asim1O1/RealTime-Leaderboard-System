import { Search } from "lucide-react";
import React from "react";

interface LeaderboardSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const LeaderboardSearch: React.FC<LeaderboardSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex gap-4 mb-6">
    <div className="flex-1 relative">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
        style={{ color: "var(--input-placeholder)" }}
      />
      <input
        type="text"
        placeholder="Search players..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:outline-none"
        style={{
          background: "var(--input-background)",
          color: "var(--input-text)",
          border: "1px solid var(--input-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      />
    </div>
  </div>
);
