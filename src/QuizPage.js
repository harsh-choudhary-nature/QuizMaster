import React, { useState, useEffect } from 'react';
import Question from './components/Question';

const LOCAL_STORAGE_KEY = 'quiz-progress';
const VERSION_KEY = 'quiz-version';
const QUIZ_VERSION = 3; // Increment this manually when you release a new set


const defaultQuestions = [
  {
    question: 'Which of the following states is included in the sixth schedule of the Constitution of India?',
    options: ['Nagaland', 'Manipur', 'Mizoram', 'Anuranchal Pradesh'],
    correctOption: 2,
    description: 'Assam, Meghalaya, Tripura and Mizoram are provisioned under the sixth schedule of the constitution of India [Article 244].'
  },
  {
    question: 'Which of the following articles of the Constitution of India has a provision for financial emergency?',
    options: ['Article 365', 'Article 356', 'Article 330', 'Article 360'],
    correctOption: 3,
    description: 'Article 360 states that a financial emergency can be declared by the President of India, in case the financial stability or credit of India or any part thereof is threatened.'
  },
  {
    question: 'Which article of the Constitution of India mentions that the Lok Sabha must have a Speaker and a Depty Speaker?',
    options: ['Article 93', 'Article 85', 'Article 100', 'Article 97'],
    correctOption: 0,
    description: 'This is mentioned in Article 93 of the constitution of India.'
  },
  {
    question: 'Which of the following articles of the Constituion of India has a provision for the Constitution of Legislatures in States?',
    options: ['Article 167', 'Article 168', 'Article 163', 'Article 165'],
    correctOption: 1,
    description: 'Article 168 of the Constitution states that for every state there shall be a Legislature which shall consist of the Governor and 1 (or 2) house(es).'
  },
  {
    question: 'Which of the following articles of the Constitution of India provides constitutional remedies for the enforcement of fundamental rights?',
    options: ['Article 40', 'Article 36', 'Article 38', 'Article 32'],
    correctOption: 3,
    description: 'Article 32 provides the right to constitutional remedies for the enforcement of fundamental rights. It is also called the heart and soul of the Constitution.'
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
