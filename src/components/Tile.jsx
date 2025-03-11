import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Tile = ({ tile, onActivate, dwellTime, otherLetters, onLetterSelected }) => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(100);

  // Calculate positions for surrounding letters
  const positions = {
    "top-left": { top: '10%',    left: '10%' },  // Top-left
    "top-center": { top: '10%',    left: '50%' },  // Top-center
    "top-right":{ top: '10%',    right: '10%' }, // Top-right
    "center-left": { top: '37%',    left: '10%'},   // Center-left
    "center-right":{ top: '37%',    right: "10%"},  // Center-right
    "bottom-left":{ bottom: '10%', left: '10%' },  
    "bottom-center":{ bottom: '10%', left: '50%' },  // Bottom-center
    "bottom-right":{ bottom: '10%', right: '10%' }  // Bottom-right
  };

  useEffect(() => {
    let timer;
    if (hovering) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = 100 - (elapsed / dwellTime) * 100;
        if (percentage <= 0) {
          clearInterval(timer);
          onActivate(tile.action);
          const letter = tile.label;
          if (otherLetters) {
            if (onLetterSelected) {
              onLetterSelected(otherLetters, letter);
            }
          }
          // setHovering(false);
          setProgress(100);
        } else {
          setProgress(percentage);
        }
      }, 50);
    } else {
      setProgress(100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hovering, onActivate, tile]);

  return (
    <div 
      className="tile"
      style={tile.customStyle || {}}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      // onClick={() => onActivate(tile.action)}
    >
      {tile.icon ? (
        // Show icon for layouts page
        <div className="tile-icon">
          <img 
            src={tile.icon} 
            alt={tile.label || "icon"}  />
        </div>
        
      ) : (
        /* Main letter */
        <div className="label">
          {t(tile.label)}
        </div>
      )}
      

      {/* Surrounding letters */}
      {hovering && tile.neighbours && Object.entries(tile.neighbours).map(([direction, letter]) => (
        <span
          key={direction}
          className="surrounding-letter"
          style={positions[direction]}
        >
          {letter}
        </span>
      ))}

      {/* Progress bar */}
      {tile.type !== "empty" && hovering && (
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}}></div>
        </div>
      )}
    </div>
  );
};

export default Tile;