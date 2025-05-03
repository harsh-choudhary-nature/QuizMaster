import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 19; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "In which two places were the Khelo India Winter Games 2025 held?",
    options: [
      "Ladakh and Uttarakhand",
      "Ladakh and Jammu & Kashmir",
      "Himachal Pradesh & Sikkim",
      "Arunachal Pradesh & Assam",
    ],
    correctOption: 1,
    description:
      "The Khelo India Winter Games 2025 were held in Ladakh and Jammu & Kashmir, promoting winter sports in India's northernmost regions.",
  },
  {
    question:
      "Who won the 15th Hockey India Senior Women's National Championship 2025 and where was it held?",
    options: [
      "Hockey Haryana, Haryana",
      "Hockey Mizoram, Odisha",
      "Hockey Bengal, Madhya Pradesh",
      "Hockey Jharkhand, Haryana",
    ],
    correctOption: 3,
    description:
      "Hockey Jharkhand won the 15th Hockey India Senior Women's National Championship 2025, which was held in Haryana.",
  },
  {
    question:
      "How many properties were added to India's tentative list by UNESCO's World Heritage Centre in March 2025?",
    options: ["five", "six", "seven", "eight"],
    correctOption: 1,
    description:
      "Six sites, including Mudumal Megalithic Menhirs in Telangana and palace-fortresses of the Bundelas in Madhya Pradesh and Uttar Pradesh, have been added to India's tentative list by the UNESCO's World Heritage Centre.",
  },
  {
    question:
      "Where was the first temple of Chhatrapati Shivaji Maharaj inaugurated on the occasion of his birth anniversary?",
    options: ["Maharashtra", "Madhya Pradesh", "Tamil Nadu", "Telangana"],
    correctOption: 0,
    description:
      "The inauguration took place in Bhiwandi, Thane, on the occasion of Shivaji Maharaj's birth anniversary. The temple stands as a symbol of his heroism, valour, and enduring legacy, offering a sacred place for devotees to honour his contributions to India's history.",
  },
  {
    question:
      "Which film won the Best Film Award at the Asian Film Awards 2025?",
    options: [
      "'Techie Cometh'",
      "Santosh",
      "Black Dog",
      "All We Imagine as Light",
    ],
    correctOption: 3,
    description:
      "'All We Imagine as Light' won the Best Film Award at the Asian Film Awards 2025, receiving widespread critical acclaim.",
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
