import {
  History,
  Pause,
  Play,
  RotateCcw,
  Save,
  Timer,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BookOpen, RefreshCw, Settings } from "lucide-react";
import { useScoreStore } from "../stores/score.store";

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

  const startGame = () => {
    setIsGameActive(true);
    setGameCompleted(false);
    setScoreSaved(false);
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

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Dynamic Typing Speed Test
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleNewText}
                disabled={isGameActive || loadingText}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loadingText ? "animate-spin" : ""}`}
                />
                New Text
              </button>
              {!isGameActive && !gameCompleted && (
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Start Game
                </button>
              )}
              {isGameActive && (
                <button
                  onClick={pauseGame}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={handleViewScores}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <History className="h-4 w-4" />
                Scores
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Game Settings
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Length
                </label>
                <select
                  value={settings.textLength}
                  onChange={(e) =>
                    handleSettingsChange("textLength", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="short">Short (50-100 chars)</option>
                  <option value="medium">Medium (100-200 chars)</option>
                  <option value="long">Long (200-400 chars)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Category
                </label>
                <select
                  value={settings.category}
                  onChange={(e) =>
                    handleSettingsChange("category", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="motivational">Motivational</option>
                  <option value="wisdom">Wisdom</option>
                  <option value="famous-quotes">Famous Quotes</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Duration
                </label>
                <select
                  value={settings.gameTime}
                  onChange={(e) =>
                    handleSettingsChange("gameTime", parseInt(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={120}>120 seconds</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Panel */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{timeLeft}s</div>
            <div className="text-gray-600">Time Left</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{wpm}</div>
            <div className="text-gray-600">WPM</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {accuracy}%
            </div>
            <div className="text-gray-600">Accuracy</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round((userInput.length / gameText.length) * 100)}%
            </div>
            <div className="text-gray-600">Progress</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Text Metadata */}
          {textMetadata.author && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-800">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">
                  {textMetadata.author} • {textMetadata.category}
                </span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Type the following text:
              </h2>
              {loadingText && (
                <div className="flex items-center gap-2 text-indigo-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading new content...</span>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 min-h-32 leading-relaxed font-mono">
              {renderText()}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Your Input:
            </h3>
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-lg resize-none"
              rows={6}
              placeholder="Start typing here..."
              disabled={!isGameActive && !gameCompleted}
            />
          </div>
        </div>

        {/* Results Modal */}
        {gameCompleted && (
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200 mb-6">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Game Complete!
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {wpm} WPM
                  </div>
                  <div className="text-gray-600">Words Per Minute</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {accuracy}%
                  </div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {userInput.length}
                  </div>
                  <div className="text-gray-600">Characters Typed</div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {scoreSaved && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-4">
                  Score saved successfully!
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={handleNewText}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Challenge
                </button>
                <button
                  onClick={handleSaveScore}
                  disabled={loading || scoreSaved}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : scoreSaved ? "Saved!" : "Save Score"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scores Modal */}
        {showScores && (
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Scores</h2>
              <button
                onClick={() => setShowScores(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading scores...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                {error || "Failed to fetch scores"}
              </div>
            ) : scores.length > 0 ? (
              <div className="space-y-3">
                {scores
                  .sort((a, b) => (b.value || b.score) - (a.value || a.score))
                  .map((score, index) => (
                    <div
                      key={score.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="font-semibold text-gray-800">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {score.value || score.score} WPM
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(score.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No scores yet. Complete a game to save your first score!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingGamePage;
