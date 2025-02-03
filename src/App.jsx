import React, {  useState } from 'react';
import { config } from './config';
import settings from './settings.json';

import './App.css';

var dwellTime = 500; // 0.5 seconds
var language = "english";

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");

  const [isCapsOn, setIsCapsOn] = useState(false);
  const layout = config.layouts[currentLayoutName];
  
  const handleAction = (action) => {
    const input = document.getElementById('text_region');
    
    if (action.type === "enter_letter") {
      setTextValue(prev => isCapsOn ?  prev + action.value.toUpperCase() : prev + action.value.toLowerCase());

      // always go back to writing layout after entering a letter
      setCurrentLayoutName("writing");
      
    } else if (action.type === "newline") {
      setTextValue(prev => prev + "\n");
      input.focus();

    } else if (action.type === "switch_layout") {
      if (config.layouts[action.layout]) {
        setCurrentLayoutName(action.layout);
      }

    } else if (action.type === "delete_letter") {
      setTextValue(prev => prev.slice(0, -1));
      setCurrentLayoutName("writing");

    } else if (action.type === "toggle_case") {
      setIsCapsOn(prev => !prev);
      console.log("Caps on:", isCapsOn);

    } else if (action.type === "cursor" ) {
      const cursorPosition = input.selectionStart;
      input.focus();
      if (action.direction === "left") {
        if (cursorPosition === 0) return;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      } else if (action.direction === "right") {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      } else if (action.direction === "up") {
        // get current linelength where there is mutlipe lines
        const currentLines = textValue.split("\n");
        input.selectionStart = input.selectionStart * 2;

        console.log("Current line length:",  input.selectionStart);



      } else if (action.direction === "down") {
        
       
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
          autofocus={true}
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
      <textarea value={value} onChange={(e) => onChange(e.target.value)} id='text_region' readOnly />
      
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