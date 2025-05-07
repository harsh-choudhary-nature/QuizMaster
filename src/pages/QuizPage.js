import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 23; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Who has instituted the Ramnath Goenka Award for Excellence in Journalism?",
    options: [
      "Indian Express Group",
      "The Hindu Group",
      "Aaj Tak Group",
      "G Group",
    ],
    correctOption: 0,
    description:
      "The Ramnath Goenka Award for Excellence in Journalism has been instituted by the Indian Express Group to honor journalists for their courage and commitment to responsible journalism.",
  },
  {
    question:
      "India has secured ______ rank among 33 countries in the Free Speech Index.",
    options: ["22nd", "23rd", "24th", "25th"],
    correctOption: 2,
    description:
      "India ranked 24th out of 33 countries in the Free Speech Index, reflecting ongoing concerns about freedom of expression in the country.",
  },
  {
    question:
      "Famous Bollywood actor _______ was officially chosen as 'Fit India Icon'.",
    options: [
      "Ayushmann Khurrana",
      "Akshay Kumar",
      "Pankaj Tripathi",
      "None of these",
    ],
    correctOption: 0,
    description:
      "Bollywood actor Ayushmann Khurrana has been officially named the Fit India Icon by Union Sports Minister Mansukh Mandaviya at the Fit India Movement's inaugural ceremony in the national capital.",
  },
  {
    question:
      "In which year did the United Nations General Assembly declare 21st March as the International Day of Forests?",
    options: ["2010", "2012", "2015", "1009"],
    correctOption: 1,
    description:
      "The United Nations General Assembly declared 21st March as the International Day of Forests in 2012 to raise awareness about the importance of forests.",
  },
  {
    question: "What is the theme of World Water Day 2025?",
    options: [
      "Glacier conservation",
      "Leveraging Water for Peace",
      "Accelerating change to solve the water and sanitation crisis",
      "Groundwater: Making the Invisible Visible",
    ],
    correctOption: 0,
    description:
      'The theme of World Water Day 2025 is "Glacier Preservation". This theme highlights the critical role glaciers play in providing freshwater supplies and the urgent need to protect them from the impacts of climate change.',
  },
  {
    question:
      "The world's largest white hydrogen deposit has been discovered in ___________.",
    options: ["Italy", "Germany", "Georgia", "France"],
    correctOption: 3,
    description:
      "France has discovered the world's largest deposit of white hydrogen, a naturally occurring clean fuel with significant potential for the energy transition.",
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
