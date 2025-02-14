import React from "react";
import TextAreaTile from "./TextAreaTile";
import Tile from "./Tile";

const KeyboardGrid = ({ layout, textValue, setTextValue, onTileActivate, suggestions, handleTextAreaChange }) => {
    return (
        <div className="keyboard-grid">
        <TextAreaTile 
          value={textValue} 
          onChange={handleTextAreaChange || setTextValue} 
          colspan={2}  
        />
  
        {layout.tiles.map((tile, i) => {
          if (tile.type === "textarea") return null;

          if (tile.action && tile.action.type === "show_suggestions") {
            const suggestionsPreview = suggestions.join("\n"); 
            return (
              <Tile 
                key={i} 
                tile={{ 
                  ...tile, 
                  label: suggestionsPreview || "", 
                  action: { type: "show_suggestions" }, 
                  customStyle: { fontSize: "14px", whiteSpace: "pre-line" }
                }} 
                onActivate={onTileActivate} 
              />
            );
          }

          return <Tile key={i} tile={tile} onActivate={onTileActivate} />;
        })}
  
        {layout.name === "suggestions" && suggestions.map((suggestion, i) => (
          <Tile key={i} tile={{ label: suggestion, action: { type: "insert_suggestion", value: suggestion }}} onActivate={onTileActivate} />
        ))}
      </div>
    );
  };
  
  export default KeyboardGrid;
