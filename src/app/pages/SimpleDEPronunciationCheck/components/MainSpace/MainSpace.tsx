import React from 'react';
import { useState } from 'react';
import styles from "./MainSpace.module.css";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { HistoryItem } from '../../SimpleDEPronuciationCheck';
import { styled } from "@mui/material/styles";
import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

interface MainSpaceProps {
  apiKey: string | null;
  language: string;
  setLanguage: (lang: string) => void;
  isRecording: boolean;
  sttLoading: boolean;
  recognizedText: string | null;
  ttsText: string;
  setTtsText: (text: string) => void;
  ttsLoading: boolean;
  audioUrl: string | null;

  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleGenerateSpeech: () => void;
  handleAppendHistory: (item: HistoryItem) => { success: boolean; missing?: string };
}

const MainSpace: React.FC<MainSpaceProps> = ({
  apiKey,
  language,
  setLanguage,
  isRecording,
  sttLoading,
  recognizedText,
  ttsText,
  setTtsText,
  ttsLoading,
  audioUrl,
  handleStartRecording,
  handleStopRecording,
  handleGenerateSpeech,
  handleAppendHistory,
}) => {
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  // helpers to show a toast for a short time
  function showToast(message:string, type = "info", ms = 3000) {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), ms);
  }

  function onAppendHistoryClick() {
    const result = handleAppendHistory({
      user: { text: recognizedText ?? undefined },
      model: { text: ttsText || undefined, speechUrl: audioUrl || undefined },
    });


    if (!result?.success) {
      showToast(`❌ Could not save: ${result?.missing ?? "unknown"}`, "error");
    } else {
      showToast("✅ Saved to history!", "success");
    }
  }

return (
  <div className={styles.mainSpace}>
    {!apiKey && <p>No API key available.</p>}

    {apiKey && (
      <div className={styles.container}>
        {/* ---------- 1️⃣ Language Selector ---------- */}
        <Box className={styles.languageSection}>
          <LanguageIcon color="primary" className={styles.icon} />
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              label="Language"
              className={styles.select}
            >
              <MenuItem value="en">🇺🇸 English</MenuItem>
              <MenuItem value="de">🇩🇪 German</MenuItem>
              <MenuItem value="ja">🇯🇵 Japanese</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ---------- 2️⃣ STT Section ---------- */}
        <div className={`${styles.sttSection}`}>
          <h3>Speech → Text (STT)</h3>
          <div className={styles.rowBetween}>
            <div className={styles.recordingControls}>
              <button
                onClick={handleStartRecording}
                className={`${styles.buttonAlt} ${styles.iconButton}`}
                aria-pressed={isRecording}
              >
                <MicIcon />
              </button>
              <button
                onClick={handleStopRecording}
                className={`${styles.buttonAlt} ${styles.iconButton}`}
              >
                <StopIcon />
              </button>
              {isRecording && <span className={styles.recordingPill}>Recording…</span>}
              {sttLoading && <span className={styles.loadingText}>Transcribing…</span>}
            </div>

            <div className={styles.resultRight}>
              {recognizedText ? (
                <div className={styles.resultBox} role="region" aria-live="polite">
                  <p><strong>Recognized:</strong></p>
                  <div className={styles.resultScroll}>{recognizedText}</div>
                </div>
              ) : (
                <div className={styles.resultBoxEmpty}>No recognition yet</div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- 3️⃣ TTS Section ---------- */}
        <div className={`${styles.section} ${styles.ttsSection}`}>
          <h3>Text → Speech (TTS)</h3>
          <div className={styles.rowBetween}>
            <textarea
              className={styles.textInput}
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Enter text to convert to speech..."
            />
            <div className={styles.resultRight}>
              <button
                onClick={handleGenerateSpeech}
                disabled={ttsLoading || !ttsText}
                className={styles.button}
              >
                {ttsLoading ? "Generating…" : "🔊 Generate Speech"}
              </button>
              {audioUrl && <audio controls src={audioUrl} className={styles.audioPlayer} />}
            </div>
          </div>
        </div>

        {/* ---------- 4️⃣ History Section ---------- */}
        <div className={`${styles.historySection}`}>
          <h3>📜 Save to History</h3>
          <div className={styles.rowBetween}>
            <button
              className={styles.button}
              onClick={onAppendHistoryClick}
              disabled={!recognizedText && !ttsText && !audioUrl}
            >
              ➕ Add to History
            </button>
            {toast.visible && (
              <div
                className={`${styles.toast} ${
                  toast.type === "error" ? styles.toastError : styles.toastSuccess
                }`}
                role="status"
              >
                {toast.message}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default MainSpace;