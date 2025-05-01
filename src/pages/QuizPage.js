import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import styles from '../styles/QuizPage.module.css';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 17; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Who was appointed as the Chairman and Managing Director of Hindustan Petroleum Corporation (HPCL) on March 7?',
    options: [
      'Sanjay Gupta',
      'Anil Mehta',
      'Rajesh Verma',
      'Vikas Kaushal'
    ],
    correctOption: 3,
    description: 'Vikas Kaushal was appointed as the Chairman and Managing Director of Hindustan Petroleum Corporation (HPCL) on March 7, 2025.'
  },
  {
    question: 'In March 2025, PM Modi has become the first Indian to be awarded the highest civilian award of which of the following country?',
    options: [
      'Mauritius',
      'Indonesia',
      'Malaysia',
      'Sri Lanka'
    ],
    correctOption: 0,
    description: 'Prime Minister Shri Narendra Modi receives the highest Civilian Award of Mauritius at the National Day Celebrations (March 12, 2025).'
  },
  {
    question: 'India\'s first hydrogen train will be launched on _____________ by 31st March.',
    options: [
      'Agra-Kota Road',
      'Mumbai-Ahmedabad route',
      'Jind-Sonipat Road',
      'None of the above'
    ],
    correctOption: 2,
    description: 'India\'s first hydrogen-powered train is set to be launched on the Jind-Sonipat route in Haryana by 31st March 2025.'
  },
  {
    question: 'Which is the world\'s second largest arms importer after Ukraine in the period 2020-24?',
    options: [
      'France',
      'India',
      'Russia',
      'Belgium'
    ],
    correctOption: 1,
    description: 'India was the world\'s second-largest arms importer after Ukraine during the 2020–24 period, according to the Stockholm International Peace Research Institute (SIPRI).'
  },
  {
    question: 'The Commonwealth Games Federation (CGF) has changed its name to:',
    options: [
      'Commonwealth Athletics',
      'Commonwealth Sport',
      'Commonwealth Federation',
      'Commonwealth Championships'
    ],
    correctOption: 1,
    description: 'The Commonwealth Games Federation (CGF) has rebranded itself as the Commonwealth Sport to better align with its core sporting identity.'
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
