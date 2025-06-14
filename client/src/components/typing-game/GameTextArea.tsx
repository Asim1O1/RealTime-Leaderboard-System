import { RefreshCw } from "lucide-react";

interface GameTextAreaProps {
  gameText: string;
  userInput: string;
  currentIndex: number;
  loadingText: boolean;
  renderText: () => JSX.Element[];
  isGameActive: boolean; // Add this new prop
}

export const GameTextArea: React.FC<GameTextAreaProps> = ({
  gameText,
  userInput,
  currentIndex,
  loadingText,
  renderText,
  isGameActive, // Destructure the new prop
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {isGameActive ? "Keep typing..." : "Type the following text to begin:"}
      </h2>
      {loadingText && (
        <div className="flex items-center gap-2 text-indigo-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading new content...</span>
        </div>
      )}
    </div>
    <div
      className={`bg-gray-50 p-6 rounded-lg border-2 ${
        isGameActive ? "border-blue-300" : "border-gray-200"
      } min-h-32 leading-relaxed font-mono transition-colors`}
      aria-label="Text to type"
    >
      {renderText()}
      {!isGameActive && userInput.length === 0 && (
        <div className="text-gray-400 italic">
          Just start typing to begin the challenge...
        </div>
      )}
    </div>
  </div>
);
