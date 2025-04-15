import React, { useState } from 'react';

const Question = ({ question, options, correctOption, description }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  return (
    <div className="question-card">
      <h3>{question}</h3>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            <label>
              <input
                type="radio"
                name={question}
                value={idx}
                disabled={submitted}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button className="submit-btn" onClick={handleSubmit} disabled={selected === null}>
          Submit
        </button>
      )}
      {submitted && (
        <div className={`result ${selected === correctOption ? 'correct' : 'wrong'}`}>
          <p>
            {selected === correctOption ? '✅ Correct!' : '❌ Incorrect.'}
          </p>
          <p className="description">{description}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
