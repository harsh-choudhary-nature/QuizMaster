import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/PianoPlayer.module.css";

const notes = [
  { note: "A3", freq: 220.0, key: "a" },
  { note: "A♯3", freq: 233.08, key: "s" },
  { note: "B3", freq: 246.94, key: "z" },
  { note: "C", freq: 261.63, key: "x" },
  { note: "D", freq: 293.66, key: "c" },
  { note: "E", freq: 329.63, key: "v" },
  { note: "F", freq: 349.23, key: "b" },
  { note: "G", freq: 392.0, key: "n" },
  { note: "A", freq: 440.0, key: "m" },
  { note: "B", freq: 493.88, key: "," },
  { note: "C2", freq: 523.25, key: "." },
  { note: "D2", freq: 587.33, key: "q" },
  { note: "E2", freq: 659.26, key: "w" },
  { note: "F2", freq: 698.46, key: "e" },
  { note: "G2", freq: 783.99, key: "r" },
];

const PianoPlayer = () => {
  const audioCtxRef = useRef(null);
  const [started, setStarted] = useState(false);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const [pressedKey, setPressedKey] = useState(null);
  const timeoutRef = useRef(null);
  const activeOscillatorsRef = useRef({});
  const masterGainRef = useRef(null);
  const cleanupTimeoutsRef = useRef({});

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // Exited fullscreen (e.g., user pressed Esc)
        setStarted(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      const pressedKey = e.key.toLowerCase();
      const matchedNote = notes.find((n) => n.key === pressedKey);
      if (matchedNote) {
        playNote(matchedNote.key, matchedNote.freq);
        setPressedKey(pressedKey);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout to reset pressed key after 200ms
        timeoutRef.current = setTimeout(() => setPressedKey(null), 200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started]);

  const enterFullscreenAndLock = async () => {
    try {
      await document.documentElement.requestFullscreen();
      if (isMobile && window.screen.orientation?.lock) {
        await window.screen.orientation.lock("landscape");
      }
      setStarted(true);
    } catch (err) {
      console.warn("Fullscreen or orientation lock failed:", err);
      setStarted(true); // fallback
    }
  };

  const exitFullscreenAndReset = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Failed to exit fullscreen:", err);
    } finally {
      stopAllSounds();
      setStarted(false);
    }
  };

  const stopAllSounds = () => {
    Object.values(activeOscillatorsRef.current).forEach(
      ({ oscillator, gain }) => {
        try {
          oscillator.stop();
          gain.disconnect();
        } catch (_) {}
      }
    );
    activeOscillatorsRef.current = {};
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    Object.values(cleanupTimeoutsRef.current).forEach(clearTimeout);
    cleanupTimeoutsRef.current = {};

    setPressedKey(null);
  };

  const playNote = (key, frequency) => {
    const audioCtx =
      audioCtxRef.current ||
      new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    if (!masterGainRef.current) {
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime); // keep output safe
      masterGain.connect(audioCtx.destination);
      masterGainRef.current = masterGain;
    }

    // Stop existing oscillator for this key
    const existing = activeOscillatorsRef.current[key];
    if (existing) {
      try {
        existing.oscillator.stop();
      } catch (_) {}
      existing.gain.disconnect();
      delete activeOscillatorsRef.current[key];
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Apply smooth attack & release to prevent popping
    const now = audioCtx.currentTime;
    const attack = 0.02; // smooth start
    const release = 0.1; // smooth fade out
    const duration = 0.4;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.7, now + attack); // attack
    gainNode.gain.linearRampToValueAtTime(0, now + duration + release); // release

    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current);
    oscillator.start(now);
    oscillator.stop(now + duration + release + 0.05);

    activeOscillatorsRef.current[key] = { oscillator, gain: gainNode };

    if (cleanupTimeoutsRef.current[key]) {
      clearTimeout(cleanupTimeoutsRef.current[key]);
    }
    // Clean up
    cleanupTimeoutsRef.current[key] = setTimeout(() => {
      try {
        gainNode.disconnect();
      } catch (_) {}
      delete activeOscillatorsRef.current[key];
      delete cleanupTimeoutsRef.current[key];
    }, (duration + release + 0.1) * 1000);
  };

  return (
    <div className={styles.container}>
      {!started ? (
        <button className={styles.startButton} onClick={enterFullscreenAndLock}>
          Start Piano
        </button>
      ) : (
        <>
          <h2 className={styles.title}>Piano Player</h2>
          <div className={styles.piano}>
            {notes.map((n) => (
              <button
                key={n.note + n.key}
                className={`${styles.key} ${
                  pressedKey === n.key ? styles.pressed : ""
                }`} // Add class if key is pressed
                onClick={() => {
                  playNote(n.key, n.freq);
                  setPressedKey(n.key); // Set pressed key when button clicked
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  timeoutRef.current = setTimeout(
                    () => setPressedKey(null),
                    200
                  );
                }}
              >
                <div>{n.note}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  {n.key.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
          <button
            className={styles.exitButton}
            onClick={exitFullscreenAndReset}
          >
            Exit Piano
          </button>
        </>
      )}
    </div>
  );
};

export default PianoPlayer;
