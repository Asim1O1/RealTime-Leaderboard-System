import { useEffect, useRef, useState } from "react";

import { useScoreStore } from "../stores/score.store";

import { Link } from "react-router-dom";
import { GameHeader } from "../components/typing-game/GameHeader";
import { KeyboardHelp } from "../components/typing-game/KeyboardHelp";
import { ResultsModal } from "../components/typing-game/ResultsModal";
import { ScoresModal } from "../components/typing-game/ScoresModal";
import { SettingsPanel } from "../components/typing-game/SettingsPanel";
import { StatsPanel } from "../components/typing-game/StatsPanel";
import { TextDisplay } from "../components/typing-game/TextDisplay";
import { TextMetadata } from "../components/typing-game/TextModal";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useTextFetcher } from "../hooks/useTextFetcher";
import { useTypingGame } from "../hooks/useTypingGame";
import { useAuthStore } from "../stores/auth.store";

const TypingGamePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { scores, loading, error, submitScore, getMyScores } = useScoreStore();

  const [settings, setSettings] = useState({
    textLength: "short",
    category: "motivational",
    gameTime: 30,
  });

  const [showScores, setShowScores] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { loadingText, textMetadata, fetchNewText } = useTextFetcher();

  const {
    gameText,
    userInput,
    currentIndex,
    isGameActive,
    timeLeft,
    wpm,
    accuracy,
    gameCompleted,
    startGame,
    pauseGame,
    resetGame,
    handleInputChange,
    setGameText,
  } = useTypingGame("", settings.gameTime);

  useEffect(() => {
    const fetchInitialText = async () => {
      const newText = await fetchNewText(settings.category);
      setGameText(newText);
    };
    fetchInitialText();
  }, []);

  const handleNewTextWrapper = async () => {
    if (!isGameActive) {
      const newText = await fetchNewText(settings.category);
      setGameText(newText);
      resetGame();
    }
  };

  const handleViewScores = async () => {
    setShowScores(true);
    try {
      await getMyScores();
    } catch (err) {
      console.error("Failed to fetch scores:", err);
    }
  };

  useKeyboardShortcuts({
    isGameActive,
    gameCompleted,
    userInputLength: userInput.length,
    showScores,
    showSettings,
    showKeyboardHelp,
    startGame,
    pauseGame,
    resetGame,
    handleNewText: handleNewTextWrapper,
    handleViewScores,
    setShowSettings,
    inputRef,
    setShowKeyboardHelp,
  });

  const handleSaveScore = async () => {
    try {
      await submitScore({ score: wpm, accuracy: accuracy });
      setScoreSaved(true);
    } catch (err) {
      console.error("Failed to save score:", err);
    }
  };

  const handleSettingsChange = (key: string, value: string) => {
    if (key !== "category") return;
    setSettings((prev) => ({ ...prev, category: value }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercentage = Math.round(
    (userInput.length / gameText.length) * 100
  );

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In to Play</h2>
        <p className="mb-6">
          You need to be logged in to access the typing game.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: "var(--background)",
        color: "var(--text)",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {showSettings && (
          <SettingsPanel
            settings={settings}
            handleSettingsChange={handleSettingsChange}
          />
        )}

        <StatsPanel
          timeLeft={timeLeft}
          wpm={wpm}
          accuracy={accuracy}
          progressPercentage={progressPercentage}
          formatTime={formatTime}
        />

        <div
          className="rounded-xl shadow-lg p-8 mb-6"
          style={{
            background: "var(--card-background)",
            border: "1px solid var(--border)",
          }}
        >
          {textMetadata.author && (
            <TextMetadata
              author={textMetadata.author}
              category={textMetadata.category}
            />
          )}

          <TextDisplay
            gameText={gameText}
            userInput={userInput}
            currentIndex={currentIndex}
            loadingText={loadingText}
          />

          {completionMessage && (
            <div
              className="mb-4 p-4 rounded-lg text-center animate-pulse"
              style={{
                background: "var(--success-bg)",
                color: "var(--success-text)",
                border: "1px solid var(--success-border)",
              }}
            >
              {completionMessage}
            </div>
          )}

          <textarea
            id="typing-input"
            ref={inputRef}
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-4 rounded-lg focus:outline-none font-mono text-lg resize-none"
            style={{
              background: "var(--input-background)",
              color: "var(--input-text)",
              border: "2px solid var(--input-border)",
            }}
            rows={6}
            placeholder="Start typing to begin the game..."
            disabled={gameCompleted}
            aria-disabled={gameCompleted}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <div className="mt-6">
            <GameHeader
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              loadingText={loadingText}
              isGameActive={isGameActive}
              gameCompleted={gameCompleted}
              handleNewText={handleNewTextWrapper}
              pauseGame={pauseGame}
              resetGame={resetGame}
              handleViewScores={handleViewScores}
            />
          </div>
        </div>

        {/* Modals */}
        {gameCompleted && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
              style={{
                background: "var(--modal-background)",
                color: "var(--modal-text)",
              }}
            >
              <ResultsModal
                wpm={wpm}
                accuracy={accuracy}
                userInputLength={userInput.length}
                error={error}
                scoreSaved={scoreSaved}
                loading={loading}
                resetGame={resetGame}
                handleNewText={handleNewTextWrapper}
                handleSaveScore={handleSaveScore}
              />
            </div>
          </div>
        )}

        {showScores && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
              style={{
                background: "var(--modal-background)",
                color: "var(--modal-text)",
              }}
            >
              <ScoresModal
                scores={scores}
                loading={loading}
                error={error}
                setShowScores={setShowScores}
              />
            </div>
          </div>
        )}

        {showKeyboardHelp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
              style={{
                background: "var(--modal-background)",
                color: "var(--modal-text)",
              }}
            >
              <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingGamePage;
