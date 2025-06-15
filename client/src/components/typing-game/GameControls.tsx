import React from "react";

interface GameControlsProps {
  isGameActive: boolean;
  gameCompleted: boolean;
  loadingText: boolean;
  onNewText: () => void;
  onPause: () => void;
  onReset: () => void;
  onViewScores: () => void;
  setShowKeyboardHelp: (show: boolean) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isGameActive,
  gameCompleted,
  loadingText,
  onNewText,
  onPause,
  onReset,
  onViewScores,
  setShowKeyboardHelp,
}) => {
  return (
    <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
      <div>
        <span className="font-medium">Quick shortcuts:</span>
        <span className="ml-1">
          Enter (restart), Ctrl+R (reset), Ctrl+N (new text), Esc (pause)
        </span>
      </div>
      <button
        onClick={() => setShowKeyboardHelp(true)}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        All shortcuts (F1)
      </button>
    </div>
  );
};
