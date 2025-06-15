import React from "react";

interface TextDisplayProps {
  gameText: string;
  userInput: string;
  currentIndex: number;
  loadingText: boolean;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  gameText,
  userInput,
  currentIndex,
  loadingText,
}) => {
  const renderText = () => {
    return gameText.split("").map((char, index) => {
      let className = "text-2xl ";

      if (index < userInput.length) {
        className +=
          userInput[index] === char
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800";
      } else if (index === currentIndex) {
        className += "bg-blue-300 text-blue-800 animate-pulse";
      } else {
        className += "text-gray-600";
      }

      if (char === " ") {
        return (
          <span key={index} className={className} aria-label="space">
            {" "}
          </span>
        );
      } else if (char === "\n") {
        return <br key={index} />;
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="mb-4">
      {loadingText ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap font-mono">{renderText()}</div>
      )}
    </div>
  );
};
