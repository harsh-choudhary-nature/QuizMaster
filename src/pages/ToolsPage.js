import styles from "../styles/GamesPage.module.css";
import { useNavigate } from "react-router-dom";

export default function ToolsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Tools</h1>
      <div className={styles.gamesGrid}>
        <div
          className={styles.gameCard}
          onClick={() => navigate("/tools/you-tube")}
        >
          <div className={styles.gameTitle}>YouTube</div>
        </div>

        {/* Add more games manually here if you want */}
      </div>
    </div>
  );
}
