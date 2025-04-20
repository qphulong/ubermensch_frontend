import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ConeSceneProps {
  deltaH: number;
  rotationSpeed: number;
  setRotationAngle: (angle: number | ((prev: number) => number)) => void;
}

const ConeScene: React.FC<ConeSceneProps> = ({
  deltaH,
  rotationSpeed,
  setRotationAngle,
}) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  useFrame((_, delta) => {
    if (!isDragging && coneRef.current) {
      const angle = rotationSpeed * delta;
      coneRef.current.rotation.y += angle;
      setRotationAngle((prev) => prev + angle);
    }
  });

  const handlePointerDown = (e: any) => {
    if (e.button === 2) setIsDragging(true); // Right click
  };

  const handlePointerUp = (e: any) => {
    if (e.button === 2) setIsDragging(false);
  };

  return (
    <>
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
      <mesh
        ref={coneRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <coneGeometry args={[1, 2, 32, Math.floor(2 / deltaH)]} />
        <meshStandardMaterial color={'orange'} wireframe/>
      </mesh>
      <OrbitControls enableRotate={!isDragging} />
    </>
  );
};

export default ConeScene;
