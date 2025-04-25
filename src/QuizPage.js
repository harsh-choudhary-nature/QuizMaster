import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 12; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'The central government has approved \'Project Lion\' along with the budget of the ________.',
    options: ['Rs 3,000.34 crore', 'Rs 2,500 crore', 'Rs 2,927.71 crore', 'Rs 2,800 crore'],
    correctOption: 2,
    description: 'The central government approved Project Lion with a total budget of Rs 2,927.71 crore to ensure the long-term conservation of the Asiatic lions in Gujarat\'s Gir region.'
  },
  {
    question: 'Where was the Shaurya Vedna Utsav organized by the Union Ministry of Defence in March 2025?',
    options: ['Bihar', 'West Bengal', 'Punjab', 'Uttar Pradesh'],
    correctOption: 0,
    description: 'The Shaurya Vedanam Utsav, organized by the Union Ministry of Defence, took place in Motihari, Bihar in March 2025. The event, which ran from March 7th to 8th, 2025, was a two-day display of the Indian Armed Forces\' military prowess. It was the first-ever Shaurya Vedanam Utsav.'
  },
  {
    question: 'Which conference was inaugurated by President Droupadi Murmu on International Women\'s Day 2025?',
    options: ['Women\'s Empowerment Summit', 'India Developed by Women Power Conference', 'India Uday Conference', 'National Gender Equality Summit'],
    correctOption: 1,
    description: 'On International Women\'s Day 2025, President Droupadi Murmu inaugurated the "India Developed by Women Power Conference" to emphasize women-led development initiatives.'
  },
  {
    question: 'Which state government has announced to set up a media monitoring centre to analyse news content from print, electronic and digital media?',
    options: ['Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Tamil Nadu'],
    correctOption: 1,
    description: 'The Maharashtra government will set up a media monitoring centre at an estimated cost of Rs 10 crore that will monitor news coverage related to the state government in print, electronic, social and digital mediums.'
  },
  {
    question: 'Which of the following state cabinet approved the implementation of Integrated Pension Scheme?',
    options: ['Uttar Pradesh', 'Madhya Pradesh', 'Himachal Pradesh', 'Uttarakhand'],
    correctOption: 3,
    description: 'Uttarakhand Cabinet approves implementation of Unified Pension Scheme. The Uttarakhand Cabinet, led by Chief Minister Pushkar Singh Dhami, approved the Unified Pension Scheme, set to be operational from April 1, 2025.'
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
