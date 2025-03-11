import React from "react";
import TextAreaTile from "./TextAreaTile";
import Tile from "./Tile";
import { getNeighbours } from "../util/tileUtils";
const KeyboardGrid = ({ 
        view, 
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
        textAreaColSpan = 2, 
        rows = 3, 
        cols = 4,
        handleLetterSelected }) => {
          const tiles = view.tiles.filter(tile => tile.type !== "textarea");
          const remainingTiles = cols * rows - textAreaColSpan - tiles.length;
          return (
            <div className="keyboard-grid"
              style={{
                display: "grid",
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                width: "100%",
                height: "100%"
              }}
            >
              <TextAreaTile 
                value={textValue} 
                onChange={handleTextAreaChange || setTextValue} 
                colspan={textAreaColSpan}  
                customStyle={{
                  fontSize : `${textFontSize}px`
                }}
              />
      
            {tiles.map((tile, i) => {
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
                      dwellTime={dwellTime*1.5}
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

            {view.name === "suggestions" && suggestions.map((suggestion, i) => {
              if (i < remainingTiles) {
                return(
                  <Tile 
                    key={i} 
                    tile={
                      { 
                        label: suggestion,
                        is_dynamic: true,
                        action: { type: "insert_suggestion", value: suggestion },
                      }
                        
                      } 
                    onActivate={onTileActivate} 
                    dwellTime={dwellTime} 
                  />
                );
              }
            })}
            {view.name === "writing" && letterSuggestions.map((suggestion, i) => {
              const writingTiles = [];
              if (i == ((rows - 1) * cols) - textAreaColSpan - tiles.length) {
                writingTiles.push(
                  <Tile 
                    key={"space"} 
                    tile={
                      { 
                        label: "space", 
                        is_dynamic: true,
                        action: { type: "letter", value: " " }
                      }
                    } 
                    onActivate={onTileActivate} 
                    dwellTime={dwellTime} 
                  />
                );
              }
              if (i < remainingTiles - 1) {
                writingTiles.push(
                  <Tile 
                    key={i} 
                    tile={
                      { 
                        label: suggestion, 
                        is_dynamic: true,
                        action: { type: "insert_letter_suggestion", value: suggestion },
                        neighbours: getNeighbours(i, cols, rows, nextLetters[i], textAreaColSpan + tiles.length, suggestion),
                        surroundingLetters : nextLetters[i]
                      }
                    } 
                    onActivate={onTileActivate} 
                    dwellTime={dwellTime} 
                    otherLetters={letterSuggestions}
                    onLetterSelected={handleLetterSelected}
                  />  
                );
              }
              return writingTiles;
            })}
          </div>
        );
      };
  
  export default KeyboardGrid;
