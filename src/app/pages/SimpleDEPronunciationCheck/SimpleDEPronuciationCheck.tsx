import React, { useState, useEffect, useRef } from "react";
import styles from "./SimpleDEPronunciationCheck.module.css";

import MainSpace from "./components/MainSpace/MainSpace";
import APIKeyManager from "./components/APIKeyManager/APIKeyManager";
import History from "./components/History/History";
export interface HistoryItem {
  id: string;
  user: {
    text?: string;
    speechUrl?: string;
  };
  model: {
    text?: string;
    speechUrl?: string;
  };
}

const SimpleDEPronunciationCheck: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [language, setLanguage] = useState("de");

  /* TTS */
  const [ttsText, setTtsText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  /* SST */
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [sttLoading, setSttLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // APIKeyManager functions
  useEffect(() => {
    const savedKey = localStorage.getItem("openAiApiKey");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const saveKey = (key: string) => {
    localStorage.setItem("openAiApiKey", key);
    setApiKey(key);
  };

  const deleteKey = () => {
    localStorage.removeItem("openAiApiKey");
    setApiKey(null);
  };

  // MainSpace functions
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
    <div className={styles.layout}>
      <MainSpace
        apiKey={apiKey}
        language={language}
        setLanguage={setLanguage}
        isRecording={isRecording}
        sttLoading={sttLoading}
        recognizedText={recognizedText}
        ttsText={ttsText}
        setTtsText={setTtsText}
        ttsLoading={ttsLoading}
        audioUrl={audioUrl}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        handleGenerateSpeech={handleGenerateSpeech}
      />
      <div className={styles.rightSide}>
        <APIKeyManager apiKey={apiKey} saveKey={saveKey} deleteKey={deleteKey} />
        <History />
      </div>
    </div>
  );
};

export default SimpleDEPronunciationCheck;
