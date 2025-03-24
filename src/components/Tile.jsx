import React, { useState, useEffect, useRef  } from "react";
import { useTranslation } from "react-i18next";
import * as GazeConstants from "../constants/testConstants/gazeConstants";

const Tile = ({ tile, onActivate, dwellTime, otherLetters, onLetterSelected, logEvent, counterStarted }) => {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(100);
  const activationTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const gazeThreshold = GazeConstants.GAZE_MILLISECONDS; 
  const startedHover = useRef(false);
  const finishedHover = useRef(false);
  const gazedMoreThanThreshold = useRef(false);
  // Calculate positions for surrounding letters
  const positions = {
    "top-left": { top: '0%',    left: '10%' },  // Top-left
    "top-center": { top: '0%',    left: '50%' },  // Top-center
    "top-right":{ top: '0%',    right: '10%' }, // Top-right
    "center-left": { top: '35%',    left: '10%'},   // Center-left
    "center-right":{ top: '35%',    right: "10%"},  // Center-right
    "bottom-left":{ bottom: '0%', left: '10%' },  
    "bottom-center":{ bottom: '0%', left: '50%' },  // Bottom-center
    "bottom-right":{ bottom: '0%', right: '10%' }  // Bottom-right
  };

  useEffect(() => {
    let timer;
    if (hovering) {
      startedHover.current = true;
      finishedHover.current = false;
      gazedMoreThanThreshold.current = false;
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = 100 - (elapsed / dwellTime) * 100;
        if (elapsed > gazeThreshold) {
          gazedMoreThanThreshold.current = true;
        }
        if (percentage <= 0) {
          finishedHover.current = true;
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
      if (startedHover.current && !finishedHover.current && gazedMoreThanThreshold.current && counterStarted) {
        logEvent({ type: GazeConstants.TILE_GAZED_NOT_SELECTED, label: tile.label });
      }
      if (timer) {clearInterval(timer);}
      setProgress(100);
      startedHover.current = false;
      finishedHover.current = false;
      gazedMoreThanThreshold.current = false;
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hovering, onActivate, counterStarted, tile, logEvent]);

  return (
    <div 
      className="tile"
      role="button"
      aria-label={tile.label || "tile"}
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
            alt={tile.label}  />
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
          <div 
            className="progress" 
            style={{
              transform: `scale(${progress / 100})`,
              transformOrigin: "center",
              transition: "transform 50ms linear"
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tile;