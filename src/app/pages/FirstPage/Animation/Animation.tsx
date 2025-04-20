import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ConeScene from './components/ConeScene/ConeScene';
import ControlsPanel from './components/ControlsPanel/ControlsPanel';
import TwoDDisplay from './components/TwoDDisplay/TwoDDisplay';
import styles from './Animation.module.css';

const Animation: React.FC = () => {
  const [deltaH, setDeltaH] = useState(0.1);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [rotationAngle, setRotationAngle] = useState(0);

  return (
    <div className={styles.container}>
      {/* Left Section: 3D Cone */}
      <div className={styles.leftSection}>
        <Canvas className={styles.canvasContainer}>
          <ConeScene
            deltaH={deltaH}
            rotationSpeed={rotationSpeed}
            setRotationAngle={setRotationAngle}
          />
        </Canvas>
      </div>

      {/* Right Section: Controls (top) and 2D Slice Display (bottom) */}
      <div className={styles.rightSection}>
        <div className={styles.controlsPanel}>
          <ControlsPanel
            deltaH={deltaH}
            setDeltaH={setDeltaH}
            rotationSpeed={rotationSpeed}
            setRotationSpeed={setRotationSpeed}
          />
        </div>
        <div className={styles.twoDDisplay}>
          <TwoDDisplay deltaH={deltaH} />
        </div>
      </div>
    </div>
  );
};

export default Animation;