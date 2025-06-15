import { useEffect, useRef, useState } from "react";

export const useTypingGame = (initialText: string, gameTime: number) => {
  const [gameText, setGameText] = useState(initialText);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameTime);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameCompleted, setGameCompleted] = useState(false);

  const intervalRef = useRef<number | null>(null);

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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameActive, timeLeft]);

  // Calculate WPM and accuracy
  useEffect(() => {
    const timeElapsed = (gameTime - timeLeft) / 60;
    if (timeElapsed <= 0) {
      setWpm(0);
      return;
    }

    let correctChars = 0;
    const compareLength = Math.min(userInput.length, gameText.length);

    for (let i = 0; i < compareLength; i++) {
      if (userInput[i] === gameText[i]) {
        correctChars++;
      }
    }

    const currentWpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;
    setWpm(Math.max(0, currentWpm));

    const currentAccuracy =
      compareLength > 0
        ? Math.round((correctChars / compareLength) * 100)
        : 100;
    setAccuracy(Math.max(0, currentAccuracy));
  }, [userInput, timeLeft, gameText, gameTime]);

  // Check if typing is completed
  useEffect(() => {
    if (!isGameActive) return;

    if (userInput.length >= gameText.length) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsGameActive(false);
      setGameCompleted(true);
    }
  }, [userInput, gameText, isGameActive]);

  const startGame = () => {
    setIsGameActive(true);
    setGameCompleted(false);
    setTimeLeft(gameTime);
  };

  const pauseGame = () => {
    setIsGameActive(false);
  };

  const resetGame = () => {
    setUserInput("");
    setCurrentIndex(0);
    setIsGameActive(false);
    setTimeLeft(gameTime);
    setWpm(0);
    setAccuracy(100);
    setGameCompleted(false);
  };

  const handleInputChange = (value: string) => {
    if (value.length > gameText.length) return;

    if (!isGameActive && !gameCompleted && value.length > 0) {
      startGame();
    }

    setUserInput(value);
    setCurrentIndex(value.length);
  };

  return {
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
  };
};
