import React from 'react';
import styles from './ControlsPanel.module.css';

interface ControlsPanelProps {
  deltaH: number;
  setDeltaH: (v: number) => void;
  rotationSpeed: number;
  setRotationSpeed: (v: number) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  deltaH,
  setDeltaH,
  rotationSpeed,
  setRotationSpeed,
}) => {
  return (
    <div className={styles.controlsPanel}>
      <label className={styles.label}>
        {deltaH === 0.01 ? (
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>dh</span>
        ) : (
          'Δh'
        )}: {deltaH.toFixed(2)}
      </label>
      <input
        className={styles.slider}
        type="range"
        min={0.01}
        max={0.5}
        step={0.01}
        value={deltaH}
        onChange={(e) => setDeltaH(Number(e.target.value))}
      />
      <label className={styles.label}>
        Rotation Speed: {rotationSpeed.toFixed(2)}
      </label>
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={0.5}
        step={0.01}
        value={rotationSpeed}
        onChange={(e) => setRotationSpeed(Number(e.target.value))}
      />
    </div>
  );
};

export default ControlsPanel;