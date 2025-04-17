import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 4; // Increment this manually when you release a new set


const defaultQuestions = [
  {
    question: 'Who founded the Tattvabodhini Sabha that was set up to explore spiritual truth?',
    options: ['Keshab Chandra Sen', 'Raja Ram Mohan Roy', 'Debendranath Tagore', 'Dayanand Saraswati'],
    correctOption: 2,
    description: 'The Tattvabodhini Sabha was founded by Debendranath Tagore in 1839. It was established as a reformist group within the Brahmo Samaj to promote spiritual inquiry, rational thought, and the study of the Upanishads.'
  },
  {
    question: 'In which of the following animal phyla, is the body divided into head, thorax and abdomen?',
    options: ['Annelida', 'Mollusca', 'Arthropoda', 'Chordata'],
    correctOption: 2,
    description: 'Arthropoda: This phylum includes animals like insects, crustaceans, and arachnids, and many of them (especially insects) show this clear tripartite body segmentation.'
  },
  {
    question: 'Which state had the first female Governor in independent India?',
    options: ['West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Gujarat'],
    correctOption: 2,
    description: 'The first female Governor in independent India was Sarojini Naidu, who became the Governor of Uttar Pradesh in 1947.'
  },
  {
    question: 'Who among the following was the head of the Diwan-i-Insha department under the Delhi sultanate?',
    options: ['Dabir-i-Khas', 'Barid-i-Mumalik', 'Amir-i-Dad', 'Wakil-i-Dar'],
    correctOption: 0,
    description: 'The head of the Diwan-i-Insha department under the Delhi Sultanate was the Dabir-i-Khas (also known as Insha-i-Mahall).'
  },
  {
    question: 'In which year did Antoine Lavoisier publish ‘Methods of Chemical Nomenclature’, which included the rules for naming chemical compounds that are still in use today?',
    options: ['1783', '1780', '1790', '1787'],
    correctOption: 3,
    description: 'Antoine Lavoisier published ‘Methods of Chemical Nomenclature’ in the year 1787. This work laid the foundation for the systematic naming of chemical compounds.'
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
            top: '20%',
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
        🧠 General Quiz
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
