import React from 'react';

const Question = ({ question, options, correctOption, description, selectedOption, submitted, onSelectOption, onSubmit }) => {

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
                checked={selectedOption === idx}
                onChange={() => onSelectOption(idx)}
              />
              {' '}{opt}
            </label>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button className="submit-btn" onClick={onSubmit} disabled={submitted || selectedOption === null}>
          Submit
        </button>
      )}
      {submitted && (
        <div className={`result ${selectedOption === correctOption ? 'correct' : 'wrong'}`}>
          <p>
            {selectedOption === correctOption ? '✅ Correct!' : '❌ Incorrect.'}
          </p>
          <p className="description">{description}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
