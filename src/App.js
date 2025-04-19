import React, { useState } from 'react';
import './App.css';
import QuizPage from './QuizPage';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';


function App() {
  const [started, setStarted] = useState(false);

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element = 
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
            )} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
