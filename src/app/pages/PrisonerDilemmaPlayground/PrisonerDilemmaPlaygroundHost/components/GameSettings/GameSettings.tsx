import { useState, useEffect } from "react";
import styles from "./GameSettings.module.css";
import { Eye, EyeOff } from "lucide-react";
import { GameConfig } from "../..";
import { BACKEND_URL } from "@/pages/PrisonerDilemmaPlayground/api_services";
interface GameSettingsProps {
  currentConfig: GameConfig;
  onSave: (config: GameConfig) => void;
}

export default function GameSettings({ currentConfig, onSave }: GameSettingsProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [draft, setDraft] = useState<GameConfig>(currentConfig);

  // Sync draft when parent config changes AND we're not editing
  useEffect(() => {
    if (!isEditMode) {
      setDraft(currentConfig);
    }
  }, [currentConfig, isEditMode]);

  const enterEditMode = () => {
    setDraft(currentConfig); // make fresh copy
    setIsEditMode(true);
  };

  const cancelChanges = () => {
    setDraft(currentConfig); // reset to real config
    setIsEditMode(false);
  };

  const saveChanges = () => {
    onSave(draft);
    setIsEditMode(false);

    const gameId = localStorage.getItem("game_id");
    const gamePassword = localStorage.getItem("game_password");

    // Fire-and-forget POST request matching exact backend shape
    fetch(`${BACKEND_URL}/host-edit-game-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostAuth: {
          game_id: gameId,
          game_password: gamePassword,
        },
        new_config: {
          allow_chat: draft.allow_chat,
          anonymous_play: draft.anonymous_play,
          round_time_limit: draft.round_time_limit,
          number_of_rounds: draft.number_of_rounds,
          show_round_count: draft.show_round_count,
          points_both_cooperate: draft.points_both_cooperate,
          points_both_defect: draft.points_both_defect,
          points_cooperate_against_defect: draft.points_cooperate_against_defect,
          points_defect_against_cooperate: draft.points_defect_against_cooperate,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to save config:", res.status, res.statusText);
        }
      })
      .catch((err) => {
        console.error("Network error while saving game config:", err);
      });

    // No await → truly fire-and-forget
  };

  const update = <K extends keyof GameConfig>(key: K, value: GameConfig[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  // Validation helpers
  const setRoundTime = (value: string) => {
    if (value === "" || (/^\d+$/.test(value) && +value > 0 && +value <= 180)) {
      update("round_time_limit", value === "" ? 0 : +value);
    }
  };

  const setRounds = (value: string) => {
    if (value === "" || (/^\d+$/.test(value) && +value >= 1 && +value <= 100)) {
      update("number_of_rounds", value === "" ? 0 : +value);
    }
  };

  const setMatrixValue = (
    key: "points_both_cooperate" | "points_defect_against_cooperate" |
          "points_cooperate_against_defect" | "points_both_defect",
    value: string
  ) => {
    if (value === "" || (/^\d+$/.test(value) && +value >= 0 && +value <= 100)) {
      update(key, value === "" ? 0 : +value);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.gameSettingsContainer}>
      <div className={styles.leftSide}>
        <h2 className={styles.sectionTitle}>Game Settings</h2>
        <div className={styles.settingRow}>
          <label>Game ID</label>
          <div className={styles.gameIdDisplay}>
            {localStorage.getItem("game_id") || "—"}
          </div>
        </div>

        <div className={styles.settingRow}>
          <label>Allow Chat</label>
          <button
            className={`${styles.toggle} ${draft.allow_chat ? styles.active : ""}`}
            onClick={() => isEditMode && update("allow_chat", !draft.allow_chat)}
            disabled={!isEditMode}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>

        <div className={styles.settingRow}>
          <label>Anonymous Play</label>
          <button
            className={`${styles.toggle} ${draft.anonymous_play ? styles.active : ""}`}
            onClick={() => isEditMode && update("anonymous_play", !draft.anonymous_play)}
            disabled={!isEditMode}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>

        <div className={styles.settingRow}>
          <label>Round Time Limit (seconds)</label>
          <input
            type="text"
            value={draft.round_time_limit }
            onChange={e => setRoundTime(e.target.value)}
            disabled={!isEditMode}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.settingRow}>
          <label>Number of Rounds</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={draft.number_of_rounds}
              onChange={e => setRounds(e.target.value)}
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
            className={`${styles.toggle} ${draft.show_round_count ? styles.active : ""}`}
            onClick={() => isEditMode && update("show_round_count", !draft.show_round_count)}
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
              value={draft.points_both_cooperate}
              onChange={e => setMatrixValue("points_both_cooperate", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
            <input
              type="text"
              value={draft.points_cooperate_against_defect}
              onChange={e => setMatrixValue("points_cooperate_against_defect", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />

            <div className={styles.matrixLabel}>Defect</div>
            <input
              type="text"
              value={draft.points_defect_against_cooperate}
              onChange={e => setMatrixValue("points_defect_against_cooperate", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
            <input
              type="text"
              value={draft.points_both_defect}
              onChange={e => setMatrixValue("points_both_defect", e.target.value)}
              disabled={!isEditMode}
              className={styles.matrixInput}
            />
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