import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 28; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Who became the first athlete to break the national powerlifting record at the Khelo India Para Games?",
    options: [
      "Jaspreet Kaur",
      "Kavipriya Raja",
      "Khushboo Gill",
      "Sonam Patil",
    ],
    correctOption: 0,
    description:
      "Jaspreet Kaur became the first athlete to break the national powerlifting record at the Khelo India Para Games.",
  },
  {
    question:
      "Netumbo Nandi-Ndatawa has been sworn in as the first woman President of which of the following country?",
    options: ["Zimbabwe", "Namibia", "Angola", "Botswana"],
    correctOption: 1,
    description:
      "Netumbo Nandi-Ndatawa has been sworn in as the first woman President of Namibia.",
  },
  {
    question:
      "Which of the following is the first vertical lift bridge in India?",
    options: [
      "Dibang River Bridge",
      "Dr. Bhupen Hazarika Setu",
      "Digha Sonepur Bridge",
      "Pamban Rail Bridge",
    ],
    correctOption: 3,
    description:
      "Pamban Rail Bridge is India's first vertical lift railway sea bridge, connecting Rameswaram to the mainland.",
  },
  {
    question:
      "The Employees' State Insurance (ESI) scheme has been implemented in how many districts of Uttar Pradesh?",
    options: ["74 districts", "70 Districts", "72 Districts", "71 districts"],
    correctOption: 0,
    description:
      "A total of 74 out of 75 districts in Uttar Pradesh are now fully covered under the ESI Scheme, benefiting 30.08 lakh Insured Persons (IPs) and 1.16 crore beneficiaries.",
  },
  {
    question:
      "On 26th March, which Union Minister announced that the government is planning to launch 'Sahakar' taxis on the lines of Uber and Ola?",
    options: ["Nitin Gadkari", "Narendra Modi", "Amit Shah", "Piyush Goyal"],
    correctOption: 2,
    description:
      "On 26th March, Union Home and Cooperation Minister Amit Shah announced the launch of 'Sahakar' taxis modeled after Uber and Ola services.",
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
