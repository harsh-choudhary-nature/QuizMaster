import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import styles from '../styles/QuizPage.module.css';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 13; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Which state government has launched Project Hifazat to protect women and children from violence?',
    options: ['Maharashtra', 'West Bengal', 'Punjab', 'Uttar Pradesh'],
    correctOption: 2,
    description: 'The Punjab government has launched Project Hifazat to protect women and children from violence, aiming to provide better safety and support mechanisms. Under this project, the 181 women\'s helpline and 1098 children\'s helpline will be empowered.'
  },
  {
    question: 'Who will become the 24th Prime Minister of Canada?',
    options: ['John Alexander', 'John Abbott', 'Mario Garcia', 'Mark Carney'],
    correctOption: 3,
    description: 'Mark Carney, a former Bank of Canada and Bank of England governor, is set to become the 24th Prime Minister of Canada.'
  },
  {
    question: 'Which wildlife sanctuary has been notified as the 58th Tiger Reserve of the country?',
    options: ['Madhav National Park, Madhya Pradesh', 'Sundarbans, West Bengal', 'Pilibhit, Uttar Pradesh', 'Srivilliputhur Megamalai, Tamil Nadu'],
    correctOption: 0,
    description: 'Madhav National Park in Madhya Pradesh has been notified as the 58th Tiger Reserve of India, further strengthening the country’s tiger conservation efforts. This addition makes Madhya Pradesh the state with the highest number of tiger reserves in India, totaling nine. The reserve is located in the Shivpuri district of Madhya Pradesh.'
  },
  {
    question: 'Bengaluru City University will be renamed after whom?',
    options: ['APJ Abdul Kalam', 'Atal Bihari Vajpayee', 'Dr. Manmohan Singh', 'Manohar Parrikar'],
    correctOption: 2,
    description: 'Bangalore City University will be renamed after the late former Prime Minister Manmohan Singh.'
  },
  {
    question: 'Delhi govt approves \'Mahila Samridhi Yojana\' to provide __________ to women',
    options: ['Rs. 3,500', 'Rs. 1,500', 'Rs. 2,000', 'Rs. 2,500'],
    correctOption: 3,
    description: 'The Delhi government approved the \'Mahila Samridhi Yojana\' to provide Rs. 2,500 financial support to women.'
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
