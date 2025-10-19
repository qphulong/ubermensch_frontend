import React, { useState, useEffect } from "react";
import styles from "./SimpleDEPronunciationCheck.module.css";

import MainSpace from "./components/MainSpace/MainSpace";
import APIKeyManager from "./components/APIKeyManager/APIKeyManager";
import History from "./components/History/History";

const SimpleDEPronunciationCheck: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load cached key on mount
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

  return (
    <div className={styles.layout}>
      <MainSpace apiKey={apiKey} />
      <div className={styles.rightSide}>
        <APIKeyManager apiKey={apiKey} saveKey={saveKey} deleteKey={deleteKey} />
        <History />
      </div>
    </div>
  );
};

export default SimpleDEPronunciationCheck;
