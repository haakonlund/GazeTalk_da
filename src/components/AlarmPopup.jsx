import React from "react";
import Tile from "./Tile";

const AlarmPopup = ({ onClose }) => {
    return (
      <div className="alarm-overlay">
        <audio src="/alarm.mp3" autoPlay loop />
  
        <div className="alarm-popup-content">
          <h2>Alarm playing</h2>
          <p>Do you want to stop it?</p>
          <Tile
            tile={{ label: 'Yes', action: { type: 'close_alarm' } }}
            onActivate={() => onClose()}
          />
        </div>
      </div>
    );
  }

export default AlarmPopup;
