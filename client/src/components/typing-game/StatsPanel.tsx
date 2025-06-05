import { Timer } from "lucide-react";

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
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
      <div className="text-3xl font-bold text-gray-800">
        {formatTime(timeLeft)}
      </div>
      <div className="text-gray-600">Time Left</div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <div className="text-3xl font-bold text-green-600">{wpm}</div>
      <div className="text-gray-600">WPM</div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
      <div className="text-gray-600">Accuracy</div>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <div className="flex flex-col">
        <div className="text-3xl font-bold text-orange-600">
          {progressPercentage}%
        </div>
        <div className="text-gray-600">Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            role="progressbar"
          ></div>
        </div>
      </div>
    </div>
  </div>
);
