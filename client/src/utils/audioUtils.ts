/**
 * Audio utility functions for the typing game
 */

// Extend the Window interface for legacy browser support
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const playSuccessSound = () => {
  // Try to play audio file first
  const tryAudioFile = () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 0.5;
    return audio.play().catch(() => {
      // Fallback to Web Audio API if file fails
      return playWebAudioSuccess();
    });
  };

  // Web Audio API fallback
  const playWebAudioSuccess = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Pleasant success chord progression
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(
        659.25,
        audioContext.currentTime + 0.1
      ); // E5
      oscillator.frequency.setValueAtTime(
        783.99,
        audioContext.currentTime + 0.2
      ); // G5

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      return Promise.resolve();
    } catch (error) {
      console.log("Audio not supported:", error);
      return Promise.reject(error);
    }
  };

  // Try audio file first, fallback to Web Audio API
  return tryAudioFile().catch(() => {
    console.log("Using Web Audio API fallback");
  });
};

export const playErrorSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Error sound - lower frequency, shorter duration
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.type = "sawtooth";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log("Audio not supported:", error);
  }
};

export const playTypingSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Subtle typing click sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.05,
      audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.05
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (error) {
    console.log("Audio not supported:", error);
  }
};

export const playStartSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start game sound - ascending tone
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    oscillator.frequency.linearRampToValueAtTime(
      660,
      audioContext.currentTime + 0.2
    ); // E5

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log("Audio not supported:", error);
  }
};
