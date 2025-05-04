import React, { useState, useEffect } from "react";
import Question from "../components/Question";
import styles from "../styles/QuizPage.module.css";

const LOCAL_STORAGE_KEY = "quiz-progress";
const VERSION_KEY = "quiz-version";
const QUIZ_VERSION = 20; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question:
      "Chandrayaan-5 mission has been approved by the Government of India. Under which Indian astronauts will be landed on the moon by ______?",
    options: ["2035", "2029", "2070", "2040"],
    correctOption: 3,
    description:
      "The Indian government has approved the Chandrayaan-5 mission with the aim of landing Indian astronauts on the moon by 2040, marking a significant milestone in the nation's space exploration ambitions.",
  },
  {
    question:
      "Who launched a dedicated mobile application for the Prime Minister's Internship Scheme?",
    options: [
      "Narendra Modi",
      "Amit Shah",
      "Rajnath Singh",
      "Nirmala Sitharaman",
    ],
    correctOption: 3,
    description:
      "The Prime Minister's Internship Scheme (PMIS) took a significant leap forward with the launch of its dedicated mobile app by Union Finance Minister Smt. Nirmala Sitharaman on March 17, 2025.",
  },
  {
    question:
      "Who won the Best Player of the Year (Men) award for Hockey India's Balbir Singh Senior Award for the year 2024?",
    options: [
      "Harmanpreet Singh",
      "Savita Punia",
      "Ajit Pal Singh",
      "Amit Rohidas",
    ],
    correctOption: 0,
    description:
      "Harmanpreet Singh was awarded the Best Player of the Year (Men) under the Balbir Singh Senior Award by Hockey India in 2024 for his exceptional performance and leadership.",
  },
  {
    question:
      "Where was the Atal Bihari Vajpayee Institute of Public Service and Innovation jointly inaugurated by Prime Minister Narendra Modi and Prime Minister of Mauritius Navinchandra Ramgoolam, on 12th March?",
    options: [
      "Reduit, Mauritius",
      "New Delhi, India",
      "Port Louis, Mauritius",
      "Gujarat, India",
    ],
    correctOption: 0,
    description:
      "The Atal Bihari Vajpayee Institute of Public Service and Innovation was inaugurated in Reduit, Mauritius, as a symbol of Indo-Mauritian cooperation in governance and innovation.",
  },
  {
    question:
      "The Central Government has imposed a ban on the Awami Action Committee and Jammu and Kashmir Ittihad-ul-Muslimeen for how many years?",
    options: ["two years", "three years", "four years", "five years"],
    correctOption: 3,
    description:
      "The Government of India has banned the Awami Action Committee and Jammu and Kashmir Ittihad-ul-Muslimeen for five years due to their alleged involvement in activities prejudicial to the sovereignty and integrity of India.",
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
