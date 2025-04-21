import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 8; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'How many new spiritual corridors have been announced by Uttar Pradesh Chief Minister Yogi Adityanath in the state?',
    options: ['seven', 'eight', 'five', 'four'],
    correctOption: 2,
    description: 'Five new spiritual corridors were announced by Uttar Pradesh Chief Minister Yogi Adityanath after the successful conduct of Maha Kumbh 2025.'
  },
  {
    question: 'Vantara has been inaugurated by PM Modi on 4 March 2025. It is located in which of the following states?',
    options: ['Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Karnataka'],
    correctOption: 2,
    description: 'Vantara, a sprawling green sanctuary and rehabilitation center for animals, was inaugurated by Prime Minister Narendra Modi on March 4, 2025, in Gujarat. The project aims to rescue, treat, and rehabilitate wildlife.'
  },
  {
    question: 'India emerges as __________ largest biofuel producer in the world',
    options: ['second', 'fourth', 'fifth', 'third'],
    correctOption: 3,
    description: 'India has become the third-largest biofuel producer globally, underscoring the nation’s growing focus on sustainable energy solutions and reduction of fossil fuel dependence.'
  },
  {
    question: 'When is National Safety Day celebrated every year?',
    options: ['March 3', 'March 6', 'March 4', 'March 5'],
    correctOption: 2,
    description: 'National Safety Day is celebrated on March 4 every year in India to raise awareness about safety measures and accident prevention in workplaces and daily life.'
  },
  {
    question: 'Who became the new President of Uruguay?',
    options: ['Jose Mujika', 'Luis Lackel Pou', 'Yamandu Orsi', 'Jomo Kenyatta'],
    correctOption: 2,
    description: 'Yamandu Orsi was elected as the new President of Uruguay. He succeeded Luis Lacalle Pou and represents the Broad Front party, with a focus on social policies and economic reforms.'
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
