import { useEffect, useRef, useState } from "react";

import { useScoreStore } from "../stores/score.store";

import { Link } from "react-router-dom";
import { GameHeader } from "../components/typing-game/GameHeader";
import { GameTextArea } from "../components/typing-game/GameTextArea";
import { ResultsModal } from "../components/typing-game/ResultsModal";
import { ScoresModal } from "../components/typing-game/ScoresModal";
import { SettingsPanel } from "../components/typing-game/SettingsPanel";
import { StatsPanel } from "../components/typing-game/StatsPanel";
import { TextMetadata } from "../components/typing-game/TextModal";
import { useAuthStore } from "../stores/auth.store";
import { playStartSound, playSuccessSound } from "../utils/audioUtils";
import { getDefaultText } from "../utils/typingContent";

const TypingGamePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [gameText, setGameText] = useState(getDefaultText().content);
  const [textMetadata, setTextMetadata] = useState({
    author: getDefaultText().author,
    category: getDefaultText().category,
  });

  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");

  // New settings for dynamic content
  const [settings, setSettings] = useState({
    textLength: "short", // fixed
    category: "motivational",
    gameTime: 30, // fixed
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Timer effect
  const intervalRef = useRef<number | null>(null);

  const { scores, loading, error, submitScore, getMyScores } = useScoreStore();

  // Function to fetch content from Quotable API
  const fetchNewText = async () => {
    setLoadingText(true);
    try {
      let minLength = 50;
      let maxLength = 100;

      // Build API URL with parameters
      const apiUrl = `http://api.quotable.io/quotes/random?minLength=${minLength}&maxLength=${maxLength}&tags=${settings.category}&limit=1`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const quote = data[0];
        setGameText(quote.content);
        setTextMetadata({
          author: quote.author,
          category: quote.tags.join(", "),
        });
      } else {
        // Fallback quotes if API fails
        const fallbackQuotes = [
          {
            content:
              "The only way to do great work is to love what you do. Stay hungry, stay foolish, and never give up on your dreams.",
            author: "Steve Jobs",
            tags: ["motivational"],
          },
          {
            content:
              "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward.",
            author: "Winston Churchill",
            tags: ["wisdom"],
          },
          {
            content:
              "Innovation distinguishes between a leader and a follower. Think different and make your mark on the world.",
            author: "Steve Jobs",
            tags: ["innovation"],
          },
        ];

        const randomQuote =
          fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setGameText(randomQuote.content);
        setTextMetadata({
          author: randomQuote.author,
          category: randomQuote.tags.join(", "),
        });
      }
    } catch (error) {
      console.error("Failed to fetch new text:", error);
      // Use fallback text
      setGameText(
        "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once."
      );
      setTextMetadata({ author: "Classic Pangram", category: "practice" });
    } finally {
      setLoadingText(false);
    }
  };

  // Load initial content
  useEffect(() => {
    fetchNewText();
  }, []);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            setGameCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // <-- Important to set to null after clearing
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // <-- Cleanup in effect teardown
      }
    };
  }, [isGameActive, timeLeft]);

  // Calculate WPM and accuracy using MonkeyType's standard method
  useEffect(() => {
    // Calculate time elapsed in minutes
    const timeElapsed = (settings.gameTime - timeLeft) / 60;

    if (timeElapsed <= 0) {
      setWpm(0);
      return;
    }

    // Count only correctly typed characters (MonkeyType method)
    let correctChars = 0;
    const compareLength = Math.min(userInput.length, gameText.length);

    for (let i = 0; i < compareLength; i++) {
      if (userInput[i] === gameText[i]) {
        correctChars++;
      }
    }

    // Standard WPM formula: (Correct Characters ÷ 5) ÷ Time in Minutes
    const currentWpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;
    setWpm(Math.max(0, currentWpm));

    // Calculate accuracy - percentage of correct characters out of what was typed
    const currentAccuracy =
      compareLength > 0
        ? Math.round((correctChars / compareLength) * 100)
        : 100;

    setAccuracy(Math.max(0, currentAccuracy));
  }, [userInput, timeLeft, gameText, settings.gameTime]);

  // Check if typing is completed
  useEffect(() => {
    if (!isGameActive) return;

    // Complete immediately when user has typed exactly the text length
    if (userInput.length >= gameText.length) {
      // Stop the timer immediately
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsGameActive(false);
      setGameCompleted(true);

      // Check accuracy for completion message
      let correctChars = 0;
      for (let i = 0; i < gameText.length; i++) {
        if (userInput[i] === gameText[i]) {
          correctChars++;
        }
      }

      const accuracyPercent = Math.round(
        (correctChars / gameText.length) * 100
      );

      if (accuracyPercent === 100) {
        setCompletionMessage("Perfect! You completed the text flawlessly!");
      } else if (accuracyPercent >= 95) {
        setCompletionMessage("Excellent! Nearly perfect completion!");
      } else {
        setCompletionMessage("Great job! You've finished the passage!");
      }

      playSuccessSound();
    }
  }, [userInput, gameText, isGameActive]);

  const startGame = () => {
    console.log("Starting game");
    setIsGameActive(true);
    setGameCompleted(false);
    setScoreSaved(false);
    setCompletionMessage("");
    setTimeLeft(settings.gameTime);
    inputRef.current?.focus();
    playStartSound(); // Play start sound when game begins
  };

  const pauseGame = () => {
    setIsGameActive(false);
  };

  const resetGame = () => {
    setUserInput("");
    setCurrentIndex(0);
    setIsGameActive(false);
    setTimeLeft(settings.gameTime);
    setWpm(0);
    setAccuracy(100);
    setGameCompleted(false);
    setScoreSaved(false);
    setCompletionMessage("");
    inputRef.current?.focus();
  };

  const handleSaveScore = async () => {
    try {
      await submitScore({ score: wpm, accuracy: accuracy });
      setScoreSaved(true);
    } catch (err) {
      console.error("Failed to save score:", err);
    }
  };

  const handleViewScores = async () => {
    setShowScores(true);
    try {
      const result = await getMyScores();
      console.log("Fetched scores:", result);
    } catch (err) {
      console.error("Failed to fetch scores:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Prevent typing beyond the text length (MonkeyType behavior)
    if (value.length > gameText.length) {
      return; // Don't allow typing beyond the text
    }

    // Start the game immediately when user types the first character
    if (!isGameActive && !gameCompleted && value.length > 0) {
      console.log("Auto-starting game on first keystroke");
      startGame();
    }

    setUserInput(value);
    setCurrentIndex(value.length);
  };

  const handleNewText = async () => {
    if (!isGameActive) {
      await fetchNewText();
      resetGame();
    }
  };

  const handleSettingsChange = (key, value) => {
    if (key !== "category") return; // only category is changeable
    setSettings((prev) => ({
      ...prev,
      category: value,
    }));
  };

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

      // Add special character rendering for spaces and newlines
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

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (userInput.length / gameText.length) * 100
  );

  // Time formatting
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {!isAuthenticated ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In to Play</h2>
            <p className="mb-6">
              You need to be logged in to access the typing game. Please sign in
              or create an account to continue.
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
        ) : (
          <>
            <GameHeader
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              loadingText={loadingText}
              isGameActive={isGameActive}
              gameCompleted={gameCompleted}
              handleNewText={handleNewText}
              pauseGame={pauseGame}
              resetGame={resetGame}
              handleViewScores={handleViewScores}
            />

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
              progressPercentage={Math.round(
                (userInput.length / gameText.length) * 100
              )}
              formatTime={formatTime}
            />

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              {textMetadata.author && (
                <TextMetadata
                  author={textMetadata.author}
                  category={textMetadata.category}
                />
              )}

              <GameTextArea
                gameText={gameText}
                userInput={userInput}
                currentIndex={currentIndex}
                loadingText={loadingText}
                renderText={renderText}
                isGameActive={isGameActive}
              />

              {completionMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium text-center animate-pulse">
                  {completionMessage}
                </div>
              )}

              <textarea
                id="typing-input"
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-lg resize-none"
                rows={6}
                placeholder="Start typing to begin the game..."
                disabled={gameCompleted}
                aria-disabled={gameCompleted}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Keyboard shortcuts:</span> Press
                Tab + Enter to restart, Esc to pause
              </div>
            </div>

            {gameCompleted && (
              <ResultsModal
                wpm={wpm}
                accuracy={accuracy}
                userInputLength={userInput.length}
                error={error}
                scoreSaved={scoreSaved}
                loading={loading}
                resetGame={resetGame}
                handleNewText={handleNewText}
                handleSaveScore={handleSaveScore}
              />
            )}

            {showScores && (
              <ScoresModal
                scores={scores}
                loading={loading}
                error={error}
                setShowScores={setShowScores}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TypingGamePage;
