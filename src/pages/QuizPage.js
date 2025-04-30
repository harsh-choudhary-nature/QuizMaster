import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import styles from '../styles/QuizPage.module.css';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 16; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'India won the 6th Asian Women\'s Kabaddi Championship 2025 by defeating which team in the final?',
    options: [
      'Thailand',
      'Iran',
      'Japan',
      'South Korea'
    ],
    correctOption: 1,
    description: 'India defeated Iran to win the 6th Asian Women\'s Kabaddi Championship 2025, continuing their dominance in the sport.'
  },
  {
    question: 'When is No Smoking Day observed every year?',
    options: [
      'Second Wednesday of March',
      'Third Wednesday of March',
      'First Wednesday of March',
      'Second Wednesday of April'
    ],
    correctOption: 0,
    description: 'No Smoking Day is observed every year on the second Wednesday of March to raise awareness about the harmful effects of tobacco.'
  },
  {
    question: 'Which edition of National Safety Week is observed from 4-10 March?',
    options: [
      '23rd',
      '54th',
      '65th',
      '76th'
    ],
    correctOption: 1,
    description: 'The 54th edition of National Safety Week was observed from 4–10 March 2025, promoting occupational safety and health across industries.'
  },
  {
    question: 'Which will be the first Indian state to launch its own satellite?',
    options: [
      'Government of Assam',
      'Government of Karnataka',
      'Government of Manipur',
      'Government of Maharashtra'
    ],
    correctOption: 0,
    description: 'Assam will be the first Indian state to launch its own satellite. The satellite, named ASSAMSAT, is being developed in collaboration with the Indian Space Research Organisation (ISRO) and the Indian National Space Promotion and Authorization Center (IN-SPACe). The ASSAMSAT mission aims to provide critical data for socio-economic projects, including disaster management, agriculture, border security, and infrastructure development.'
  },
  {
    question: 'Which state government has launched Mukhyamantri Balika Samridhi Yojana and Mukhyamantri Kanya Atmanirbhar Yojana in March 2025?',
    options: [
      'Manipur',
      'Meghalaya',
      'Tripura',
      'Sikkim'
    ],
    correctOption: 2,
    description: 'The Tripura government launched both the Mukhyamantri Balika Samridhi Yojana and the Mukhyamantri Kanya Atmanirbhar Yojana in March 2025.'
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
