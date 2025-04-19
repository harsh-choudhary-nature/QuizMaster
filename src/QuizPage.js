import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 6; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'The government has announced plans to set up the second National Gene Bank (NGB). Where is India\'s first NGB located?',
    options: ['Hyderabad', 'Ahmedabad', 'New Delhi', 'Lucknow'],
    correctOption: 2,
    description: 'India\'s first National Gene Bank (NGB) is located at the National Bureau of Plant Genetic Resources (NBPGR) in New Delhi.'
  },
  {
    question: 'Gujarat International Finance Tec-City (GIFT City) has improved its ranking in the Global Financial Centres Index. The overall rank of GIFT City has increased from 52 to _____.',
    options: ['45', '46', '47', '48'],
    correctOption: 1,
    description: 'In the 37th edition of the Global Financial Centres Index (GFCI) published in March 2025, Gujarat International Finance Tec-City (GIFT City) improved its overall ranking from 52nd to 46th place.'
  },
  {
    question: 'The government increased MGNREGS wages by 2-7% for FY26. Haryana will see the highest increase of ______.',
    options: ['₹16', '₹26', '₹36', '₹46'],
    correctOption: 1,
    description: 'For the financial year 2025–26, the Government of India increased wages under the Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS) by 2–7%. Haryana recorded the highest absolute increase of ₹26, raising the daily wage from ₹374 to ₹400. This marks the first time any state has reached the ₹400 per day threshold under MGNREGS.'
  },
  {
    question: 'Which state has recently been awarded by the Union Ministry of Health and Family Welfare (MoHFW) for its outstanding performance in the TB free India campaign?',
    options: ['Tripura', 'Sikkim', 'Madhya Pradesh', 'Maharashtra'],
    correctOption: 0,
    description: 'Tripura was recently awarded by the Union Ministry of Health and Family Welfare (MoHFW) for its outstanding performance in the TB Free India campaign. The award was given on World TB Day, recognizing the state\'s progress in combating tuberculosis.'
  },
  {
    question: 'Where was the Tri-Services Desert Hunt 2025 exercise held?',
    options: ['Auli, Uttarakhand', 'Jodhpur, Rajasthan', 'Bhubaneswar, Odisha', 'Umroi, Meghalaya'],
    correctOption: 1,
    description: 'The Tri-Services Desert Hunt 2025 exercise was conducted at Air Force Station Jodhpur, Rajasthan, from February 24 to 28, 2025. This exercise involved the Indian Army, Indian Navy, and Indian Air Force and was aimed at enhancing joint operational capabilities in desert terrain.'
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
