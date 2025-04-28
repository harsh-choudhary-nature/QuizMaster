import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import styles from '../styles/QuizPage.module.css';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 14; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Who has been selected for the 2024 Maharashtra Bhushan Award by the Maharashtra government?',
    options: ['Arun Yogiraj', 'Leela Mukherjee', 'Ram Sutar', 'Meira Mukherjee'],
    correctOption: 2,
    description: 'Renowned sculptor Ram Sutar, known for designing the Statue of Unity, has been selected for the 2024 Maharashtra Bhushan Award by the Maharashtra government.'
  },
  {
    question: 'Who was awarded the prestigious Stockholm Water Prize on March 20, 2025?',
    options: ['Günter Bloschl', 'Taikan Oki', 'Andrea Rinaldo', 'Wilfred H. Brutsart'],
    correctOption: 0,
    description: 'Based on his world-renowned work on flood risk reduction, water resource management, flood scaling, and regional process hydrology – Professor Günter Blöschl wins the Stockholm Water Prize 2025.'
  },
  {
    question: 'ISRO develops high-speed microprocessors ______ and ______ for space missions.',
    options: ['Vikram 201, Kalpana 201', 'Vikram 301, Kalpana 301', 'Vikram 3201, Kalpana 3201', 'Vikram 320, Kalpana 320'],
    correctOption: 2,
    description: 'ISRO develops high-speed microprocessors VIKRAM3201 and KALPANA3201 for space missions. These 32-bit microprocessors are designed and developed by the Vikram Sarabhai Space Centre of ISRO in collaboration with Semiconductor Laboratory (SCL), Chandigarh.'
  },
  {
    question: 'Which is the first State Legislative Assembly in India to broadcast its proceedings in sign language?',
    options: ['Uttar Pradesh Legislative Assembly', 'Madhya Pradesh Legislative Assembly', 'Punjab Assembly', 'Rajasthan Assembly'],
    correctOption: 2,
    description: 'Punjab has become the first state in India to broadcast its state Legislative Assembly proceedings in Sign language.'
  },
  {
    question: 'Which state government approved a 100% hike in the salaries of CM, ministers and legislators?',
    options: ['Karnataka', 'Assam', 'Madhya Pradesh', 'Rajasthan'],
    correctOption: 0,
    description: 'The Karnataka government has approved 100% salary hike for the Chief Minister, ministers, and members of the Legislative Assembly (MLAs).'
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
