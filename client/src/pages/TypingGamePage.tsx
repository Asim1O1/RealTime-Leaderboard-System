import { useEffect, useRef, useState } from "react";

import { useScoreStore } from "../stores/score.store";

import { GameHeader } from "../components/typing-game/GameHeader";
import { GameTextArea } from "../components/typing-game/GameTextArea";
import { ResultsModal } from "../components/typing-game/ResultsModal";
import { ScoresModal } from "../components/typing-game/ScoresModal";
import { SettingsPanel } from "../components/typing-game/SettingsPanel";
import { StatsPanel } from "../components/typing-game/StatsPanel";
import { TextMetadata } from "../components/typing-game/TextModal";

const TypingGamePage = () => {
  const [gameText, setGameText] = useState(
    "Click 'New Text' to load fresh content for typing practice. You can choose from quotes, literature, or custom difficulty levels."
  );
  const [textMetadata, setTextMetadata] = useState({
    author: "",
    category: "default",
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
    textLength: "medium", // short, medium, long
    category: "motivational", // motivational, wisdom, famous-quotes
    gameTime: 60, // 30, 60, 120 seconds
  });

  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const { scores, loading, error, submitScore, getMyScores } = useScoreStore();

  // Function to fetch content from Quotable API
  const fetchNewText = async () => {
    setLoadingText(true);
    try {
      let minLength, maxLength;

      // Set length parameters based on difficulty
      switch (settings.textLength) {
        case "short":
          minLength = 50;
          maxLength = 100;
          break;
        case "medium":
          minLength = 100;
          maxLength = 200;
          break;
        case "long":
          minLength = 200;
          maxLength = 400;
          break;
        default:
          minLength = 100;
          maxLength = 200;
      }

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

  // Timer effect
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
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameActive, timeLeft]);

  // Calculate WPM and accuracy
  useEffect(() => {
    const wordsTyped = userInput.trim().split(" ").length;
    const timeElapsed = (settings.gameTime - timeLeft) / 60;
    const currentWpm =
      timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === gameText[i]) {
        correctChars++;
      }
    }
    const currentAccuracy =
      userInput.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 100;
    setAccuracy(currentAccuracy);
  }, [userInput, timeLeft, gameText, settings.gameTime]);

  // Check if typing is completed
  useEffect(() => {
    if (isGameActive && userInput.length === gameText.length) {
      // Check if the entire text is typed correctly
      let allCorrect = true;
      for (let i = 0; i < gameText.length; i++) {
        if (userInput[i] !== gameText[i]) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        // Stop the timer and complete the game
        setIsGameActive(false);
        setGameCompleted(true);
        setCompletionMessage("Perfect! You completed the text!");

        // Play a success sound
        const audio = new Audio("/success.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }
    }
  }, [userInput, gameText, isGameActive]);

  const startGame = () => {
    setIsGameActive(true);
    setGameCompleted(false);
    setScoreSaved(false);
    setCompletionMessage("");
    setTimeLeft(settings.gameTime);
    inputRef.current?.focus();
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
    if (!isGameActive && !gameCompleted) return;

    const value = e.target.value;
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
    setSettings((prev) => ({
      ...prev,
      [key]: value,
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
        <GameHeader
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          loadingText={loadingText}
          isGameActive={isGameActive}
          gameCompleted={gameCompleted}
          handleNewText={handleNewText}
          startGame={startGame}
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
            placeholder={
              isGameActive
                ? "Start typing here..."
                : "Click 'Start Game' to begin typing"
            }
            disabled={!isGameActive && !gameCompleted}
            aria-disabled={!isGameActive && !gameCompleted}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Keyboard shortcuts:</span> Press Tab +
            Enter to restart, Esc to pause
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
      </div>
    </div>
  );
};

export default TypingGamePage;
