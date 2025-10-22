import React, { useState } from "react";
import styles from "./APIKeyManager.module.css";

interface APIKeyManagerProps {
  apiKey: string | null;
  saveKey: (key: string) => void;
  deleteKey: () => void;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({
  apiKey,
  saveKey,
  deleteKey,
}) => {
  const [inputKey, setInputKey] = useState<string>("");

  const handleSave = () => {
    if (inputKey.trim()) {
      saveKey(inputKey.trim());
      setInputKey("");
    }
  };

  return (
    <div className={styles.apiKeyManager}>
      <h3 className={styles.title}>API Key Manager</h3>
      <div className={styles.section}>
        <input
          type="password"
          placeholder="Enter OpenAI API Key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSave} className={styles.button}>
          Save Key
        </button>
      </div>
      <div className={styles.status}>
        {apiKey ? <p>✅ API Key is loaded.</p> : <p>❌ No API Key stored.</p>}
      </div>
      <div className={styles.section}>
        <button onClick={deleteKey} className={styles.buttonDelete}>
          Delete Key
        </button>
      </div>
    </div>
  );
};

export default APIKeyManager;
