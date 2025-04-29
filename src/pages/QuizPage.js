import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import styles from '../styles/QuizPage.module.css';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 15; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'The Uttar Pradesh government has launched the RISE app to make its vaccination programme more effective. RISE stands for-',
    options: [
      'Rapid Immunisation Skill Enhancement',
      'Reflect, inquire, suggest, and elevate',
      'Research Initiatives for Scientific Enrichment',
      'Immunization Research for Scientific Promotion'
    ],
    correctOption: 0,
    description: 'The RISE app launched by the Uttar Pradesh government stands for "Rapid Immunisation Skill Enhancement" to strengthen and streamline the state’s vaccination efforts.'
  },
  {
    question: 'Exercise Khanjar is a joint military exercise between which two countries?',
    options: [
      'India and Iran',
      'India & China',
      'India and Kyrgyzstan',
      'India & Nepal'
    ],
    correctOption: 2,
    description: 'Exercise Khanjar is a joint military exercise conducted between India and Kyrgyzstan to enhance interoperability and bilateral cooperation.'
  },
  {
    question: 'Who won the award for Best Performance (Male) in a Supporting Role at the International Indian Film Academy (IIFA) Awards 2025?',
    options: [
      'Kartik Aaryan',
      'Ravi Kishan',
      'Arijit Biswas',
      'Raghav Juyal'
    ],
    correctOption: 1,
    description: 'Ravi Kishan won the award for Best Performance (Male) in a Supporting Role at the IIFA Awards 2025 for his remarkable acting performance in Laapata Ladies.'
  },
  {
    question: 'Co-founder of Care Earth Trust, Dr. Jayashree Venkatesan has been awarded in which category in the 2025 "Women Changer in the World of Wetlands" released by the Ramsar Secretariat?',
    options: [
      'Contributing to Wetland Conservation',
      'Promoting International Cooperation for Wetlands Category',
      'Judicious use of wetlands',
      'None of these'
    ],
    correctOption: 2,
    description: 'Dr. Jayashree Venkatesan, co-founder of Care Earth Trust, was awarded in the "Wetland Wise Use" category in the 2025 "Women Changemakers in the World of Wetlands" list released by the Ramsar Secretariat.'
  },
  {
    question: 'Where was the final of the 9th ICC Champions Trophy 2025 held?',
    options: [
      'Dubai, United Arab Emirates',
      'Dhaka, Bangladesh',
      'Colombo, Sri Lanka',
      'Karachi, Pakistan'
    ],
    correctOption: 0,
    description: 'The final of the 9th ICC Champions Trophy 2025 was held in Dubai on 9 March.'
  }
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
        return curr.submitted && curr.selectedOption === defaultQuestions[idx].correctOption
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
      submitted: false
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

  return (
    !started ? (
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to QuizMaster</h1>
        <p className={styles.questionCardDescription}>
          Test your knowledge with our quick and fun quizzes!
        </p>
        <button className={styles.startBtn} onClick={() => setStarted(true)}>Start Quiz</button>
      </header>
    ) : (
      <div className={styles.quizContainer}>
        {showSuccess && (
          <>
            {/* Success Message */}
            <div style={{
              position: 'fixed',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#4BB543',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              zIndex: 10001,
              textAlign: 'center',
              animation: 'fadeInOut 3s ease'
            }}>
              🎉 Perfect Score! Well Done! 🎉
            </div>

            {/* Animated Ribbons */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`${styles.ribbon} ${styles[`ribbon-${i}`]}`} />
            ))}
          </>
        )}

        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#fff'
        }}>
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

        <div style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>
          Total Correct: <span translate='no'>{score} / {defaultQuestions.length}</span>
        </div>

        <button className={styles.startBtn} onClick={handleReset}>Reset Quiz</button>
      </div>)
  );
};

export default QuizPage;
