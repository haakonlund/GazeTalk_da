import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const GenericView = ({ layout, textValue, setTextValue, handleAction, suggestions, dwellTime,buttonFontSize,textFontSize }) => {
  return (
    <div className="generic-view">
      <KeyboardGrid 
        layout={layout} 
        textValue={textValue} 
        setTextValue={setTextValue} 
        onTileActivate={handleAction} 
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        dwellTime={dwellTime}
      />
    </div>
  );
};

export default GenericView;
