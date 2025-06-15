import { useEffect } from "react";

interface KeyboardShortcutsProps {
  isGameActive: boolean;
  gameCompleted: boolean;
  userInputLength: number;
  showScores: boolean;
  showSettings: boolean;
  showKeyboardHelp: boolean;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  handleNewText: () => void;
  handleViewScores: () => void;
  setShowSettings: (show: boolean) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  setShowScores: (show: boolean) => void;
  setShowKeyboardHelp: (show: boolean) => void;
}

export const useKeyboardShortcuts = ({
  isGameActive,
  gameCompleted,
  userInputLength,
  showScores,
  showSettings,
  showKeyboardHelp,
  startGame,
  pauseGame,
  resetGame,
  handleNewText,
  handleViewScores,
  setShowSettings,
  inputRef,
  setShowScores,
  setShowKeyboardHelp,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTypingInTextarea =
        document.activeElement === inputRef.current &&
        !gameCompleted &&
        (isGameActive || userInputLength === 0);

      // Global shortcuts
      if (e.key === "F1") {
        e.preventDefault();
        setShowKeyboardHelp((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (isGameActive) pauseGame();
        else if (showScores) setShowScores(false);
        else if (showSettings) setShowSettings(false);
        else if (showKeyboardHelp) setShowKeyboardHelp(false);
        return;
      }

      if (isTypingInTextarea) return;

      // Game control shortcuts
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        if (gameCompleted) resetGame();
        else if (!isGameActive) startGame();
        return;
      }

      if (e.key === " " && e.ctrlKey) {
        e.preventDefault();
        if (isGameActive) pauseGame();
        else if (!gameCompleted) startGame();
        return;
      }

      if (e.key === "r" && e.ctrlKey) {
        e.preventDefault();
        resetGame();
        return;
      }

      if (e.key === "n" && e.ctrlKey) {
        e.preventDefault();
        if (!isGameActive) handleNewText();
        return;
      }

      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        handleViewScores();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setShowSettings((prev) => !prev);
        return;
      }

      if (e.key === "r" && e.shiftKey) {
        e.preventDefault();
        resetGame();
        return;
      }

      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isGameActive,
    gameCompleted,
    userInputLength,
    showScores,
    showSettings,
    showKeyboardHelp,
    startGame,
    pauseGame,
    resetGame,
    handleNewText,
    handleViewScores,
    setShowSettings,
    inputRef,
    setShowScores,
    setShowKeyboardHelp,
  ]);
};
