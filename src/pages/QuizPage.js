import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 25; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: "Where was the Kabaddi World Cup 2025 held?",
    options: ["Iran", "England", "India", "South Korea"],
    correctOption: 1,
    description:
      "The 2025 Kabaddi World Cup is the second edition of the Kabaddi World Cup held under the authority of World Kabaddi. It was hosted in the West Midlands, England, during 17–23 March 2025.",
  },
  {
    question:
      "Which country has announced its decision to join the New Development Bank in March 2025?",
    options: ["India", "Indonesia", "Brazil", "Russia"],
    correctOption: 1,
    description:
      "In March 2025, Indonesia announced its decision to join the New Development Bank, aiming to strengthen multilateral economic cooperation.",
  },
  {
    question: "Project 1135.6 class second warship (frigate) ___",
    options: ["Tavasya", "Triput", "Betwa", "Beas"],
    correctOption: 0,
    description:
      "The second frigate of the Project 1135.6 class, a Talwar-class warship, is named Tavasya.",
  },
  {
    question:
      "Which state government has announced a scheme to conduct a caste-based census in the next financial year?",
    options: ["Uttar Pradesh", "Madhya Pradesh", "Bihar", "Jharkhand"],
    correctOption: 3,
    description:
      "The Jharkhand state government announced plans to conduct a caste-based census in the next financial year, following the footsteps of Bihar.",
  },
  {
    question:
      "Kerala becomes the first Indian state to set up Senior Citizens Commission. What is the purpose of the Commission?",
    options: [
      "The scheme provides social security to workers in the unorganized sector, including senior citizens.",
      "The scheme honours eminent institutions engaged in the service of senior citizens and elderly persons.",
      "The objective of the scheme is to provide protection to senior citizens with monthly income of more than Rs. 15,000 and suffering from age-related disability/infirmity.",
      "To ensure rehabilitation, protection and empowerment of senior citizens.",
    ],
    correctOption: 3,
    description:
      "Kerala set up India’s first Senior Citizens Commission with the aim to ensure rehabilitation, protection, and empowerment of senior citizens.",
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
