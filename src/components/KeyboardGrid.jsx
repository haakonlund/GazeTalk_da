import React from "react";
import TextAreaTile from "./TextAreaTile";
import Tile from "./Tile";

const KeyboardGrid = ({ 
        layout, 
        textValue,
        setTextValue, 
        onTileActivate, 
        suggestions, 
        letterSuggestions = ["e","t","a","space","o","i","r"], 
        handleTextAreaChange, 
        dwellTime, 
        buttonFontSize, 
        textFontSize, 
        nextLetters = [],
        getNext }) => {
  return (
        <div className="keyboard-grid">
        <TextAreaTile 
          value={textValue} 
          onChange={handleTextAreaChange || setTextValue} 
          colspan={2}  
          customStyle={{
            fontSize : `${textFontSize}px`
          }}

        />
  
        {layout.tiles.map((tile, i) => {
          if (tile.type === "textarea") return null;

          if (tile.action && tile.action.type === "show_suggestions") {
            let suggestionsLabel = "";
            for (let i = 0; i < 4; i++) {
              if (suggestions[i]) {
                suggestionsLabel += suggestions[i] + "\n";
              } 
            }
            const suggestionsPreview = suggestionsLabel.trim();
            return (
              <Tile 
                key={i} 
                tile={{ 
                  ...tile, 
                  label: suggestionsPreview || "", 
                  action: { type: "show_suggestions" }, 
                  customStyle: { whiteSpace: "pre-line", color: "#00ff00" }
                }} 
                onActivate={onTileActivate}
                dwellTime={dwellTime*2}
              />
            );
          }

          if (tile.action && tile.action.type === "show_letter_suggestions") {
          
          
          }

          return <Tile 
            key={i} 
            tile={{
              ...tile, 
              customStyle: { 
                color: 
                  tile.label ==  "back" ? "#0f0" : 
                  tile.type == "switch" ? "#ff0" :
                                          "#fff"
          }}}
            onActivate={onTileActivate} 
            dwellTime={dwellTime} />;
        })}
  
        {layout.name === "suggestions" && suggestions.map((suggestion, i) => (
          <Tile 
            key={i} 
            tile={
              { 
                label: suggestion, 
                action: { type: "insert_suggestion", value: suggestion },
              }
                
              } 
            onActivate={onTileActivate} 
            dwellTime={dwellTime} 
          />
        ))}
        {layout.name === "writing" && letterSuggestions.map((suggestion, i) => (
          <Tile 
            key={i} 
            tile={
              { 
                label: suggestion, 
                action: { type: "insert_letter_suggestion", value: suggestion },
                surroundingLetters : nextLetters[i]
              }
                
              } 
            onActivate={onTileActivate} 
            dwellTime={dwellTime} 
          />
        ))}

      </div>
    );
  };
  
  export default KeyboardGrid;
