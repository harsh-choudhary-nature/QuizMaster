import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 22; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "The International Cricket Council (ICC) has announced the ICC Men's Player for February 2025. Who is he?",
    options: ["Rohit Sharma", "Hardik Pandya", "KL Rahul", "Shubman Gill"],
    correctOption: 3,
    description:
      "Shubman Gill was named the ICC Men's Player of the Month for February 2025 for his outstanding performance in international cricket.",
  },
  {
    question: "When is World Sparrow Day celebrated every year?",
    options: ["20 March", "21 March", "22 March", "19 March"],
    correctOption: 0,
    description:
      "World Sparrow Day is celebrated every year on 20 March to raise awareness about the house sparrow and other common birds in urban environments.",
  },
  {
    question:
      "Who became the first woman and first African to be elected president of the IOC?",
    options: [
      "Christy Coventry",
      "Michael Martin",
      "Jotham Napat",
      "None of the above",
    ],
    correctOption: 0,
    description:
      "Kirsty Coventry became the first woman and first African to be elected president of the International Olympic Committee (IOC). She was elected on March 20, 2025.",
  },
  {
    question:
      "Which initiative based on the Uttar Pradesh model has been launched by the Delhi Police to improve the safety of women in the national capital?",
    options: [
      "Etiquette squads",
      "Security Squad",
      "Nari Shakti Units",
      "Mahila Rakshak Dal",
    ],
    correctOption: 0,
    description:
      "Taking inspiration from the Yogi Adityanath-led Uttar Pradesh model, Delhi Police is set to launch 'Shishtachar' squads, also known as 'anti-eve teasing' squads, to improve women's safety in the national capital.",
  },
  {
    question:
      "Which state of India has imposed a fee of Rs 50 per person on tourists visiting the state/UT from March 2025?",
    options: ["Assam", "Sikkim", "Jammu & Kashmir", "Ladakh"],
    correctOption: 1,
    description:
      "Sikkim has imposed a fee of Rs 50 per tourist visiting the state, starting from March 2025, under the Sikkim Registration of Tourist Trade Rules, 2025.",
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
