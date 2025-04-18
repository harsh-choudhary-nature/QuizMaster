import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 5; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Which cell disorder in our body is responsible for colour blindness?',
    options: ['WBC', 'Cone cell', 'Rod Cell', 'Neuron'],
    correctOption: 1,
    description: 'Colour blindness is caused by a disorder in the cone cells of the retina, which are responsible for detecting light and color.'
  },
  {
    question: 'Blood is red in colour due to the presence of __________.',
    options: ['Cytochrome', 'Chlorophyll', 'Hemocyanin', 'Haemoglobin'],
    correctOption: 3,
    description: 'Blood appears red due to the presence of haemoglobin, a protein in red blood cells that carries oxygen.'
  },
  {
    question: 'Which one of the following events in a botanical garden is never directly influenced by light?',
    options: ['Flowering', 'Photosynthesis', 'Transpiration', 'Fertilization'],
    correctOption: 3,
    description: 'Fertilization in plants does not directly depend on light, though light may indirectly influence it through plant growth and development.'
  },
  {
    question: 'Which of the following is a fish?',
    options: ['Jelly fish', 'Lobster', 'Salmon', 'Whale'],
    correctOption: 2,
    description: 'Salmon is a true fish, unlike jellyfish and lobsters, which are not considered fish, and whales, which are mammals.'
  },
  {
    question: 'Which is used as an Air pollution indicator?',
    options: ['Algae', 'Fungi', 'Bacteria', 'Lichens'],
    correctOption: 3,
    description: 'Lichens are commonly used as indicators of air pollution, as they are sensitive to changes in air quality, especially the presence of sulfur dioxide.'
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
        🧠 Botany Quiz
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
