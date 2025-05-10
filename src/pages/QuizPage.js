import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 26; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Who has been appointed as the new Finance Secretary, replacing Tuhin Kanta Pandey?",
    options: ["Rajiv Mehrishi", "Rajiv Kumar", "Shaktikanta Das", "Ajay Seth"],
    correctOption: 3,
    description:
      "Ajay Seth has been appointed as the new Finance Secretary, succeeding Tuhin Kanta Pandey in 2025.",
  },
  {
    question:
      "What is the name of the first India-Africa maritime naval exercise to be held in April 2025?",
    options: ["Aikeyme", "Samudra Shakti", "La Peros", "Al-Mohad Al-Hindi"],
    correctOption: 0,
    description:
      "The first India-Africa maritime naval exercise, scheduled for April 2025, is named Aikeyme.",
  },
  {
    question:
      "Which medal did the Indian team win in the mixed quad category event at the ISTAF Sepak Takraw World Cup 2025?",
    options: ["Gold Medal", "silver medal", "bronze medal", "None of these"],
    correctOption: 2,
    description:
      "India secured the bronze medal in the mixed quad category at the ISTAF Sepak Takraw World Cup 2025.",
  },
  {
    question:
      "World Theatre Day (WTD) was initiated in 1961 by which international institution?",
    options: [
      "International Monetary Fund and World Bank",
      "European Union",
      "Shanghai Cooperation Organization",
      "International Theatre Institute",
    ],
    correctOption: 3,
    description:
      "World Theatre Day was initiated in 1961 by the International Theatre Institute to promote theatre across the world.",
  },
  {
    question:
      "The Department of Posts released a commemorative postage stamp on the occasion of the ________ birth anniversary of the eminent saint, Mata Karma.",
    options: ["1009th", "1029th", "1019th", "1059th"],
    correctOption: 0,
    description:
      "The Department of Posts released a commemorative postage stamp on the occasion of the 1009th birth anniversary of Mata Karma.",
  },
];

const QuizPage = () => {
  const [started, setStarted] = useState(false);
  const [userProgress, setUserProgress] = useState([]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (parseInt(savedVersion) === QUIZ_VERSION && savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      // Either no version or outdated version — reset
      initializeProgress();
      localStorage.setItem(VERSION_KEY, QUIZ_VERSION.toString());
    }
  }, []);

  // Save progress on change
  useEffect(() => {
    if (userProgress.length === defaultQuestions.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userProgress));

      // Compute score
      const correctCount = userProgress.reduce((acc, curr, idx) => {
        return curr.submitted &&
          curr.selectedOption === defaultQuestions[idx].correctOption
          ? acc + 1
          : acc;
      }, 0);
      setScore(correctCount);
      if (correctCount === defaultQuestions.length) {
        setShowSuccess(true);

        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    }
  }, [userProgress]);

  const initializeProgress = () => {
    const initial = defaultQuestions.map(() => ({
      selectedOption: null,
      submitted: false,
    }));
    setUserProgress(initial);
    setScore(0);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  };

  const handleAnswer = (index, selectedOption) => {
    const updated = [...userProgress];
    updated[index].selectedOption = selectedOption;
    setUserProgress(updated);
  };

  const handleSubmit = (index) => {
    const updated = [...userProgress];
    updated[index].submitted = true;
    setUserProgress(updated);
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    initializeProgress();
  };

  return !started ? (
    <header className={styles.header}>
      <h1 className={styles.title}>Welcome to QuizMaster</h1>
      <p className={styles.questionCardDescription}>
        Test your knowledge with our quick and fun quizzes!
      </p>
      <button className={styles.startBtn} onClick={() => setStarted(true)}>
        Start Quiz
      </button>
    </header>
  ) : (
    <div className={styles.quizContainer}>
      {showSuccess && (
        <>
          {/* Success Message */}
          <div
            style={{
              position: "fixed",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#4BB543",
              color: "white",
              padding: "20px 40px",
              borderRadius: "15px",
              fontSize: "1.4rem",
              fontWeight: "bold",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              zIndex: 10001,
              textAlign: "center",
              animation: "fadeInOut 3s ease",
            }}
          >
            🎉 Perfect Score! Well Done! 🎉
          </div>

          {/* Animated Ribbons */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`${styles.ribbon} ${styles[`ribbon-${i}`]}`}
            />
          ))}
        </>
      )}

      <div
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#fff",
        }}
      >
        🧠 Current Affairs
      </div>

      {defaultQuestions.map((q, idx) => (
        <Question
          key={idx}
          question={q.question}
          options={q.options}
          correctOption={q.correctOption}
          description={q.description}
          selectedOption={userProgress[idx]?.selectedOption}
          submitted={userProgress[idx]?.submitted}
          onSelectOption={(opt) => handleAnswer(idx, opt)}
          onSubmit={() => handleSubmit(idx)}
        />
      ))}

      <div
        style={{ fontSize: "1.2rem", marginBottom: "20px", fontWeight: "bold" }}
      >
        Total Correct:{" "}
        <span translate="no">
          {score} / {defaultQuestions.length}
        </span>
      </div>

      <button className={styles.startBtn} onClick={handleReset}>
        Reset Quiz
      </button>
    </div>
  );
};

export default QuizPage;
