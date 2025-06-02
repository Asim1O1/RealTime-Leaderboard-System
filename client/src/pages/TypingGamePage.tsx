import { Pause, Play, RotateCcw, Timer, Trophy } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const TypingGamePage: React.FC = () => {
  const [gameText] = useState("The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. It has been used for typing practice and font testing for decades. Many typists use this sentence to improve their speed and accuracy while ensuring they practice all letter combinations.");

  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameCompleted, setGameCompleted] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
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
    const wordsTyped = userInput.trim().split(' ').length;
    const timeElapsed = (60 - timeLeft) / 60;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === gameText[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    setAccuracy(currentAccuracy);
  }, [userInput, timeLeft, gameText]);

  const startGame = () => {
    setIsGameActive(true);
    setGameCompleted(false);
    inputRef.current?.focus();
  };

  const pauseGame = () => {
    setIsGameActive(false);
  };

  const resetGame = () => {
    setUserInput('');
    setCurrentIndex(0);
    setIsGameActive(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setGameCompleted(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isGameActive && !gameCompleted) return;

    const value = e.target.value;
    setUserInput(value);
    setCurrentIndex(value.length);
  };

  const renderText = () => {
    return gameText.split('').map((char, index) => {
      let className = 'text-2xl ';

      if (index < userInput.length) {
        className += userInput[index] === char ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
      } else if (index === currentIndex) {
        className += 'bg-blue-300 text-blue-800 animate-pulse';
      } else {
        className += 'text-gray-600';
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
            <h1 className="text-3xl font-bold text-gray-800">Typing Speed Test</h1>
            <div className="flex gap-4">
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
            </div>
          </div>
        </div>

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
            <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
            <div className="text-gray-600">Accuracy</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">{Math.round((userInput.length / gameText.length) * 100)}%</div>
            <div className="text-gray-600">Progress</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Type the following text:</h2>
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 min-h-32 leading-relaxed font-mono">
              {renderText()}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Input:</h3>
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
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Game Complete!</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{wpm} WPM</div>
                  <div className="text-gray-600">Words Per Minute</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userInput.length}</div>
                  <div className="text-gray-600">Characters Typed</div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Play Again
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Save Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingGamePage;
