import styles from '../styles/GamesPage.module.css';
import { useNavigate } from 'react-router-dom';

export default function GamesPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Games</h1>
            <div className={styles.gamesGrid}>
                <div className={styles.gameCard} onClick={() => navigate('/games/daily-quiz')}>
                    <div className={styles.gameTitle}>Daily Quiz</div>
                </div>
                <div className={styles.gameCard} onClick={() => navigate('/games/hangman')}>
                    <div className={styles.gameTitle}>Hangman</div>
                </div>
                <div className={styles.gameCard} onClick={() => navigate('/games/wordladder')}>
                    <div className={styles.gameTitle}>Word Ladder</div>
                </div>
                {/* 


                <div className={styles.gameCard} onClick={() => navigate('/games/memory')}>
                    <div className={styles.gameTitle}>Memory Match</div>
                </div> */}

                {/* Add more games manually here if you want */}
            </div>
        </div>
    );
}
