import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 10; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Who has been awarded the Pritzker Prize 2025?',
    options: ['Riken Yamamoto', 'Liu Jiacun', 'David Chipperfield', 'Balkrishna Doshi'],
    correctOption: 1,
    description: 'The 2025 Pritzker Architecture Prize was awarded to Chinese architect Liu Jiakun.'
  },
  {
    question: 'Who has recently been appointed as the CEO of Government e-Marketplace (GeM)?',
    options: ['Ved Prakash Goyal', 'Ajay Khanna', 'Ajay Bhadoo', 'Rajiv Kumar'],
    correctOption: 2,
    description: 'Ajay Bhadoo, a senior bureaucrat, has been appointed as the CEO of Government e-Marketplace (GeM), a platform that facilitates procurement of goods and services by government departments and organizations.'
  },
  {
    question: 'The US will impose reciprocal tariffs against _______ and ___________ from April 2.',
    options: ['India & China', 'China & Pakistan', 'China and Russia', 'Cuba and India'],
    correctOption: 0,
    description: 'Starting April 2, the United States announced it will impose reciprocal tariffs against China and India in response to unfair trade practices.'
  },
  {
    question: 'According to the 19th Wealth Report 2025, India has emerged as the fourth-largest global wealth centre in the world. Who issues this wealth report?',
    options: ['Knight Frank', 'Concern Worldwide and Welthungerhilf', 'Henley & Partners', 'World Bank'],
    correctOption: 0,
    description: 'The 19th Wealth Report 2025, issued by global real estate consultancy Knight Frank, highlights India as the fourth-largest global wealth centre, reflecting the country\'s economic growth and increasing number of ultra-high-net-worth individuals.'
  },
  {
    question: 'Which Australian cricketer has announced his retirement from ODI cricket on 4th March?',
    options: ['Travis Head', 'Phillip Hughes', 'Glenn Maxwell', 'Steve Smith'],
    correctOption: 3,
    description: 'Steve Smith announced his retirement from One-Day International (ODI) cricket on March 4, 2025, following Australia’s semi-final exit in the Champions Trophy. He concluded his ODI career with 5,800 runs in 170 matches, contributing significantly to Australia’s World Cup victories in 2015 and 2023.'
  },
];

const QuizPage = () => {
  
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
    <div className="quiz-container">
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
            <div key={i} className={`ribbon ribbon-${i}`} />
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
        Total Correct: <span translate = 'no'>{score} / {defaultQuestions.length}</span>
      </div>

      <button className="start-btn" onClick={handleReset}>Reset Quiz</button>
    </div>
  );
};

export default QuizPage;
