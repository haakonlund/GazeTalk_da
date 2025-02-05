import React, {  useState } from 'react';
import { config } from './config';
import settings from './settings.json';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import './App.css';

var dwellTime = 500; // 0.5 seconds

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");

  const [isCapsOn, setIsCapsOn] = useState(false);
  const [cursorDistance, setCursorDistance] = useState(0); // how many times the user has selected right (used for up and down movement)
  const layout = config.layouts[currentLayoutName];
  
  const input = document.getElementById('text_region');

  const handleAction = (action) => {
    // const input = document.getElementById('text_region');
    
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
        setCursorDistance(calcCursorDistance(cursorDistance));
      

      } else if (action.direction === "right") {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        setCursorDistance(calcCursorDistance(cursorDistance));

      } else if (action.direction === "up") {
        // get current linelength where there is mutlipe lines
        const currentLines = textValue.split("\n");
        // Get the current line the cursor is on
        let line = getCurrentLine(currentLines, cursorPosition);
        if (line === 0) {
          return;
        }
        let previousLine = currentLines[line - 1];
        let previousDistance = getCharDistance(currentLines, line -1);
        let currentLineLength = currentLines[line].length;
        if (calcCursorDistance() === currentLineLength) {
          const previousLineLength = previousLine.length;
          input.setSelectionRange(previousDistance + previousLineLength, previousDistance + previousLineLength);
        } else {
          input.setSelectionRange(previousDistance + calcCursorDistance(), previousDistance+ calcCursorDistance());
          
        }
      
      } else if (action.direction === "down") {
        input.focus();
        const currentLines = textValue.split("\n");
        let line = getCurrentLine(currentLines, cursorPosition);
        if (line === currentLines.length - 1) {
          return;
        }
        let nextLine = currentLines[line + 1];
        let nextDistance = getCharDistance(currentLines, line + 1);
        let currentLineLength = currentLines[line].length;
        if (calcCursorDistance() === currentLineLength) {
          const nextLineLength = nextLine.length;
          input.setSelectionRange(nextDistance + nextLineLength, nextDistance + nextLineLength);
        } else {
          input.setSelectionRange(nextDistance + calcCursorDistance(), nextDistance + calcCursorDistance());
        }
      }
    } else if (action.type === "delete_word") { 
      const cursorPosition = input.selectionStart;
      // get the current line
      const currentLines = textValue.split("\n");
      let line = getCurrentLine(currentLines, cursorPosition);
      let currentLine = currentLines[line];
      // get the space or newline to the left of the cursor
      let leftSpace = currentLine.lastIndexOf(" ", calcCursorDistance());
      // get the space or newline to the right of the cursor
      let rightSpace = currentLine.indexOf(" ", calcCursorDistance());
      // get the word to be deleted
      if (leftSpace === -1) {
        leftSpace = 0;
      }
      if (rightSpace === -1) {
        rightSpace = currentLine.length;
      }

      let word = currentLine.slice(leftSpace, rightSpace);
      // get next word to move the cursor to
      let nextWord = currentLine.slice(rightSpace, currentLine.length);
      // move the cursor to the next word
      const nextDistance = getCharDistance(currentLines, line);
      // delete the word
      setTextValue(prev => prev.replace(word, ""));
      input.setSelectionRange(0, 0);


    } else if (action.type === "delete_sentence") { 

    } else if (action.type === "delete_paragraph") { 

    
    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      // language = action.value;
      changeLanguage(action.value);
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
    }
  };
  const calcCursorDistance = () => {
    const currentLines = textValue.split("\n");
    let line = getCurrentLine(currentLines, input.selectionStart);
    const cursorPosition = input.selectionStart -  getCharDistance(currentLines, line);
    return cursorPosition
  }
  
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
// const Fixed = (value, onChange) => {
//   const [val, setVal] = useState(value);
//   const updateVal = (val) => {
//     /* Make update synchronous, to avoid caret jumping when the value doesn't change asynchronously */
//     setVal(val);
//     /* Make the real update afterwards */
//     onChange(val);
//   };
//   return <input value={val} onChange={(e) => updateVal(e.target.value)} />;
// };


function getCurrentLine(currentLines, cursorPosition) {
  let line = 0;
  for (let i = 0; i < cursorPosition; i++) {
    let currentLine = currentLines[line];
    for (let j = 0; j < currentLine.length; j++) {
      if (i >= cursorPosition) {
        break;
      }
      i++;
    }
    if ((i >= cursorPosition)) {
      break;
    } else {
      line++;
    }
  }
  return line;
}
// Gets the distance of the character from the start of the text to the current line
function getCharDistance(currentLines, line) {
  let previousDistance = 0;
  for (let i = 0; i < line; i++) {
    previousDistance += currentLines[i].length; 
  }
  return previousDistance + line;
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
      <textarea value={value} onChange={(e) => onChange(e.target.value)} id='text_region' />
      
    </div>
  );
}

function Tile({ tile, onActivate }) {
  const {t} = useTranslation();

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
        {t(tile.label)}
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