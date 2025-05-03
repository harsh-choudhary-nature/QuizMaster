import React, { useState, useEffect } from "react";
import styles from "../styles/Hangman.module.css";

const HangmanGame = () => {
  const hardcodedWord = "PYRAMID"; // Can be changed to a dynamic word daily if needed.
  const wordHint =
    "Ancient structures with a square base and triangular sides — often associated with Egypt";
  const storageKey = `HANGMAN WORD`;

  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [gameStatus, setGameStatus] = useState(null);

  const [isHintRevealed, setIsHintRevealed] = useState(false);

  // Check if the word in localStorage matches the hardcoded word
  useEffect(() => {
    const storedGameState = localStorage.getItem(storageKey);
    // If no saved state or a version mismatch (i.e., hardcoded word changes)
    if (!storedGameState) {
      setWord(hardcodedWord);
      setMaskedWord("_".repeat(hardcodedWord.length));
      setGuesses([]);
      setIncorrectGuesses([]);
      setAttemptsLeft(6);
      setGameStatus(null);
    } else {
      // Parse the saved game state and load it
      const savedState = JSON.parse(storedGameState);
      if (savedState.word !== hardcodedWord) {
        setWord(hardcodedWord);
        setMaskedWord("_".repeat(hardcodedWord.length));
        setGuesses([]);
        setIncorrectGuesses([]);
        setAttemptsLeft(6);
        setGameStatus(null);
      } else {
        setWord(savedState.word);
        setMaskedWord(savedState.maskedWord);
        setGuesses(savedState.guesses);
        setIncorrectGuesses(savedState.incorrectGuesses);
        setAttemptsLeft(savedState.attemptsLeft);
        setGameStatus(savedState.gameStatus);
      }
    }
  }, [hardcodedWord, storageKey]);

  // Save the game state to localStorage whenever it changes
  useEffect(() => {
    if (word && maskedWord !== "" && word !== "") {
      const gameState = {
        word,
        maskedWord,
        guesses,
        incorrectGuesses,
        attemptsLeft,
        gameStatus,
      };
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [
    word,
    maskedWord,
    guesses,
    incorrectGuesses,
    attemptsLeft,
    gameStatus,
    storageKey,
  ]);

  useEffect(() => {
    if (!maskedWord || !word) return;
    if (maskedWord === word) {
      setGameStatus("won");
    }
    if (attemptsLeft <= 0) {
      setGameStatus("lost");
    }
  }, [maskedWord, attemptsLeft, word]);

  const handleGuess = (letter) => {
    if (guesses.includes(letter) || gameStatus) return;

    setGuesses([...guesses, letter]);

    if (word.includes(letter)) {
      let newMaskedWord = maskedWord.split("");
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          newMaskedWord[i] = letter;
        }
      }
      setMaskedWord(newMaskedWord.join(""));
    } else {
      setIncorrectGuesses([...incorrectGuesses, letter]);
      setAttemptsLeft(attemptsLeft - 1);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(storageKey);
    setMaskedWord("_".repeat(word.length));
    setGuesses([]);
    setIncorrectGuesses([]);
    setAttemptsLeft(6);
    setGameStatus(null);
  };

  const isLetterCorrect = (letter) => {
    return word.includes(letter);
  };

  const toggleHint = () => {
    setIsHintRevealed(!isHintRevealed);
  };

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameTitle}>Hangman</h2>
      <div className={styles.gameBoard}>
        <div className={styles.wordDisplay}>
          {maskedWord.split("").map((letter, index) => (
            <span key={index} className={styles.letter}>
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
            className={`${
              !isHintRevealed ? styles.hintButton : styles.hintButtonClicked
            }`}
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
      {/* Falling Ribbons Animation when the game is won */}
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
