import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Hangman.module.css";

const HangmanGame = () => {
  const storageKey = `HANGMAN_WORD`;
  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [gameStatus, setGameStatus] = useState(null);
  const [wordHint, setWordHint] = useState("Fetching hint...");
  const [isHintRevealed, setIsHintRevealed] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const storedGameState = localStorage.getItem(storageKey);

    const initializeGame = async () => {
      setLoading(true);

      if (storedGameState) {
        const saved = JSON.parse(storedGameState);
        if (saved.date === today) {
          setWord(saved.word);
          setMaskedWord(saved.maskedWord);
          setGuesses(saved.guesses);
          setIncorrectGuesses(saved.incorrectGuesses);
          setAttemptsLeft(saved.attemptsLeft);
          setGameStatus(saved.gameStatus);
          setWordHint(saved.hint || "No hint available");
          setLoading(false);
          return;
        }
      }
      try {
        const res = await fetch(
          "https://random-word-api.vercel.app/api?words=1"
        );
        const data = await res.json();
        const newWord = data[0].toUpperCase();

        let newHint = "No hint available";
        try {
          const hintRes = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`
          );
          const hintData = await hintRes.json();
          newHint =
            hintData[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
            "No hint available";
        } catch (err) {
          console.warn("Hint fetch failed:", err);
        }

        const initialState = {
          word: newWord,
          maskedWord: "_".repeat(newWord.length),
          guesses: [],
          incorrectGuesses: [],
          attemptsLeft: 6,
          gameStatus: null,
          date: today,
          hint: newHint,
        };

        localStorage.setItem(storageKey, JSON.stringify(initialState));

        setWord(newWord);
        setMaskedWord(initialState.maskedWord);
        setGuesses([]);
        setIncorrectGuesses([]);
        setAttemptsLeft(6);
        setGameStatus(null);
        setWordHint(newHint);
      } catch (error) {
        console.error("Error fetching word:", error);
      }

      setLoading(false);
    };

    initializeGame();
  }, [storageKey]);

  useEffect(() => {
    if (!maskedWord || !word) return;
    if (maskedWord === word) setGameStatus("won");
    if (attemptsLeft <= 0) setGameStatus("lost");
  }, [maskedWord, attemptsLeft, word]);

  useEffect(() => {
    if (!word) return;
    const today = new Date().toISOString().split("T")[0];

    const gameState = {
      word,
      maskedWord,
      guesses,
      incorrectGuesses,
      attemptsLeft,
      gameStatus,
      date: today,
      hint: wordHint,
    };
    localStorage.setItem(storageKey, JSON.stringify(gameState));
  }, [
    word,
    maskedWord,
    guesses,
    incorrectGuesses,
    attemptsLeft,
    gameStatus,
    wordHint,
    storageKey,
  ]);

  const handleGuess = useCallback(
    (letter) => {
      if (guesses.includes(letter) || gameStatus) return;
      setGuesses((prev) => [...prev, letter]);

      if (word.includes(letter)) {
        let newMasked = maskedWord.split("");
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) newMasked[i] = letter;
        }
        setMaskedWord(newMasked.join(""));
      } else {
        setIncorrectGuesses((prev) => [...prev, letter]);
        setAttemptsLeft((prev) => prev - 1);
      }
    },
    [guesses, gameStatus, word, maskedWord]
  );

  const handleReset = () => {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;

    const newState = {
      word: saved.word,
      maskedWord: "_".repeat(saved.word.length),
      guesses: [],
      incorrectGuesses: [],
      attemptsLeft: 6,
      gameStatus: null,
      date: saved.date,
      hint: saved.hint,
    };

    localStorage.setItem(storageKey, JSON.stringify(newState));

    setWord(saved.word);
    setMaskedWord(newState.maskedWord);
    setGuesses([]);
    setIncorrectGuesses([]);
    setAttemptsLeft(6);
    setGameStatus(null);
    setWordHint(saved.hint);
    setIsHintRevealed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && !guesses.includes(letter) && !gameStatus) {
        handleGuess(letter);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses, gameStatus, handleGuess]);

  const toggleHint = () => setIsHintRevealed(!isHintRevealed);

  const isLetterCorrect = (letter) => word.includes(letter);
  // Show spinner while loading
  if (loading) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameTitle}>Hangman</h2>
      <div className={styles.gameBoard}>
        <div className={styles.wordDisplay}>
          {maskedWord.split("").map((letter, i) => (
            <span key={i} className={styles.letter}>
              {letter}
            </span>
          ))}
        </div>
        <div className={styles.incorrectGuesses}>
          Incorrect Guesses: {incorrectGuesses.join(", ")}
        </div>
        <div className={styles.attempts}>Attempts Left: {attemptsLeft}</div>
        <div className={styles.alphabetGrid}>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className={`${styles.letterButton} ${
                gameStatus && guesses.includes(letter)
                  ? isLetterCorrect(letter)
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
              onClick={() => handleGuess(letter)}
              disabled={guesses.includes(letter) || gameStatus}
            >
              {letter}
            </button>
          ))}
        </div>
        {gameStatus && (
          <div className={styles.gameStatus}>
            {gameStatus === "won" ? "You Won!" : "You Lost!"}
          </div>
        )}
        <div className={styles.hintContainer}>
          <button
            onClick={toggleHint}
            className={
              !isHintRevealed ? styles.hintButton : styles.hintButtonClicked
            }
          >
            Hint
          </button>
          <div
            className={`${styles.hintText} ${
              isHintRevealed ? styles.showHint : ""
            }`}
          >
            {wordHint}
          </div>
        </div>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset Game
        </button>
      </div>
      {gameStatus === "won" && (
        <div className={styles.fallingRibbons}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`${styles.ribbon} ${styles[`ribbon-${i % 5}`]}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HangmanGame;
