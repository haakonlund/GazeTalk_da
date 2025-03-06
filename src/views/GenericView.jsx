import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const GenericView = ({ view, textValue, setTextValue, handleAction, suggestions, letterSuggestions, dwellTime,buttonFontSize,textFontSize, nextLetters,getNext }) => {
  return (
    <div className="generic-view">
      <KeyboardGrid 
        view={view} 
        textValue={textValue} 
        setTextValue={setTextValue} 
        onTileActivate={handleAction} 
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={nextLetters}
        dwellTime={dwellTime}
      />
    </div>
  );
};

export default GenericView;
