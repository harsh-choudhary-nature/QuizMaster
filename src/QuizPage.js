import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 7; // Increment this manually when you release a new set

const defaultQuestions = [
  {
    question: 'Which team has won the 2024-25 Ranji Trophy?',
    options: ['Karnataka', 'Vidarbha', 'Kerala', 'Mumbai'],
    correctOption: 1,
    description: 'The winner of the 2024–25 Ranji Trophy is Vidarbha. They secured the title by taking a first-innings lead over Kerala in the final held at the Vidarbha Cricket Association Ground in Nagpur. Although the match ended in a draw, Vidarbha\'s superior first-innings performance ensured their victory.'
  },
  {
    question: 'Who has recently been appointed as the Controller General of Defence Accounts?',
    options: ['Rajiv Sinha', 'Dr. Mayank Sharma', 'Abhay Saxena', 'Vinod Kumar'],
    correctOption: 1,
    description: 'Dr. Mayank Sharma, a 1989-batch officer of the Indian Defence Accounts Service (IDAS), assumed the office of Controller General of Defence Accounts (CGDA) on March 1, 2025.'
  },
  {
    question: 'Who won the Best Picture award at the 97th Academy Awards?',
    options: ['The Brutalist', 'Lapta Ladies', 'Anora', 'None of these'],
    correctOption: 2,
    description: 'At the 97th Academy Awards held on March 2, 2025, Anora won the Best Picture award. Directed by Sean Baker, the film also secured four other Oscars: Best Director, Best Actress (Mikey Madison), Best Original Screenplay, and Best Film Editing.'
  },
  {
    question: 'In which year was the first Zero Discrimination Day celebration celebrated?',
    options: ['2012', '2013', '2014', '2015'],
    correctOption: 2,
    description: 'Zero Discrimination Day was first celebrated on March 1, 2014. It was launched by UNAIDS Executive Director Michel Sidibé with a major event in Beijing on February 27, 2014.'
  },
  {
    question: 'Which international organization declared March 3 as World Wildlife Day?',
    options: ['United Nations General Assembly', 'World Bank', 'UNESCO', 'International Monetary Fund'],
    correctOption: 0,
    description: 'On December 20, 2013, during its 68th session, the United Nations General Assembly proclaimed March 3 as World Wildlife Day to celebrate and raise awareness of the world\'s wild fauna and flora.'
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
