import React, {  useState, useRef } from 'react';
import axios from 'axios';
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
 
  const [alarmActive, setAlarmActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]); 
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);



  const input = document.getElementById('text_region');

  React.useEffect(() => {
    if (textValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    if (textValue.endsWith(".")) {
      const lastSentence = getLastSentence(textValue);
      if (lastSentence) {
        speakText(lastSentence);
      }
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

  const getLastSentence = (text) => {
    const sentences = text.split(".").map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length > 0) {
      return sentences[sentences.length - 1]; 
    }
    return text.trim(); 
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
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

    } else if (action.type === "show_suggestions") {
      if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
        console.log("switching to suggestions")
        setShowSuggestions(true);
        setCurrentLayoutName("suggestions");
      }
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
      console.log("word length : ", suggestion.length )
      console.log("current curs pos : ", globalCursorPosition.value)
      updateGlobalCursorPosition(globalCursorPosition.value + suggestion.length)

      setTimeout(() => {
        const newPos = input.value.length;
        input.focus();
        input.setSelectionRange(newPos, newPos);
        setCursorPosition(newPos);
      }, 0);


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

function KeyboardGrid({ layout, textValue, setTextValue, onTileActivate, suggestions , handleTextAreaChange, textAreaRef }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Create a handler that wraps onTileActivate to handle suggestion-related actions
  const handleTileActivate = (action) => {
    setShowSuggestions(action.type === "show_suggestions")
    onTileActivate(action);
  };

  return (
    <div className="keyboard-grid">
      <TextAreaTile 
        value={textValue}
        onChange={handleTextAreaChange || setTextValue}
        colspan={2}
        textAreaRef={textAreaRef}
      />

      {layout.name === "writing" && (
        <WritingLayoutTiles
          layout={layout}
          textValue={textValue}
          suggestions={suggestions}
          onTileActivate={handleTileActivate}
          showSuggestions={showSuggestions}
        />
      )}
      {layout.name === "suggestions" && (
        <SuggestionsLayoutTiles
          layout={layout}
          suggestions={suggestions}
          onTileActivate={handleTileActivate}
        />
      )}
      {layout.name !== "writing" && layout.name !== "suggestions" && (
        layout.tiles.map((tile, i) => {
          if (tile.type === "textarea") {
            return null;
          }
          return <Tile key={i} tile={tile} onActivate={handleTileActivate} />;
        })
      )}
    </div>
  );
}

function WritingLayoutTiles({ layout, textValue, suggestions = [], onTileActivate, showSuggestions }) {
  const tilesCopy = [...layout.tiles];

  if (showSuggestions) {
    const suggestionTiles = (suggestions || []).slice(0, 8).map((sugg) => ({
      type: "suggestion",
      label: sugg,
      action: { type: "insert_suggestion", value: sugg }
    }));
    tilesCopy.splice(4, suggestionTiles.length, ...suggestionTiles);
  } else {
    let suggestionsLabel = (suggestions || [])
      .slice(0, 8)
      .filter(s => s !== undefined)
      .join("\n");
      
    if (tilesCopy[3]) {
      tilesCopy[3] = {
        ...tilesCopy[3],
        type: "switch_suggestions",
        label: suggestionsLabel,
        action: { type: "show_suggestions" },
        customStyle: {fontSize: "12px"}
      };
    }
  }

  return (
    <>
      {tilesCopy.map((tile, i) => {
        if (tile.type === "textarea") return null;
        return <Tile key={i} tile={tile} onActivate={onTileActivate} />;
      })}
    </>
  );
}

function SuggestionsLayoutTiles({ layout, suggestions, onTileActivate }) {
  const baseTiles = layout.tiles.slice(0, 3);

  const suggestionTiles = suggestions.slice(0, 8).map((sugg) => ({
    type: "suggestion",
    label: sugg,
    action: { type: "insert_suggestion", value: sugg }
  }));


  const finalTiles = [...baseTiles, ...suggestionTiles];

  return (
    <>
      {finalTiles.map((tile, i) => {
        if (tile.type === "textarea") return null;
        return <Tile key={i} tile={tile} onActivate={onTileActivate} />;
      })}
    </>
  );
}

// Modify the setInterval to check if element exists
const focusInterval = setInterval(function() {
  const focusBox = document.getElementById("text_region");
  if (focusBox) {
    focusBox.focus();
  }
}, 1000); // Changed to 1 second to reduce CPU usage

// Clean up interval when component unmounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearInterval(focusInterval);
  });
}


function TextAreaTile({ value, onChange, colspan=2 }) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    onChange(newValue);
  };

  React.useEffect(() => {
    const input = document.getElementById('text_region');
    console.log("Cursor distance:", globalCursorPosition.value);
    input.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
  }, [value]);

  return (
    <div className="tile textarea-tile" style={{gridColumn: `span ${colspan}`}}>
      <textarea value={value} onChange={handleChange} id='text_region' />
    </div>
  );
}



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
      style={tile.customStyle || {}}
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