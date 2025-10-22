import React from 'react';
import { useState } from 'react';
import styles from "./MainSpace.module.css";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { HistoryItem } from '../../SimpleDEPronuciationCheck';
import { FormControl, InputLabel, MenuItem, Select, Box, Button } from "@mui/material";
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
          <div className={styles.topRow}>
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
          </div>
          <div className={styles.note}>
            Hint: Practicing full sentences like "The stars shine in the sky" may help improve accuracy.
          </div>
        </Box>

        {/* ---------- 2️⃣ STT Section ---------- */}
        <div className={styles.sttSection}>
          <h3 style={{ marginLeft: '8px' }}>Speech → Text (STT)</h3>
          <div className={styles.sttContainer}>
            <div className={styles.sttInput}>
              <div className={styles.sttButtons}>
                <button onClick={handleStartRecording} aria-pressed={isRecording}>
                  <MicIcon />
                </button>
                <button onClick={handleStopRecording}>
                  <StopIcon />
                </button>
              </div>

              <div className={styles.sttStatus}>
                {isRecording && <span>Recording…</span>}
                {sttLoading && <span>Transcribing…</span>}
              </div>
            </div>

            <div className={styles.sttOutput}>
              {recognizedText ? (
                <div role="region" aria-live="polite">
                  <p><strong>Recognized:</strong></p>
                  <div>{recognizedText}</div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {/* ---------- 3️⃣ TTS Section ---------- */}
        <div className={styles.ttsSection}>
          <h3 style={{ marginLeft: '8px' }}>Text → Speech (TTS)</h3>
          <div className={styles.ttsContainer}>
            <div className={styles.ttsLeft}>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Enter text to convert to speech..."
              />
            </div>

            <div className={styles.ttsRight}>
              <div className={styles.upperDiv}>
                <button
                  onClick={handleGenerateSpeech}
                  disabled={ttsLoading || !ttsText}
                >
                  {ttsLoading ? "Generating…" : "🔊 Generate Speech"}
                </button>
              </div>
              <div className={styles.lowerDiv}>
                {audioUrl && <audio controls src={audioUrl} />}
              </div>
            </div>
          </div>
        </div>


        {/* ---------- 4️⃣ History Section ---------- */}
        <div className="history-section">
          <h3 style={{ marginLeft: '8px' }}>Save to History</h3>
          <div className="history-content">
            <Button
              variant="contained"
              color="primary"
              onClick={onAppendHistoryClick}
              disabled={!recognizedText || !ttsText || !audioUrl}
              sx={{ marginLeft: '8px', textTransform: 'none' }}
              startIcon={<span>➕</span>}
            >
              Add to History
            </Button>
            {toast.visible && (
              <div
                className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}
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