import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="flex flex-col items-center">
      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
      <p className="text-lg text-gray-700">Loading leaderboard...</p>
    </div>
  </div>
);
