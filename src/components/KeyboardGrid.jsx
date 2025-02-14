import React from "react";
import TextAreaTile from "./TextAreaTile";
import Tile from "./Tile";

const KeyboardGrid = ({ layout, textValue, setTextValue, onTileActivate, suggestions, dwellTime }) => {
    return (
        <div className="keyboard-grid">
        <TextAreaTile value={textValue} onChange={setTextValue} colspan={2} />
  
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
                  customStyle: { fontSize: "24px", whiteSpace: "pre-line" }
                }} 
                onActivate={onTileActivate}
                dwellTime={dwellTime * 2} 
              />
            );
          }

          return <Tile key={i} tile={tile} onActivate={onTileActivate} dwellTime={dwellTime} />;
        })}
  
        {layout.name === "suggestions" && suggestions.map((suggestion, i) => (
          <Tile key={i} tile={{ label: suggestion, action: { type: "insert_suggestion", value: suggestion }}} onActivate={onTileActivate} dwellTime={dwellTime} />
        ))}
      </div>
    );
  };
  
  export default KeyboardGrid;
