import React from "react";
import styles from "./History.module.css";
import { HistoryItem } from "../../SimpleDEPronuciationCheck";

interface HistoryProps {
  history: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const handlePlay = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => console.error("Failed to play audio:", err));
  };

  if (history.length === 0) {
    return <p className={styles.empty}>No history yet</p>;
  }

  return (
    <div className={styles.historyContainer}>
      <ul className={styles.list}>
        {history.map((item, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.userBlock}>
              <span className={styles.label}>Model hear as:</span>
              <p className={styles.text}>{item.user.text || "[speech]"}</p>
            </div>

            <div className={styles.modelBlock}>
              <span className={styles.label}>Desired output:</span>
              <p className={styles.text}>{item.model.text || "[speech]"}</p>
              {item.model.speechUrl && (
                <button
                  className={styles.playButton}
                  onClick={() => handlePlay(item.model.speechUrl)}
                >
                  ▶️ Play
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
