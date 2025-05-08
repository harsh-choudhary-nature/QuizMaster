import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 24; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Where is the headquarters of International Astronomical Union (IAU) located?",
    options: [
      "New York (USA)",
      "Paris, France",
      "Geneva, Switzerland",
      "Brussels, Belgium",
    ],
    correctOption: 1,
    description:
      "The headquarters of the International Astronomical Union (IAU) is located in Paris, France. It is a key organization promoting and safeguarding the science of astronomy through international cooperation.",
  },
  {
    question: "What is the theme of World Meteorological Day 2025?",
    options: [
      "Closing the Early Warning Gap Together",
      "Sustainability",
      "Measurements that support the global food system",
      "Metrology in the Digital Age",
    ],
    correctOption: 0,
    description:
      "Every 23 March, the World Meteorological Organization commemorates the coming into force of the Convention establishing the World Meteorological Organization on 23 March 1950. The theme for World Meteorological Day 2025 is “Closing the early warning gap together.”",
  },
  {
    question: "When is 'World TB Day' observed every year?",
    options: ["24 March", "23 March", "25 March", "26 March"],
    correctOption: 0,
    description:
      "World TB Day is observed on 24 March every year to raise public awareness about the devastating health, social, and economic consequences of tuberculosis.",
  },
  {
    question:
      "Who launched the Jal Shakti Abhiyan: Catch the Rain-2025 on World Water Day in Panchkula, Haryana?",
    options: [
      "Ministry of Agriculture and Farmers Welfare",
      "Ministry of Cooperatives",
      "Ministry of Jal Shakti",
      "Ministry of Rural Development",
    ],
    correctOption: 2,
    description:
      "The Ministry of Jal Shakti launched the Jal Shakti Abhiyan: Catch the Rain-2025 campaign on World Water Day in Panchkula, Haryana, to promote water conservation efforts across the country.",
  },
  {
    question:
      "Who won the women's title in the PSA Challenger Squash tournament in Chennai?",
    options: [
      "Anahat Singh",
      "Veer Chotarani",
      "Melville Sinnymanico",
      "None of these",
    ],
    correctOption: 0,
    description:
      "Anahat Singh won the women's title in the PSA Challenger Squash tournament held in Chennai, showcasing her rising talent in the sport.",
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
