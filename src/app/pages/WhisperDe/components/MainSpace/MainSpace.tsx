import React, { useState, useRef } from "react";
import styles from "./MainSpace.module.css";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

interface MainSpaceProps {
  apiKey: string | null;
}

const MainSpace: React.FC<MainSpaceProps> = ({ apiKey }) => {
  /** ---------- TTS state ---------- */
  const [ttsText, setTtsText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  /** ---------- STT state ---------- */
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [sttLoading, setSttLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [language, setLanguage] = useState("de");

  /** ---------- TTS handler ---------- */
  const handleGenerateSpeech = async () => {
    if (!apiKey || !ttsText) return;
    setTtsLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          voice: "alloy",
          input: ttsText,
        }),
      });

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      alert("TTS failed.");
    } finally {
      setTtsLoading(false);
    }
  };

  /** ---------- STT handlers ---------- */
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("Recording not supported.");
      return;
    }
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "speech.webm");
      formData.append("model", "gpt-4o-mini-transcribe");
      formData.append("language", language);

      setSttLoading(true);
      try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        });

        const data = await response.json();
        setRecognizedText(data.text);
      } catch (err) {
        console.error(err);
        alert("STT failed.");
      } finally {
        setSttLoading(false);
      }
    };
  };

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