import { RefreshCw } from "lucide-react";

export const LoadingIndicator = () => (
  <div className="flex items-center gap-2 text-indigo-600">
    <RefreshCw className="h-4 w-4 animate-spin" />
    <span className="text-sm">Loading new content...</span>
  </div>
);
