import React from "react";

const PausePopup = ({isPaused}) => {
    if (isPaused) {
        return (
            <div className="pause-overlay">
                <div className="pause-popup-content">
                    <h2>Paused</h2>
                </div>
            </div>
        );
    } else {
        return null;
    }
  }

export default PausePopup;
