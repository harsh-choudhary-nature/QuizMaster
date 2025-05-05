import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 21; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Amit Shah inaugurated the Lachit Borphukan Police Academy in Dergaon, ________?",
    options: ["Uttarakhand", "Sikkim", "Arunachal Pradesh", "Assam"],
    correctOption: 3,
    description:
      "Union Home Minister Amit Shah inaugurated the Lachit Borphukan Police Academy in Dergaon, Assam, emphasizing the state's importance in the internal security framework.",
  },
  {
    question:
      "Which city will launch India's first PPP green waste processing plant?",
    options: ["Jaipur", "Kanpur", "Indore", "Raipur"],
    correctOption: 2,
    description:
      "Indore, known for its clean city initiatives, is set to launch India’s first Public-Private Partnership (PPP) based green waste processing plant, enhancing its sustainability efforts.",
  },
  {
    question:
      "Which edition of the bilateral naval exercise 'Varuna 2025' began on March 19?",
    options: ["26th", "29th", "23rd", "43rd"],
    correctOption: 2,
    description:
      "The bilateral naval exercise 'Varuna 2025', which began on March 19, is the 23rd edition of the exercise between the Indian and French Navies. It was held in the Arabian Sea.",
  },
  {
    question:
      "Rank the top 5 states with the highest number of households benefitted under 'PM Surya Ghar: Free Electricity Scheme'.",
    options: [
      "Gujarat>Maharashtra>Uttar Pradesh>Rajasthan>Kerala",
      "Maharashtra>Uttar Pradesh>Kerala>Rajasthan>Gujarat",
      "Uttar Pradesh>Kerala>Rajasthan>Gujarat>Maharashtra",
      "Gujarat>Maharashtra>Uttar Pradesh>Kerala>Rajasthan",
    ],
    correctOption: 3,
    description:
      "Gujarat leads the list of states with the highest number of households benefitted under the 'PM Surya Ghar: Free Electricity Scheme', followed by Maharashtra, Uttar Pradesh, Kerala and Rajasthan.",
  },
  {
    question: "Which team has won its second Women's Premier League title?",
    options: [
      "Delhi Capitals",
      "Mumbai Indians",
      "Chennai Super Kings",
      "Gujarat Giants",
    ],
    correctOption: 1,
    description:
      "Mumbai Indians clinched their second Women's Premier League (WPL) title, showcasing dominant performances throughout the season.",
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
