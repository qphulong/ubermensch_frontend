import React, { useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import styles from './TwoDDisplay.module.css';

interface TwoDDisplayProps {
  deltaH: number; // e.g. 0.01 or other values
}

const TwoDDisplay: React.FC<TwoDDisplayProps> = ({ deltaH }) => {
  // Cone dimensions
  const coneHeight = 2;
  const baseRadius = 1;

  // Canvas dimensions
  const canvasWidth = 300;
  const topMargin = 50;
  const canvasHeight = 300 + topMargin; // 350 pixels total height

  // Mapping functions:
  // mapX: from domain [-1,1] to canvas x-coordinate
  const mapX = (x: number) => ((x + 1) / 2) * canvasWidth;
  // mapY: from cone height [0,coneHeight] (0 at base) to canvas y-coordinate (base at bottom)
  const mapY = (y: number) => canvasHeight - ((y / coneHeight) * 300);
  // Inverse mapping: from canvas y-coordinate to cone height value
  const mapYInv = (pixelY: number) => ((canvasHeight - pixelY) / 300) * coneHeight;

  // Define triangle points (outline of the cone)
  const trianglePoints = [
    mapX(-baseRadius), mapY(0),    // base left
    mapX(baseRadius), mapY(0),     // base right
    mapX(0), mapY(coneHeight),     // apex (h)
  ];

  // Central vertical axis (for guidance)
  const axisPoints = [mapX(0), mapY(coneHeight), mapX(0), mapY(0)];

  // Compute slices based on deltaH
  const nSlices = Math.floor(coneHeight / deltaH);
  const slices = [];
  for (let i = 0; i < nSlices; i++) {
    const yBottom = i * deltaH;
    let yTop = (i + 1) * deltaH;
    if (yTop > coneHeight) yTop = coneHeight;

    // Calculate the half width at a given height
    const halfWidthAt = (y: number) => baseRadius * (1 - y / coneHeight);
    const bottomHalf = halfWidthAt(yBottom);
    const topHalf = halfWidthAt(yTop);

    const points = [
      mapX(-bottomHalf), mapY(yBottom), // bottom left
      mapX(bottomHalf), mapY(yBottom),  // bottom right
      mapX(topHalf), mapY(yTop),        // top right
      mapX(-topHalf), mapY(yTop),       // top left
    ];

    slices.push({ points, i, yBottom, yTop });
  }

  // State for the draggable point along the cone’s height.
  // (This point denotes a height value along the triangle)
  const [pointHeight, setPointHeight] = useState(coneHeight / 2);

  // Compute the canvas coordinates for the draggable point (always centered horizontally)
  const draggablePointX = mapX(0);
  const draggablePointY = mapY(pointHeight);

  // Determine which slice the point is in (by comparing with the slice vertical bounds)
  let selectedSliceIndex = Math.floor(pointHeight / deltaH);
  if (selectedSliceIndex >= slices.length) {
    selectedSliceIndex = slices.length - 1;
  }

  // Determine label text for the draggable point.
  // If deltaH is 0.01, we show 'dx', otherwise 'δx'
  const labelText =
    deltaH === 0.01
      ? 'dx'
      : 'Δx';

  // Handler when dragging the point
  const handleDragMove = (e: any) => {
    const newY = e.target.y();
    const newHeight = Math.max(0, Math.min(mapYInv(newY), coneHeight));
    setPointHeight(newHeight);
  };

  return (
    // Make sure the container has position relative so that the HTML overlays can be positioned correctly.
    <div className={styles.container} style={{ position: 'relative', width: canvasWidth, height: canvasHeight }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {/* Central vertical line */}
          <Line points={axisPoints} stroke="black" strokeWidth={1} />

          {/* Triangle outline */}
          <Line points={trianglePoints} stroke="black" strokeWidth={2} closed />

          {/* Slices */}
          {slices.map(({ points, i }) => {
            const isSelected = i === selectedSliceIndex;
            return (
              <Line
                key={i}
                points={points}
                closed
                stroke={isSelected ? "red" : "gray"}
                strokeWidth={isSelected ? 2 : 1}
                fill={isSelected ? "yellow" : "#ddd"}
                opacity={0.6}
              />
            );
          })}

          {/* Draggable point */}
          <Circle
            x={draggablePointX}
            y={draggablePointY}
            radius={6}
            fill="blue"
            draggable
            dragBoundFunc={(pos) => ({
              x: draggablePointX,
              y: Math.max(mapY(coneHeight), Math.min(pos.y, mapY(0))),
            })}
            onDragMove={handleDragMove}
          />
        </Layer>
      </Stage>

      {/* ---- HTML overlays instead of Konva Text ---- */}
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          width: canvasWidth,
          textAlign: 'center',
          pointerEvents: 'none',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Cone 2D Display
      </div>

      {/* Label for the draggable point (show dx or δx) */}
      <div
        style={{
          position: 'absolute',
          left: draggablePointX + 10,
          top: draggablePointY - 10,
          pointerEvents: 'none',
          color: 'blue',
          fontSize: '14px',
        }}
      >
        {labelText}
      </div>

      {/* Denote 0 at the base */}
      <div
        style={{
          position: 'absolute',
          left: mapX(0) - 15,
          top: mapY(0) - 15,
          pointerEvents: 'none',
          color: 'black',
          fontSize: '16px',
        }}
      >
        0
      </div>

      {/* Denote h (apex) */}
      <div
        style={{
          position: 'absolute',
          left: mapX(0) - 15,
          top: mapY(coneHeight) - 15,
          pointerEvents: 'none',
          color: 'black',
          fontSize: '16px',
        }}
      >
        h
      </div>

      {/* Denote r at the bottom right */}
      <div
        style={{
          position: 'absolute',
          left: mapX(baseRadius) + 5,
          top: mapY(0) - 15,
          pointerEvents: 'none',
          color: 'black',
          fontSize: '16px',
        }}
      >
        r
      </div>
    </div>
  );
};

export default TwoDDisplay;
