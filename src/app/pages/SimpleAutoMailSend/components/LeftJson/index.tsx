import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import styles from './LeftJson.module.css';
import AmiSleeping from "./../../local_resources/ami_sleeping.gif";
import AmiNotHappy from "./../../local_resources/ami_not_happy.gif";
import { pingServer } from '../../api';

interface Student {
  student_name: string;
  email: string;
  marks: { [key: string]: number };
}

interface EmailRequest {
  gmail: string;
  app_password: string;
  template: string;
  template_vars: { [key: string]: string };
  scores: Student[];
}

interface LeftJsonProps {
  jsonInput: string;
  onJsonChange: (newValue: string) => void;
  onSendEmails: () => void;
  isLoading: boolean;
  parsedData: EmailRequest | null;
  status: string;
  error: string;
}

const LeftJson: React.FC<LeftJsonProps> = ({
  jsonInput,
  onJsonChange,
  onSendEmails,
  isLoading,
  parsedData,
  status,
  error,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);

  // Function to handle server ping
  const handlePing = async () => {
    setIsPinging(true);
    setPingError(null);
    try {
      await pingServer();
    } catch (err: any) {
      setPingError(err.message || 'Failed to ping server');
    } finally {
      setIsPinging(false);
    }
  };

  // Set up interval to ping server every minute
  useEffect(() => {
    // Initial ping on component mount
    handlePing();

    // Set up interval to ping every 60 seconds
    const intervalId = setInterval(() => {
      handlePing();
    }, 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.leftPanel}>
      <div className={styles.headerSection}>
        <h2>Paste JSON Here</h2>
        <img
          src={isPinging ? AmiSleeping : AmiNotHappy}
          alt={isPinging ? 'Ami Sleeping' : 'Ami Not Happy'}
          className={styles.statusGif}
        />
      </div>
      <div className={styles.editorSection}>
        <AceEditor
          mode="json"
          theme="dracula"
          value={jsonInput}
          onChange={onJsonChange}
          width="70%"
          height="100%"
          setOptions={{ useWorker: false }}
          className={styles.aceEditor}
        />
      </div>
      <div className={styles.footerSection}>
        <button
          onClick={onSendEmails}
          disabled={isLoading || !parsedData}
          className={`${styles.button} ${isLoading || !parsedData ? styles.buttonDisabled : styles.buttonEnabled}`}
        >
          {isLoading ? 'Sending...' : 'Send Emails'}
        </button>
        {status && <div className={styles.successMessage}>{status}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {pingError && <div className={styles.errorMessage}>{pingError}</div>}
      </div>
    </div>
  );
};

export default LeftJson;