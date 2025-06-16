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
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {isGameActive ? "Keep typing..." : "Type the following text to begin:"}
      </h2>
      {loadingText && (
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--accent)" }}
        >
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading new content...</span>
        </div>
      )}
    </div>
    <div
      className={`p-6 rounded-lg border-2 min-h-32 leading-relaxed font-mono transition-colors`}
      style={{
        background: "var(--text-display-bg)",
        borderColor: isGameActive
          ? "var(--active-border)"
          : "var(--inactive-border)",
      }}
      aria-label="Text to type"
    >
      {renderText()}
      {!isGameActive && userInput.length === 0 && (
        <div className="italic" style={{ color: "var(--text-placeholder)" }}>
          Just start typing to begin the challenge...
        </div>
      )}
    </div>
  </div>
);
