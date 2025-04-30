import React, { useState, useEffect } from 'react';
import styles from '../styles/WordLadder.module.css';

const WORD_LENGTH = 5;
const MAX_STEPS = 6;
const START_WORD = 'plant';
const END_WORD = 'spare';

const isOneLetterDifferent = (word1, word2) => {
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) count++;
        if (count > 1) return false;
    }
    return count === 1;
};

const WordLadder = () => {
    const [wordList, setWordList] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [entries, setEntries] = useState([START_WORD]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('/words_dictionary.json')
            .then(res => res.json())
            .then(data => {
                const fiveLetterWords = Object.keys(data).filter(word => word.length === WORD_LENGTH);
                setWordList(new Set(fiveLetterWords));
            })
            .catch(() => setStatus('Failed to load dictionary'));
    }, []);

    const handleSubmit = () => {
        const prevWord = entries[entries.length - 1];
        const newWord = input.toLowerCase();

        if (newWord.length !== WORD_LENGTH) {
            setStatus('Word must be 5 letters long.');
            return;
        }

        if (!isOneLetterDifferent(prevWord, newWord)) {
            setStatus('Only one letter can be changed.');
            return;
        }

        if (!wordList || !wordList.has(newWord)) {
            setStatus('Invalid English word.');
            return;
        }

        setEntries([...entries, newWord]);
        setCurrentStep(prev => prev + 1);
        setInput('');
        setStatus('');

        if (newWord === END_WORD && currentStep + 1 === MAX_STEPS) {
            setStatus('🎉 Congratulations! You solved the Word Ladder!');
        } else if (currentStep + 1 === MAX_STEPS && newWord !== END_WORD) {
            setStatus('❌ Game Over! Final word does not match the target.');
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setEntries([START_WORD]);
        setInput('');
        setStatus('');
    };

    return (
        <div className="gameContainer">
            <div className="gameTitle">Word Ladder</div>

            <div className="gameBoard">
                <div className="wordDisplay">
                    {entries.map((word, idx) => (
                        <div key={idx} className="letter" style={{ color: word === END_WORD ? 'green' : 'black' }}>
                            {word.toUpperCase()}
                        </div>
                    ))}
                </div>

                <div className="attempts">
                    Step {currentStep}/{MAX_STEPS} | Goal: {END_WORD.toUpperCase()}
                </div>

                {currentStep < MAX_STEPS && !status.includes('Congratulations') && (
                    <div style={{ marginTop: '1rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            maxLength={WORD_LENGTH}
                            className={styles.wordInput}
                            placeholder="Enter next word"
                        />
                        <button className="letterButton" onClick={handleSubmit}>Submit</button>
                    </div>
                )}

                {status && <div className="gameStatus">{status}</div>}
                <button className="resetButton" onClick={handleReset}>Reset Game</button>
            </div>
        </div>
    );
};

export default WordLadder;
