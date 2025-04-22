import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 9; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Which public sector company has been granted the status of the 25th Navratna Central Public Sector Enterprise (CPSE)?',
    options: ['IRCTC', 'IRFC', 'SJVN', 'NHPC'],
    correctOption: 0,
    description: 'The public sector company granted Navratna status as the 25th Central Public Sector Enterprise (CPSE) is Indian Railway Catering and Tourism Corporation (IRCTC). The upgrade was approved by the Centre on March 3, 2025. Additionally, Indian Railway Finance Corporation (IRFC) was also granted Navratna status, making it the 26th Navratna CPSE.'
  },
  {
    question: "'Diyasalai' is the autobiography of whom?",
    options: ['Namita Gokhale', 'Arun Shourie', 'Amitabh Kant', 'Kailash Satyarthi'],
    correctOption: 3,
    description: "'Diyaslai' is the autobiography of Kailash Satyarthi, a Nobel Peace Prize laureate and social reformer. The book is a Hindi autobiography that details Satyarthi's life, his activism against child labor, and his efforts to promote education and global compassion."
  },
  {
    question: 'Who became the first woman from India to cross 16 meters in indoor shot put?',
    options: ['Krishna Jaishankar', 'Purnarao Rane', 'Abha Khatua', 'None of these'],
    correctOption: 0,
    description: 'Krishna Jayasankar was the first Indian woman to cross the 16-meter mark in indoor shot put. She achieved this feat at the Mountain West Indoor Track and Field Championships 2025 in Albuquerque, USA, with a throw of 16.03 meters, also setting a new national record.'
  },
  {
    question: 'India can include Tamal in its navy by June 2025. What is Tamal?',
    options: [
      'Tamal is the new book by Booker Prize-winning author Arundhati Roy.',
      'It is a multi-role stealth guided missile frigate.',
      'It is a bulletproof jacket developed by the Defence Research and Development Organisation (DRDO).',
      'It is the first supercomputer made in India.'
    ],
    correctOption: 1,
    description: "Tamal is a multi-role stealth guided missile frigate that India plans to include in its navy by June 2025, enhancing maritime defense capabilities."
  },
  {
    question: 'The Govindghat to Hemkund Sahib Jee ropeway project was approved by the Centre, it is in which state?',
    options: ['Himachal Pradesh', 'Uttarakhand', 'Arunachal Pradesh', 'Sikkim'],
    correctOption: 1,
    description: 'The Govindghat to Hemkund Sahib ropeway project, aimed at improving connectivity to the revered Sikh pilgrimage site, is located in Uttarakhand.'
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
