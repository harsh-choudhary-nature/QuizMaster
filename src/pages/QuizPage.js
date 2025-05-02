import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 18; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Who won the Open section title of the FIDE 2025 World Junior Chess Championship?",
    options: [
      "Divya Deshmukh",
      "Harika Dronavalli",
      "Abhijeet Gupta",
      "Pranav Venkatesh",
    ],
    correctOption: 3,
    description:
      "Pranav Venkatesh clinched the Open section title of the FIDE 2025 World Junior Chess Championship, showcasing his rising prowess in the global chess arena.",
  },
  {
    question: "When is Pi Day celebrated every year all over the world?",
    options: ["14 March", "15 March", "16 March", "17 March"],
    correctOption: 0,
    description:
      "Pi Day is celebrated every year on 14th March (3/14) to honor the mathematical constant π (pi), which is approximately equal to 3.14.",
  },
  {
    question:
      "Which of the following is the theme of World Consumer Rights Day 2025?",
    options: [
      "Sustainable lifestyle changes",
      "Sustainable lifestyle",
      "Better lifestyle changes",
      "Lifestyle changes",
    ],
    correctOption: 0,
    description:
      "The theme for World Consumer Rights Day 2025 is 'Sustainable lifestyle changes', emphasizing the need for responsible consumption and sustainable living practices.",
  },
  {
    question:
      "India celebrates National Vaccination Day on 16th March every year. It marks the launch of the Pulse Polio Immunization Programme in ____.",
    options: ["1992", "1993", "1994", "1995"],
    correctOption: 2,
    description:
      "National Vaccination Day is observed on 16th March in India to commemorate the launch of the Pulse Polio Immunization Programme in 1995.",
  },
  {
    question:
      "SpaceX and __________ launched a crewed mission to bring astronauts Sunita Williams and Butch Wilmore from the ISS.",
    options: ["ISRO", "JAXA", "NASA", "None of these"],
    correctOption: 3,
    description:
      "SpaceX and NASA launched a mission to bring back astronauts Sunita Williams and Butch Wilmore from the ISS. 'None of these' is the correct answer.",
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
