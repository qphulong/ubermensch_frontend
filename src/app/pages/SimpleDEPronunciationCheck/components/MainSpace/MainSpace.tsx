import React from 'react';
import styles from "./MainSpace.module.css";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

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
}) => {
  return (
    <div className={styles.mainSpace}>
      {!apiKey && <p>No API key available.</p>}

      {apiKey && (
        <>
            <div className={styles.languageSelector}>
                <label htmlFor="language-select" className={styles.label}>
                    🌐 Language
                </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={styles.select}
                >
                    <option value="en">English 🇺🇸</option>
                    <option value="de">German 🇩🇪</option>
                    <option value="ja">Japanese 🇯🇵</option>
                </select>
            </div>
          {/* ---------- STT Section ---------- */}
          <div className={styles.section}>
            <h3>Speech → Text (STT)</h3>
            <div className={styles.recordingControls}>
                <button onClick={handleStartRecording} className={styles.buttonAlt}>
                    <MicIcon />
                </button>
                <button onClick={handleStopRecording} className={styles.buttonAlt}>
                    <StopIcon />
                </button>
            </div>
            {isRecording && <p style={{ color: "red" }}>Recording...</p>}
            {sttLoading && <p>Transcribing...</p>}
            {recognizedText && (
              <div className={styles.resultBox}>
                <p><strong>Recognized:</strong> {recognizedText}</p>
              </div>
            )}
          </div>

          {/* ---------- TTS Section ---------- */}
          <div className={styles.section}>
            <h3>Text → Speech (TTS)</h3>
            <textarea
              className={styles.textInput}
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Enter text to convert to speech..."
            />
            <button
              onClick={handleGenerateSpeech}
              disabled={ttsLoading || !ttsText}
              className={styles.button}
            >
              {ttsLoading ? "Generating..." : "🔊 Generate Speech"}
            </button>
            {audioUrl && (
              <audio controls src={audioUrl} className={styles.audioPlayer} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MainSpace;