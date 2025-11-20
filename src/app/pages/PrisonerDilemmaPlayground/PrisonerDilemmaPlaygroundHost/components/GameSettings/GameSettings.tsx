import { useState } from "react";
import styles from "./GameSettings.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function GameSettings() {
  const [isEditMode, setIsEditMode] = useState(false);

  // Left side settings
  const [allowChat, setAllowChat] = useState(true);
  const [anonymousPlay, setAnonymousPlay] = useState(false);
  const [roundTimeLimit, setRoundTimeLimit] = useState("60");
  const [numberOfRounds, setNumberOfRounds] = useState("10");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoundCount, setShowRoundCount] = useState(true);

  // Reward matrix (Prisoner's Dilemma)
  const [matrix, setMatrix] = useState({
    bothCooperate: "70",
    bothDefect: "20",
    oneCooperates: "10",
    oneDefects: "90",
  });

  // For canceling changes
  const [originalState, setOriginalState] = useState({
    allowChat,
    anonymousPlay,
    roundTimeLimit,
    numberOfRounds,
    password,
    showRoundCount,
    matrix: { ...matrix },
  });

  const enterEditMode = () => {
    setOriginalState({
      allowChat,
      anonymousPlay,
      roundTimeLimit,
      numberOfRounds,
      password,
      showRoundCount,
      matrix: { ...matrix },
    });
    setIsEditMode(true);
  };

  const cancelChanges = () => {
    setAllowChat(originalState.allowChat);
    setAnonymousPlay(originalState.anonymousPlay);
    setRoundTimeLimit(originalState.roundTimeLimit);
    setNumberOfRounds(originalState.numberOfRounds);
    setPassword(originalState.password);
    setShowRoundCount(originalState.showRoundCount);
    setMatrix({ ...originalState.matrix });
    setIsEditMode(false);
  };

  const saveChanges = () => {
    setIsEditMode(false);
  };

  // Input validation helpers
  const handleRoundTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) <= 180)) {
      setRoundTimeLimit(value);
    }
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 100)) {
      setNumberOfRounds(value);
    }
  };

  const handleMatrixChange = (key: keyof typeof matrix, value: string) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setMatrix(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className={styles.gameSettingsContainer}>
      <div className={styles.leftSide}>
        <h2 className={styles.sectionTitle}>Game Settings</h2>

        <div className={styles.settingRow}>
          <label>Allow Chat</label>
          <button
            className={`${styles.toggle} ${allowChat ? styles.active : ""}`}
            onClick={() => isEditMode && setAllowChat(!allowChat)}
            disabled={!isEditMode}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>

        <div className={styles.settingRow}>
          <label>Anonymous Play</label>
          <button
            className={`${styles.toggle} ${anonymousPlay ? styles.active : ""}`}
            onClick={() => isEditMode && setAnonymousPlay(!anonymousPlay)}
            disabled={!isEditMode}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>

        <div className={styles.settingRow}>
          <label>Round Time Limit (seconds)</label>
          <input
            type="text"
            value={roundTimeLimit}
            onChange={handleRoundTimeChange}
            disabled={!isEditMode}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.settingRow}>
          <label>Number of Rounds</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={numberOfRounds}
              onChange={handleRoundsChange}
              disabled={!isEditMode}
              className={styles.numberInput}
            />
            <button
              className={styles.eyeButton}
              onMouseDown={() => isEditMode && setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              disabled={!isEditMode}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className={styles.settingRow}>
          <label>Show Round Count</label>
          <button
            className={`${styles.toggle} ${showRoundCount ? styles.active : ""}`}
            onClick={() => isEditMode && setShowRoundCount(!showRoundCount)}
            disabled={!isEditMode}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.matrixSection}>
          <h3 className={styles.matrixTitle}>Prisoner's Dilemma Reward Matrix</h3>
          <div className={styles.matrixGrid}>
            <div className={styles.matrixCellLabel}></div>
            <div className={styles.matrixHeader}>Cooperate</div>
            <div className={styles.matrixHeader}>Defect</div>

            <div className={styles.matrixLabel}>Cooperate</div>
            <input
              type="text"
              value={matrix.bothCooperate}
              onChange={(e) => handleMatrixChange("bothCooperate", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
            <input
              type="text"
              value={matrix.oneCooperates}
              onChange={(e) => handleMatrixChange("oneCooperates", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />

            <div className={styles.matrixLabel}>Defect</div>
            <input
              type="text"
              value={matrix.oneDefects}
              onChange={(e) => handleMatrixChange("oneDefects", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
            <input
              type="text"
              value={matrix.bothDefect}
              onChange={(e) => handleMatrixChange("bothDefect", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
          </div>
          <div className={styles.matrixLegend}>
            <p><strong>T</strong> = Temptation ({matrix.oneDefects}), <strong>R</strong> = Reward ({matrix.bothCooperate})</p>
            <p><strong>P</strong> = Punishment ({matrix.bothDefect}), <strong>S</strong> = Sucker ({matrix.oneCooperates})</p>
          </div>
        </div>

        <div className={styles.buttonsSection}>
          <button
            onClick={enterEditMode}
            disabled={isEditMode}
            className={`${styles.actionButton} ${styles.editButton}`}
          >
            Edit
          </button>
          <button
            onClick={cancelChanges}
            disabled={!isEditMode}
            className={`${styles.actionButton} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            disabled={!isEditMode}
            className={`${styles.actionButton} ${styles.saveButton}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}