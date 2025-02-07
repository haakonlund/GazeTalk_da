import React, {  useState, useRef } from 'react';
import axios from 'axios';
import { config } from './config';
import settings from './settings.json';
import './App.css';

var dwellTime = 500; // 0.5 seconds
var language = "english";

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  // const [cursorDistance, setCursorDistance] = useState(0); // how many times the user has selected right (used for up and down movement)
  const [suggestions, setSuggestions] = useState([]); 
  const textAreaRef = useRef(null);

  const layout = config.layouts[currentLayoutName];
  
  const input = document.getElementById('text_region');

  React.useEffect(() => {
    if (textValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    const prompt = textValue;

    const fetchSuggestions = async () => {
      try {
        const uri = 'https://cloudapidemo.azurewebsites.net/continuations';
        const response = await axios.post(uri, {
          locale: "en_US",
          prompt: prompt
        });
        const preds = response.data.continuations || [];
        setSuggestions(preds);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [textValue]);

  const handleTextAreaChange = (e) => {
    setTextValue(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const matchCase = (suggestion, existingWord = "") => {
    if (!existingWord) return suggestion;
    if (existingWord[0] === existingWord[0].toUpperCase()) {
      return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    } else {
      return suggestion.toLowerCase();
    }
  };

  const handleAction = (action) => {
    // const input = document.getElementById('text_region');
    
    if (action.type === "enter_letter") {
      setTextValue(prev => isCapsOn ?  prev + action.value.toUpperCase() : prev + action.value.toLowerCase());
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

    
    } else if (action.type === "insert_suggestion") {
      const suggestion = action.value;
      setTextValue(prev => {
        const cursorPos = input.selectionStart;
        const textUpToCursor = prev.slice(0, cursorPos);
        const rest = prev.slice(cursorPos);
        const lastSpaceIndex = textUpToCursor.lastIndexOf(" ");
        const lastWord = 
          lastSpaceIndex >= 0 
            ? textUpToCursor.slice(lastSpaceIndex + 1) 
            : textUpToCursor; 
        const replaced = textUpToCursor.slice(0, textUpToCursor.length - lastWord.length);

        const casedSuggestion = matchCase(suggestion, lastWord);

        const newText = replaced + casedSuggestion + " " + rest;
        return newText;
      });
      setTimeout(() => {
        const newPos = input.value.length;
        input.focus();
        input.setSelectionRange(newPos, newPos);
        setCursorPosition(newPos);
      }, 0);

    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      language = action.value;
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
    } else if (action.type === "play_alarm") {
      console.log("Playing alarm");
      setAlarmActive(true);
    } else if (action.type === 'close_alarm') {
      setAlarmActive(false);
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
        suggestions={suggestions} 
        handleTextAreaChange={handleTextAreaChange}
        textAreaRef={textAreaRef}
      />
      {alarmActive && (
        <AlarmPopup onClose={() => setAlarmActive(false)} />
      )}
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


function KeyboardGrid({ layout, textValue, setTextValue, onTileActivate, suggestions, handleTextAreaChange, textAreaRef }) {
  // The layout tiles are defined in rows implicitly: 12 tiles, 4 columns each row
  // The first tile of type "textarea" will be special. If colspan=2, it occupies two grid cells.
  
  // We must place 12 cells in a 4x3 grid.
  // layout.tiles could be more or fewer; we trust config is correct.
  // We'll map them into positions. The first 'textarea' consumes 2 cells, 
  // so total must remain 12. If a tile has colspan=2, we skip the next cell.

  const [firstTile, secondTile, thirdTile] = layout.tiles;

  let suggestionTiles = [];
  var tiles = [];
  if (suggestions.length > 0) {
    suggestionTiles = suggestions.slice(0, 8).map((sugg, idx) => {
      return {
        type: 'suggestion',
        label: sugg, 
        action: { type: 'insert_suggestion', value: sugg }
      };
    });
    tiles = [firstTile, secondTile, thirdTile, ...suggestionTiles];
  } else {
    tiles = layout.tiles;
  }
  return (
    <div className="keyboard-grid">
      <div className="tile textarea-tile" style={{ gridColumn: 'span 2' }}>
        <textarea
          id="text_region"
          ref={textAreaRef}
          value={textValue}
          onChange={handleTextAreaChange}
          placeholder="Type text here..."
        />
      </div>

      {tiles.map((tile, i) => {
        if (tile.type === 'textarea') {
          return null;
        }
        return (
          <Tile key={i} tile={tile} onActivate={onTileActivate} />
        );
      })}
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

function AlarmPopup({ onClose }) {
  return (
    <div className="alarm-overlay">
      <audio src="/alarm.mp3" autoPlay loop />

      <div className="alarm-popup-content">
        <h2>Alarm playing</h2>
        <p>Do you want to stop it?</p>
        <Tile
          tile={{ label: 'Yes', action: { type: 'close_alarm' } }}
          onActivate={() => onClose()}
        />
      </div>
    </div>
  );
}

export default App;