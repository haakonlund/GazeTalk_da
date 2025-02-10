import React, {  useState } from 'react';
import { config } from './config';
import settings from './settings.json';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import './App.css';
import globalCursorPosition from './cursorSingleton';
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
      // setTextValue(prev => isCapsOn ?  prev + action.value.toUpperCase() : prev + action.value.toLowerCase());
      
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
      setTextValue(newText);
      
      updateGlobalCursorPosition(input.selectionStart + 1);
      // always go back to writing layout after entering a letter
      setCurrentLayoutName("writing");
      
    } else if (action.type === "newline") {
      // insert a newline at the global cursor position
      const newText = textValue.slice(0, globalCursorPosition.value) + "\n" + textValue.slice(globalCursorPosition.value, textValue.length);
      setTextValue(newText);
      // move the cursor to the next line after inserting a newline
      updateGlobalCursorPosition(globalCursorPosition.value + 1);
    } else if (action.type === "switch_layout") {
      if (config.layouts[action.layout]) {
        setCurrentLayoutName(action.layout);
      }

    } else if (action.type === "delete_letter") {
      // setTextValue(prev => prev.slice(0, -1));
      // delete the letter at the global cursor position
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);


      setCurrentLayoutName("writing");
    } else if (action.type === "delete_letter_edit") {
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);

    
    } else if (action.type === "toggle_case") {
      setIsCapsOn(prev => !prev);
      console.log("Caps on:", isCapsOn);

    } else if (action.type === "cursor" ) {
      const cursorPosition = input.selectionStart;
      
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
        console.log("Current lines", currentLines);
        if (calcCursorDistance() === currentLineLength) {
          const nextLineLength = nextLine.length;
          input.setSelectionRange(nextDistance + nextLineLength, nextDistance + nextLineLength);
        } else {
          input.setSelectionRange(nextDistance + calcCursorDistance(), nextDistance + calcCursorDistance());
        }
      }
    updateGlobalCursorPosition(input.selectionStart);
    
    console.log("Cursor position:", globalCursorPosition.value);
    
  
    } else if (action.type === "delete_word") { 
      deleteWordAtCursor();

    } else if (action.type === "delete_sentence") { 
      deleteSentence();
    } else if (action.type === "delete_section") { 
      deleteSection()
    } else if (action.type === "undo") {
      // todo
    } else if (action.type === "start_of_text") {
      //
    } else if (action.type === "previous_section") {

    } else if (action.type === "previous_sentence") {

    } else if (action.type === "previous_word") {

    } else if (action.type === "end_of_text") {

    } else if (action.type === "next_section") {

    } else if (action.type === "next_sentence") {

    } else if (action.type === "next_word") {




    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      // language = action.value;
      changeLanguage(action.value);
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
    }

    function deleteWordAtCursor() {
      const cursorPosition = input.selectionStart;
      // get the current line
      const currentLines = textValue.split("\n");
      let line = getCurrentLine(currentLines, cursorPosition);
      let currentLine = currentLines[line];


      // get word boudaries
      // const localCursorPosition = calcCursorDistance();
      const textStr = textValue
      const coords = getWordBoundaries(textStr, cursorPosition);
      if (!coords) {
        throw new Error("No word boundaries found");
      }

      const x0 = coords.x0;
      const x1 = coords.x1;
      // delete the word
      const oldText = textValue
      const newText = textValue.slice(0, x0) + textValue.slice(x1, textValue.length);
      setTextValue(newText);

      const oldCursorPos = cursorPosition
      const previousLength = textValue.slice(0, x1).length;
      const distanceToEndofWord = previousLength - globalCursorPosition.value;
      console.log("Distance to end of word:", distanceToEndofWord);
      updateGlobalCursorPosition(cursorPosition - (x1 - x0) + distanceToEndofWord);
      undoStack.push({old_text : oldText, old_cursor_pos : oldCursorPos})
      console.log(undoStack)
    }

    function deleteSentence() {
      const cursorPosition = input.selectionStart;

      let start = cursorPosition
      let end = start
      let temp = textValue[start - 1]
      while (start > 0 && !(textValue[start - 1] === ".")) {
        start--;
      }
      while (end < textValue.length && !(textValue[end] === ".")) {
        end++;
      }
      if (end < textValue.length && textValue[end] === ".") {
        end++
      }

      setTextValue(textValue.slice(0,start) + textValue.slice(end, textValue.length))
      
      const previousLength = textValue.slice(0, end).length;
      const distanceToEndofWord = previousLength - globalCursorPosition.value;
      updateGlobalCursorPosition(cursorPosition - (end - start) + distanceToEndofWord);
    }
    function deleteSection() {
      const cursorPosition = input.selectionStart;

      let start = cursorPosition
      let end = start
      let temp = textValue[start - 1]
      while (start > 0 && !(textValue[start - 1] === "\n")) {
        start--;
      }
      while (end < textValue.length && !(textValue[end] === "\n")) {
        end++;
      }
      if (end < textValue.length && textValue[end] === "\n") {
        end++
      }

      setTextValue(textValue.slice(0,start) + textValue.slice(end, textValue.length))
      
      const previousLength = textValue.slice(0, end).length;
      const distanceToEndofWord = previousLength - globalCursorPosition.value;
      updateGlobalCursorPosition(cursorPosition - (end - start) + distanceToEndofWord);
    }

  };
  const calcCursorDistance = () => {
    const currentLines = textValue.split("\n");
    let line = getCurrentLine(currentLines, input.selectionStart);
    const cursorPosition = input.selectionStart -  getCharDistance(currentLines, line);
    return cursorPosition
  }
  function updateGlobalCursorPosition(xCursorPosition) {
    globalCursorPosition.value = xCursorPosition;
    // console.log("Cursor position:", cursorPosition);
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
/*
a ab abc
abcd abcde abcdef

*/
function getWordBoundaries(text, cursorPosition) {
  if (!text || cursorPosition < 0 || cursorPosition >= text.length) {
    return null;
  }

  // if (text[cursorPosition] === "") {
  //   return null;
  // }
  let start = cursorPosition;
  let end = cursorPosition;

  // handle the case where the cursor is at the end of the word + a space
  // if (text[start-1] === " " && text[start] !== " ") {
  //   start--;
  //   end--;
  // }
  // get the left boundary
  while (start > 0 && !/\s/.test(text[start - 1])) {
    start--;
  }
  // asdf asdf  df
  // debugger
  // let tm2 = text[start- 1]
  // if (start > 0 && text[start- 1] === " ") {
  //   start--;
  // }

  // get the right boundary
  while (end < text.length && !/\s/.test(text[end])) {
    end++;
  }
  // console.log("text[end](", text[end]+")")
  // console.log("text[end+1]", ""text[end+1])
  // debugger
  // let tmp3 = text[end]
  // let tmp4 = text[end+1]
  // if ( end < text.length && text[end] === " ") {
  //   end++;
  // }
  return { x0: start, x1: end };
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
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    onChange(newValue);
  };

  React.useEffect(() => {
    // Add your custom logic here
    // console.log("Text value changed:", value);

    // log current cursor position
    const input = document.getElementById('text_region');
    // console.log("Cursor position:", input.selectionStart);
    // the cursor pos to 5
    // const app = document.getElementById("App")
    // app.cursorDistance
    console.log("Cursor distance:", globalCursorPosition.value);
    input.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
  }, [value]);

  return (
    <div className="tile textarea-tile" style={{gridColumn: `span ${colspan}`}}>
      <textarea value={value} onChange={handleChange} id='text_region' />
    </div>
  );
}
// taken from this example https://jsfiddle.net/g9YxB/10/ and i don't think its used
function focusMe() {
  var focusBox
  focusBox = document.getElementById("text_region");
  {
    setTimeout(function() {
      focusBox.focus();
    } , 1);

  }
// however this is used to focus the textarea and it works
}
setInterval(function() {
  var focusBox 
  focusBox = document.getElementById("text_region");
  focusBox.focus();
});






function Tile({ tile, onActivate }) {
  const {t} = useTranslation();
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(100);

  // Calculate positions for surrounding letters
  const positions = [
    { top: '10%',    left: '10%' },    // Top-left
    { top: '10%',    left: '50%' },     // Top-center
    { top: '10%',    right: '10%' },   // Top-right
    { bottom: '10%', left: '10%' }, // Bottom-left
    { bottom: '10%', left: '50%' },  // Bottom-center
    { bottom: '10%', right: '10%' } // Bottom-right
  ];

  React.useEffect(() => {
    let timer;
    if (hovering) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = 100 - (elapsed / dwellTime) * 100;
        if (percentage <= 0) {
          clearInterval(timer);
          onActivate(tile.action);
          setHovering(false);
          setProgress(100);
        } else {
          setProgress(percentage);
        }
      }, 50);
    } else {
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
      {/* Main letter */}
      <div className="label">
        {t(tile.label)}
      </div>

      {/* Surrounding letters */}
      {hovering && tile.surroundingLetters && tile.surroundingLetters.map((letter, index) => (
        <span
          key={index}
          className="surrounding-letter"
          style={positions[index]}
        >
          {letter}
        </span>
      ))}

      {/* Progress bar */}
      {hovering && (
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}}></div>
        </div>
      )}
    </div>
  );
}

export default App;