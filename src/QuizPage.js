import React from 'react';
import Question from './components/Question';

const QuizPage = () => {
  const questions = [
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

  return (
    <div className="quiz-container">
      {questions.map((q, idx) => (
        <Question
          key={idx}
          question={q.question}
          options={q.options}
          correctOption={q.correctOption}
          description={q.description}
        />
      ))}
    </div>
  );
};

export default QuizPage;
