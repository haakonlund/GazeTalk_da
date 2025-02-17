import React, { useEffect, useRef } from "react";
import Tile from "./Tile";

const AlarmPopup = ({ onClose, dwellTime}) => {
    const audioRef = useRef(null);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, []);
    return (
      <div className="alarm-overlay">
        <audio ref={audioRef} src="/alarm.mp3" autoPlay loop />
  
        <div className="alarm-popup-content">
          <h2>Alarm playing</h2>
          <p>Do you want to stop it?</p>
          <Tile
            tile={{ label: 'Yes', action: { type: 'close_alarm' } }}
            onActivate={() => onClose()}
            dwellTime={dwellTime}
          />
        </div>
      </div>
    );
  }

export default AlarmPopup;
