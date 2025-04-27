import React from 'react';
import styles from '../styles/QuizPage.module.css';

const Question = ({ question, options, correctOption, description, selectedOption, submitted, onSelectOption, onSubmit }) => {

  return (
    <div className={styles.questionCard}>
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
        <button className={styles.submitBtn} onClick={onSubmit} disabled={submitted || selectedOption === null}>
          Submit
        </button>
      )}
      {submitted && (
        <div className={`${styles.result} ${selectedOption === correctOption ? styles.correct : styles.wrong}`}>
          <p>
            {selectedOption === correctOption ? '✅ Correct!' : '❌ Incorrect.'}
          </p>
          <p className={styles.description}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
