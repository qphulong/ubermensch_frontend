import React, { useEffect, useState } from 'react';
import { sendEmails, pingServer } from './api';
import LeftJson from './components/LeftJson';
import RightCompiled from './components/RightCompiled';
import Tutorial from './components/Tutorial';
import styles from './SimpleAutoMailSend.module.css';

// Define types matching the backend
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
    subject: string;
    scores: Student[];
}

const initJson = `{
  "gmail": "YOUR EMAIL",
  "app_password": "YOUR GMAIL APP PASSWORD",
  "subject": "Your 2025 Semester Exam Results",
  "template": "Dear {student_name},\\n\\nYour exam results are as follows:\\n{marks_table}\\n\\nBest regards,\\n{sender_name}",
  "template_vars": {
    "sender_name": "YOUR SENDER NAME"
  },
  "scores": [
    {
      "student_name": "John Doe",
      "email": "a@gmail.com",
      "marks": {
        "Math": 85,
        "Science": 90,
        "English": 78
      }
    }
  ]
}`

const SimpleAutoMailSend: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(initJson);
  const [parsedData, setParsedData] = useState<EmailRequest | null>(null);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTutorialVisible, setIsTutorialVisible] = useState<boolean>(false);

  useEffect(()=>{
    const parsed = JSON.parse(initJson);
    setParsedData(parsed);
  },[])

  const handleJsonChange = (newValue: string) => {
    setJsonInput(newValue);
    try {
      const parsed = JSON.parse(newValue);
      setParsedData(parsed);
      setError('');
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError('Invalid JSON format');
      setParsedData(null);
    }
  };

  const handleSendEmails = async () => {
    if (!parsedData) {
      setError('No valid JSON data to send');
      return;
    }

    setIsLoading(true);
    setStatus('');
    setError('');

    try {
      const result = await sendEmails(parsedData);
      setStatus(result.message || 'Emails sent successfully');
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.half_left}>
        <div
          className={styles.trigger_area}
          onMouseEnter={() => setIsTutorialVisible(true)}
        ></div>
        <div
          className={`${styles.tutorial_wrapper} ${isTutorialVisible ? styles.tutorial_open : styles.tutorial_closed
            }`}
          onMouseLeave={() => setIsTutorialVisible(false)}
        >
          <Tutorial isVisible={isTutorialVisible} onMouseLeave={() => setIsTutorialVisible(false)} />
        </div>
        <LeftJson
          jsonInput={jsonInput}
          onJsonChange={handleJsonChange}
          onSendEmails={handleSendEmails}
          isLoading={isLoading}
          parsedData={parsedData}
          status={status}
          error={error}
        />
      </div>
      <div className={styles.half_right}>
        <RightCompiled parsedData={parsedData} />
      </div>
    </div>
  );
};

export default SimpleAutoMailSend;