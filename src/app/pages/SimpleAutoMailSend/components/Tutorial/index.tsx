import React, { useState } from 'react';
import styles from './Tutorial.module.css';
import amiNeutral from '../../local_resources/ami_neutral_looped.gif';
import amiHappy from '../../local_resources/ami_happy_looped.gif';
import { p1Prompt } from './prompts';
import { p2Prompt } from './prompts';

interface TutorialProps {
  isVisible: boolean;
  onMouseLeave: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isVisible, onMouseLeave }) => {
  const [showCopiedP1, setShowCopiedP1] = useState(false);
  const [showCopiedP2, setShowCopiedP2] = useState(false);

  const copyP1ToClipboard = () => {
    navigator.clipboard.writeText(p1Prompt).then(
      () => {
        setShowCopiedP1(true);
        setTimeout(() => setShowCopiedP1(false), 2000);
      },
      (err) => console.error('Failed to copy p1 prompt:', err)
    );
  };

  const copyP2ToClipboard = () => {
    navigator.clipboard.writeText(p2Prompt).then(
      () => {
        setShowCopiedP2(true);
        setTimeout(() => setShowCopiedP2(false), 2000);
      },
      (err) => console.error('Failed to copy p2 prompt:', err)
    );
  };

  return (
    <div
      className={`${styles.tutorial} ${isVisible ? styles.tutorialVisible : ''}`}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.headerSection}>
        <h2>Tutorial</h2>
      </div>

      <div className={styles.p1}>
        <div className={styles.p1Left}>
          <img src={amiNeutral} className={styles.gifImage} alt="Ami Neutral" />
        </div>
        <div className={styles.p1Right}>
          <p>First copy the prompt to ask any LLM (ChatGPT, Grok, ...) to let them guide you to obtain your gmail App password.
            <br />If you cannot do this, then even God cannot help you.
            <br />A Gmail App Password is a 16 digit code that looks like this "xxxx xxxx xxxx xxxx".
            <br />The code would help you use this tool.
          </p>
          <div className={styles.promptContainer}>
            <pre className={styles.prompt}>{p1Prompt}</pre>
            <div className={styles.buttonWrapper}>
              <button className={styles.copyButton} onClick={copyP1ToClipboard} title="Copy to clipboard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              {showCopiedP1 && <span className={styles.copiedMessage}>Copied</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.p2}>
        <div className={styles.p2Left}>
          <img src={amiNeutral} className={styles.gifImage} alt="Ami Neutral" />
        </div>
        <div className={styles.p2Right}>
          <p>Open a new LLM conversation (Optional but recommended), and give the LLM the new prompt along with your data.
          </p>
          <div className={styles.promptContainer}>
            <pre className={styles.prompt}>{p2Prompt}</pre>
            <div className={styles.buttonWrapper}>
              <button className={styles.copyButton} onClick={copyP2ToClipboard} title="Copy to clipboard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              {showCopiedP2 && <span className={styles.copiedMessage}>Copied</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.p3}>
        <div className={styles.p3Left}>
          <img src={amiHappy} className={styles.gifImage} alt="Ami Happy" />
        </div>
        <div className={styles.p3Right}>
          <p>Paste the JSON and the Right section help you re-check information (LLM may response inaccurate)
            <br/>That is the end of the turotial.
            <br/>Dont worry about the security problem around the App password. We just use it only for the sending email service. Check out the open source code.
            <br/>https://github.com/qphulong/simple_auto_mail_send
            <br/>Or if you concern, you could delete the used App password then re-create a new one for next use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;