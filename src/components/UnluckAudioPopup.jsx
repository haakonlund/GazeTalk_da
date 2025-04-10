import React from "react";

const UnlockAudioPopup = ({ onUnlock }) => {
  return (
    <div className="audio-unlock-overlay">
      <div className="audio-unlock-popup-content">
        <h2>Enable Audio</h2>
        <p>To hear sound effects, please enable audio.</p>
        <button onClick={onUnlock}>Turn On Audio</button>
      </div>
    </div>
  );
};

export default UnlockAudioPopup;