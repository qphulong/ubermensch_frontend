// GameOrchestra.tsx
import { useState } from "react";
import styles from "./GameOrchestra.module.css";
import { Eye, EyeOff } from "lucide-react"; // optional: for nice eye icons

export default function GameOrchestra() {
  const [isEntryClosed, setIsEntryClosed] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTotalRounds, setShowTotalRounds] = useState(false);

  // Mock data - replace with API later
  const currentRound = 7;
  const totalRounds = 12;

  const handleCloseEntry = () => {
    if (!isEntryClosed) {
      setIsEntryClosed(true);
    }
  };

  const handleStartGame = () => {
    if (isEntryClosed && !isGameStarted) {
      setIsGameStarted(true);
    }
  };

  const handlePauseGame = () => {
    setIsPaused(prev => !prev);
  };

  const handleDeleteGame = () => {
    if (confirm("Are you sure you want to delete this game? This cannot be undone.")) {
      // Reset all state
      setIsEntryClosed(false);
      setIsGameStarted(false);
      setIsPaused(false);
    }
  };

  return (
    <div className={styles.gameOrchestraContainer}>
      {/* Round Display - Top */}
      <div className={styles.roundDisplay}>
        <div className={styles.roundText}>
          Round:{" "}
          <span className={styles.currentRound}>{currentRound}</span>
          <span className={styles.slash}>/</span>
          <span className={`${styles.totalRound} ${showTotalRounds ? styles.visible : ""}`}>
            {totalRounds}
          </span>
        </div>
        <button
          className={styles.eyeButton}
          onMouseDown={() => setShowTotalRounds(true)}
          onMouseUp={() => setShowTotalRounds(false)}
          onMouseLeave={() => setShowTotalRounds(false)}
          aria-label="Hold to reveal total rounds"
        >
          {showTotalRounds ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      {/* Control Buttons Grid */}
      <div className={styles.buttonsGrid}>
        {/* Top Left - Close Entry & Ready */}
        <div className={styles.buttonWrapper}>
          <button
            className={`${styles.controlButton} ${styles.closeEntry} ${isEntryClosed ? styles.clicked : ""}`}
            onClick={handleCloseEntry}
            disabled={isEntryClosed}
          >
            {isEntryClosed ? "✓ Entry Closed" : "Close Entry & Ready"}
          </button>
          <p className={styles.buttonGuide}>
            Locks new entries and prepares game start (one-time action)
          </p>
        </div>

        {/* Top Right - Start Game */}
        <div className={styles.buttonWrapper}>
          <button
            className={`${styles.controlButton} ${styles.startGame} ${isGameStarted ? styles.clicked : ""}`}
            onClick={handleStartGame}
            disabled={!isEntryClosed || isGameStarted}
          >
            {isGameStarted ? "✓ Game Started" : "Start Game"}
          </button>
          <p className={styles.buttonGuide}>
            Begins the game (can only start after entry is closed)
          </p>
        </div>

        {/* Bottom Left - Pause Game */}
        <div className={styles.buttonWrapper}>
          <button
            className={`${styles.controlButton} ${styles.pauseGame} ${isPaused ? styles.paused : ""}`}
            onClick={handlePauseGame}
            disabled={!isEntryClosed || !isGameStarted}
          >
            {isPaused ? "▶ Resume" : "❚❚ Pause"}
          </button>
          <p className={styles.buttonGuide}>
            Pauses or resumes the current game
          </p>
        </div>

        {/* Bottom Right - Delete Game */}
        <div className={styles.buttonWrapper}>
          <button
            className={`${styles.controlButton} ${styles.deleteGame}`}
            onClick={handleDeleteGame}
            disabled={!isEntryClosed}
          >
            Delete Game
          </button>
          <p className={styles.buttonGuide}>
            Permanently removes this game session
          </p>
        </div>
      </div>
    </div>
  );
}