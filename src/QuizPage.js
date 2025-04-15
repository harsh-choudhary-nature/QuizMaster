import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 2; // Increment this manually when you release a new set


const defaultQuestions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctOption: 2,
    description: 'Paris is the capital city of France.'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctOption: 1,
    description: 'Mars is often called the Red Planet because of its reddish appearance.'
  },
  {
    question: 'What is the largest mammal?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctOption: 1,
    description: 'The blue whale is the largest animal known to have ever existed.'
  },
  {
    question: 'Which language is primarily used for web development?',
    options: ['Python', 'C++', 'HTML', 'Java'],
    correctOption: 2,
    description: 'HTML is the standard markup language for web pages.'
  },
  {
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correctOption: 2,
    description: 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.'
  },
];

const QuizPage = () => {

  const [userProgress, setUserProgress] = useState([]);
  const [score, setScore] = useState(0);


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
        Total Correct: {score} / {defaultQuestions.length}
      </div>

      <button className="start-btn" onClick={handleReset}>Reset Quiz</button>
    </div>
  );
};

export default QuizPage;
