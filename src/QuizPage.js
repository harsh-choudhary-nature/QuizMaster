import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 11; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Where will India\'s first Integrated Active Pharmaceutical Ingredient (API), Green Hydrogen and 2G Ethanol project be set up?',
    options: ['Jharkhand', 'Bihar', 'Himachal Pradesh', 'Tamil Nadu'],
    correctOption: 2,
    description: 'India\'s first integrated facility for Active Pharmaceutical Ingredient (API), Green Hydrogen, and 2G Ethanol will be set up in Una, Himachal Pradesh, marking a significant step in green energy and healthcare manufacturing.'
  },
  {
    question: 'Who among the following has received the EY Entrepreneur of the Year Award 2024?',
    options: ['KV Kamath', 'Ritesh Agarwal', 'Tilak Mehta', 'Nitin Kamath'],
    correctOption: 3,
    description: 'Nitin Kamath, the founder of Zerodha, received the EY Entrepreneur of the Year Award 2024 for his contributions to transforming retail investing in India through innovation and transparency.'
  },
  {
    question: 'Who is the world president of the World Sustainable Development Summit?',
    options: ['United Nations Environment Programme', 'World Union for Conservation of Nature', 'The Energy and Resources Institute (TERI)', 'International Panel on Climate Change'],
    correctOption: 2,
    description: 'The Energy and Resources Institute (TERI) is the principal organizer of the World Sustainable Development Summit, where the director general of TERI acts as the global president for the summit events.'
  },
  {
    question: 'What happened immediately after the Big Bang and which telescope is going to launch on March 7 to detect the reservoirs of water in the galaxy?',
    options: ['James Webb Space Telescope', 'Hubble Space Telescope', 'Spherex', 'Chandra X-ray Observatory'],
    correctOption: 2,
    description: 'After the Big Bang, the universe rapidly expanded and cooled, forming the first atoms. NASA\'s Spherex telescope, set to launch on March 7, aims to study the origins of water and stars by conducting an infrared survey of the entire sky.'
  },
  {
    question: 'Sharath Kamal has announced his retirement from which sport?',
    options: ['tennis', 'badminton', 'hockey game', 'table tennis'],
    correctOption: 3,
    description: 'Indian table tennis legend Achanta Sharath Kamal announced his retirement from the sport, concluding a decorated career that includes multiple Commonwealth Games gold medals and a Padma Shri award.'
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
