import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";
import Layout2_2_4x2 from "./Layout2_2_4x2";
import Layout3_3x3 from "./Layout3_3x3";
import Layout2_3_5x2 from "./Layout2_3_5x2";
import Layout2_3_5x3 from "./Layout2_3_5x3";
import Layout3_3x4 from "./Layout3_3x4";
import Layout4_4x4 from "./Layout4_4x4";

const LayoutPicker = ({ layout, view, textValue, setTextValue, handleAction, suggestions, letterSuggestions, dwellTime,buttonFontSize,textFontSize, nextLetters, getNext, handleLetterSelected }) => {
    if (layout === "3+3x3") {
        return (
          <div className="generic-view">
            <Layout3_3x3 
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
            handleLetterSelected={handleLetterSelected}
          />
          </div>
        );
      } else if (layout === "2+2+4x2") {
        return (
          <div className="generic-view">
            <Layout2_2_4x2 
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
              handleLetterSelected={handleLetterSelected}
            />
          </div>
        );
      } else if (layout === "2+3+5x2") {
        return (
          <div className="generic-view">
            <Layout2_3_5x2 
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
              handleLetterSelected={handleLetterSelected}
            />
          </div> 
        );
      } else if (layout === "2+3+5x3") {
        return (
          <div className="generic-view">
            <Layout2_3_5x3 
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
              handleLetterSelected={handleLetterSelected}
            />
          </div>
        );
      } else if (layout === "3+3x4") {
        return (
          <div className="generic-view">
            <Layout3_3x4 
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
              handleLetterSelected={handleLetterSelected}
            />
          </div>
        );
      } else if (layout === "4+4x4") {
        return (
          <div className="generic-view">
            <Layout4_4x4 
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
              handleLetterSelected={handleLetterSelected}
            />
          </div>
        );
      } else {
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
                handleLetterSelected={handleLetterSelected}
            />
            </div>
        );
    }
};

export default LayoutPicker;
