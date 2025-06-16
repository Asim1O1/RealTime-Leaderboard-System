import { LoaderCircle, Target, Timer, TrendingUp } from "lucide-react";

interface StatsPanelProps {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  progressPercentage: number;
  formatTime: (seconds: number) => string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  timeLeft,
  wpm,
  accuracy,
  progressPercentage,
  formatTime,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {/* Time Left */}
    <div
      className="rounded-lg p-6 shadow-lg text-center transition-colors duration-300"
      style={{
        background: "var(--stat-card-bg)",
        boxShadow: "0 4px 6px var(--stat-card-shadow)",
      }}
    >
      <Timer
        className="h-8 w-8 mx-auto mb-2"
        style={{ color: "var(--time-icon)" }}
      />
      <div className="text-3xl font-bold" style={{ color: "var(--time-text)" }}>
        {formatTime(timeLeft)}
      </div>
      <div style={{ color: "var(--stat-label)" }}>Time Left</div>
    </div>

    {/* Words Per Minute */}
    <div
      className="rounded-lg p-6 shadow-lg text-center transition-colors duration-300"
      style={{
        background: "var(--stat-card-bg)",
        boxShadow: "0 4px 6px var(--stat-card-shadow)",
      }}
    >
      <TrendingUp
        className="h-8 w-8 mx-auto mb-2"
        style={{ color: "var(--wpm-icon)" }}
      />
      <div className="text-3xl font-bold" style={{ color: "var(--wpm-text)" }}>
        {wpm}
      </div>
      <div style={{ color: "var(--stat-label)" }}>WPM</div>
    </div>

    {/* Accuracy */}
    <div
      className="rounded-lg p-6 shadow-lg text-center transition-colors duration-300"
      style={{
        background: "var(--stat-card-bg)",
        boxShadow: "0 4px 6px var(--stat-card-shadow)",
      }}
    >
      <Target
        className="h-8 w-8 mx-auto mb-2"
        style={{ color: "var(--accuracy-icon)" }}
      />
      <div
        className="text-3xl font-bold"
        style={{ color: "var(--accuracy-text)" }}
      >
        {accuracy}%
      </div>
      <div style={{ color: "var(--stat-label)" }}>Accuracy</div>
    </div>

    {/* Progress */}
    <div
      className="rounded-lg p-6 shadow-lg text-center transition-colors duration-300"
      style={{
        background: "var(--stat-card-bg)",
        boxShadow: "0 4px 6px var(--stat-card-shadow)",
      }}
    >
      <LoaderCircle
        className="h-8 w-8 mx-auto mb-2 animate-spin-slow"
        style={{ color: "var(--progress-icon)" }}
      />
      <div
        className="text-3xl font-bold"
        style={{ color: "var(--progress-text)" }}
      >
        {progressPercentage}%
      </div>
      <div style={{ color: "var(--stat-label)" }}>Progress</div>
      <div
        className="w-full rounded-full h-2.5 mt-2"
        style={{ background: "var(--progress-track-bg)" }}
      >
        <div
          className="h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
            background: "var(--progress-fill-bg)",
          }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>
    </div>
  </div>
);
