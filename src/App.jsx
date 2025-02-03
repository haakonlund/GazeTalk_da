import React, { useState } from 'react';
import { config } from './config';
import settings from './settings.json';

import './App.css';

var dwellTime = 500; // 0.5 seconds
var language = "english";

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");

  const layout = config.layouts[currentLayoutName];
  
  const handleAction = (action) => {
    if (action.type === "enter_letter") {
      setTextValue(prev => prev + action.value);
    } else if (action.type === "switch_layout") {
      if (config.layouts[action.layout]) {
        setCurrentLayoutName(action.layout);
      }
    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      language = action.value;
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
    }
  };

  return (
    <div className="App">
      <KeyboardGrid 
        layout={layout} 
        textValue={textValue} 
        setTextValue={setTextValue}
        onTileActivate={handleAction}
      />
    </div>
  );
}

function KeyboardGrid({ layout, textValue, setTextValue, onTileActivate }) {
  // The layout tiles are defined in rows implicitly: 12 tiles, 4 columns each row
  // The first tile of type "textarea" will be special. If colspan=2, it occupies two grid cells.
  
  // We must place 12 cells in a 4x3 grid.
  // layout.tiles could be more or fewer; we trust config is correct.
  // We'll map them into positions. The first 'textarea' consumes 2 cells, 
  // so total must remain 12. If a tile has colspan=2, we skip the next cell.


  const tiles = layout.tiles;
  
  // Prepare a 3x4 grid indexing:
  let cells = new Array(3).fill(null).map(() => new Array(4).fill(null));

  // We'll fill cells row by row
  let currentRow = 0, currentCol = 0;
  
  const placedTiles = [];
  
  for (let i = 0; i < tiles.length && currentRow < 3; i++) {
    let tile = tiles[i];
    // Place the tile
    if (tile.type === 'textarea') {
      // Assume it always appears at the start of a row and colspan=2 is guaranteed.
      // If not at start of a row, you'd need more logic.
      placedTiles.push(
        <TextAreaTile 
          key={i} 
          value={textValue} 
          onChange={setTextValue}
          colspan={tile.colspan || 1}
        />
      );
      currentCol += tile.colspan || 1;
      if (currentCol >= 4) {
        currentRow++;
        currentCol = 0;
      }
    } else {
      placedTiles.push(
        <Tile 
          key={i} 
          tile={tile} 
          onActivate={onTileActivate}
        />
      );
      currentCol++;
      if (currentCol >= 4) {
        currentRow++;
        currentCol = 0;
      }
    }
  }

  return (
    <div className="keyboard-grid">
      {placedTiles}
    </div>
  );
}

function TextAreaTile({ value, onChange, colspan=2 }) {
  return (
    <div className="tile textarea-tile" style={{gridColumn: `span ${colspan}`}}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} readOnly />
    </div>
  );
}

function Tile({ tile, onActivate }) {
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(100);
  
  React.useEffect(() => {
    let timer;
    if (hovering) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = 100 - (elapsed / dwellTime) * 100;
        if (percentage <= 0) {
          clearInterval(timer);
          // Activate the tile
          onActivate(tile.action);
          setHovering(false);
          setProgress(100);
        } else {
          setProgress(percentage);
        }
      }, 50);
    } else {
      // Reset progress if not hovering
      setProgress(100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hovering, onActivate, tile]);

  return (
    <div 
      className="tile"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onActivate(tile.action)}
    >
      <div className="label">
        {tile.label}
      </div>
      {hovering && (
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}}></div>
        </div>
      )}
    </div>
  );
}

export default App;