import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Tile = ({ tile, onActivate, dwellTime }) => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(100);

  const positions = [
    { top: '10%',    left: '10%' },
    { top: '10%',    left: '50%' },
    { top: '10%',    right: '10%' },
    { bottom: '10%', left: '10%' },
    { bottom: '10%', left: '50%' },
    { bottom: '10%', right: '10%' }
  ];

  useEffect(() => {
    let animationFrameId;
    let startTime;

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percentage = 100 - (elapsed / dwellTime) * 100;

      if (percentage <= 0) {
        onActivate(tile.action);
        setProgress(0);
      } else {
        setProgress(percentage);
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    if (hovering) {
      const startTime = Date.now();
      // how do i set a timer here 

      
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = 100 - (elapsed / dwellTime) * 100;
        if (percentage <= 0) {
          clearInterval(timer);
          onActivate(tile.action);
          // setHovering(false);
          setProgress(100);
        } else {
          setProgress(percentage);
        }
      }, 50);
    } else {
      startTime = null;
      if (progress === 0)
        setProgress(100);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hovering, onActivate, tile, dwellTime]);

  return (
    <div
      className="tile"
      style={tile.customStyle || {}}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // onClick={() => onActivate(tile.action)}
    >
      <div className="label">
        {t(tile.label)}
      </div>
      
      {hovering && tile.surroundingLetters?.map((letter, index) => (
        <span
          key={index}
          className="surrounding-letter"
          style={positions[index]}
        >
          {letter}
        </span>
      ))}
      
      {hovering && (
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;