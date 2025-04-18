import React, { useState } from 'react';
import './App.css';
import QuizPage from './QuizPage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="App">
      {!started ? (
        <header className="App-header">
          <h1 className="App-title">Welcome to QuizMaster</h1>
          <p className="App-description">
            Test your knowledge with our quick and fun quizzes!
          </p>
          <button className="start-btn" onClick={() => setStarted(true)}>Start Quiz</button>
        </header>
      ) : (
        <QuizPage />
      )}
      <Analytics />
    </div>
  );
}

export default App;
