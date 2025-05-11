import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 27; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "More than 100 megaliths have been found by the Archaeological Survey of India (ASI) near the Malampuzha Dam in Palakkad in ________.",
    options: ["Karnataka", "Tamil Nadu", "Kerala", "Maharashtra"],
    correctOption: 2,
    description:
      "The ASI discovered more than 100 megaliths near the Malampuzha Dam in Palakkad, Kerala.",
  },
  {
    question:
      "Who has been appointed as a full-time member of NITI Aayog in March 2025?",
    options: [
      "Dr. Vijay Kumar Saraswat",
      "Pro. Ramesh Chand",
      "Dr. Vinod Paul",
      "Rajiv Gauba",
    ],
    correctOption: 3,
    description:
      "Former Cabinet Secretary Rajiv Gauba, a 1982-batch IAS officer from the Jharkhand cadre, has been appointed as a full-time member of NITI Aayog.",
  },
  {
    question:
      "Who has been appointed as a full-time member of the Economic Advisory Council to the Prime Minister (EAC-PM) by the government in March 2025?",
    options: [
      "Ajay Bhushan Pandey",
      "Rajiv Gauba",
      "Amitabh Kant",
      "Sanjay Kumar Mishra",
    ],
    correctOption: 3,
    description:
      "Sanjay Kumar Mishra has been appointed as a full-time member of the Economic Advisory Council to the Prime Minister in March 2025.",
  },
  {
    question:
      'A new book, "Leo: The Untold Story," on which cricket team has been released?',
    options: [
      "Chennai Super Kings (CSK)",
      "Royal Challengers Bangalore (RCB)",
      "Rajasthan Royals (RR)",
      "Punjab Kings (PBKS)",
    ],
    correctOption: 0,
    description:
      'The book "Leo: The Untold Story" has been released on the Chennai Super Kings (CSK) cricket team. It was authored by P.S. Raman, a noted lawyer and former vice-president of the Tamil Nadu Cricket Association.',
  },
  {
    question:
      "The book 'Ripples of Change' was published by the Department of Drinking Water and Sanitation (DDWS) in association with the _______.",
    options: ["UNICEF India", "World Bank", "UNESCO", "IMF"],
    correctOption: 0,
    description:
      "The book 'Ripples of Change' was published by the DDWS in association with UNICEF India.",
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
