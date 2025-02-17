import React, { useState, useRef } from "react";
import axios from "axios";
import settings from "./settings.json";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./cursorSingleton";

import GenericView from "./views/GenericView";
import AlarmPopup from "./components/AlarmPopup";
import { config } from "./config/config";

let dwellTime = 500;

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const layout = config.layouts[currentLayoutName] || config.layouts["main_menu"];
  const input = document.getElementById('text_region');
  // const cursorEventTarget = new EventTarget();

  React.useEffect(() => {
    if (textValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    if (textValue.endsWith(".") || textValue.endsWith(". ")) {
      const lastSentence = getLastSentence(textValue);
      if (lastSentence) {
        speakText(lastSentence);
      }
    }

    const fetchSuggestions = async () => {
      
      const textUpToCursor = textValue.slice(0, globalCursorPosition.value)
      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/continuations", {
          locale: "en_US",
          prompt: textUpToCursor,
        });
        setSuggestions(response.data.continuations.slice(0, 8) || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [textValue]);

  const getLastSentence = (text) => {
    let start = globalCursorPosition.value
    while (start > 0 && text[start-1] !== ".") {
      start--;
    }
    return text.slice(start, globalCursorPosition.value)
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
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
    if (action.type === "enter_letter") {
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

    } else if (action.type === "cursor" ) {
      const cursorPosition = input.selectionStart;
      
      if (action.direction === "left") {
        if (cursorPosition === 0) return;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
     
      } else if (action.direction === "right") {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);

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
    updateGlobalCursorPosition(input.selectionStart);
    input.focus();
    
    
  
    } else if (action.type === "delete_word") { 
      deleteWordAtCursor();

    } else if (action.type === "delete_sentence") { 
      deleteSentence();
    } else if (action.type === "delete_section") { 
      deleteSection()
    } else if (action.type === "undo") {
      // todo
    } else if (action.type === "start_of_text") {
      updateGlobalCursorPosition(0)
      console.log("globo", globalCursorPosition)

    } else if (action.type === "previous_section") {

    } else if (action.type === "previous_sentence") {

    } else if (action.type === "previous_word") {

    } else if (action.type === "end_of_text") {
      updateGlobalCursorPosition(textValue.length)
      console.log("globo", globalCursorPosition)

    } else if (action.type === "next_section") {

    } else if (action.type === "next_sentence") {

    } else if (action.type === "next_word") {

    } else if (action.type === "show_suggestions") {
      if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
        setShowSuggestions(true);
        setCurrentLayoutName("suggestions");
      }
    } else if (action.type === "insert_suggestion") {
      const suggestion = action.value;
      
      const cursorPos = input.selectionStart;
      const textUpToCursor = textValue.slice(0, cursorPos);
      const rest = textValue.slice(cursorPos, textValue.length);
      const lastSpaceIndex = textUpToCursor.lastIndexOf(" ");
      const lastWord = 
        lastSpaceIndex >= 0 
          ? textUpToCursor.slice(lastSpaceIndex + 1) 
          : textUpToCursor; 
      const replaced = textUpToCursor.slice(0, textUpToCursor.length - lastWord.length);
      const casedSuggestion = matchCase(suggestion, lastWord);
      const newText = replaced + casedSuggestion + " " + rest;
      setTextValue(newText);
      const spaceLength = 1;
      updateGlobalCursorPosition(globalCursorPosition.value + casedSuggestion.length + spaceLength)

    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      // language = action.value;
      changeLanguage(action.value);
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
      let goBack = {
         type: "switch_layout", layout: "main_menu"
      }
      handleAction(goBack);
    }

    function deleteWordAtCursor() {
      const cursorPosition = input.selectionStart;
      // get the current line
      const currentLines = textValue.split("\n");
      let line = getCurrentLine(currentLines, cursorPosition);
      let currentLine = currentLines[line];


      // get word boudaries
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
      updateGlobalCursorPosition(cursorPosition - (x1 - x0) + distanceToEndofWord);
    }

    input.focus()
  };
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
  const calcCursorDistance = () => {
    const currentLines = textValue.split("\n");
    let line = getCurrentLine(currentLines, input.selectionStart);
    const cursorPosition = input.selectionStart -  getCharDistance(currentLines, line);
    return cursorPosition
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

  function getWordBoundaries(text, cursorPosition) {
    if (!text || cursorPosition < 0 || cursorPosition >= text.length) {
      return null;
    }
  
    let start = cursorPosition;
    let end = cursorPosition;

    // get the left boundary
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }

    // get the right boundary
    while (end < text.length && !/\s/.test(text[end])) {
      end++;
    }

    return { x0: start, x1: end };
  }

  return (
    <div className="App">
      <GenericView 
        layout={layout} 
        textValue={textValue} 
        setTextValue={setTextValue} 
        handleAction={handleAction}
        suggestions={suggestions}
        dwellTime={dwellTime} />
      {alarmActive && <AlarmPopup onClose={() => setAlarmActive(false)} />}
    </div>
  );
}

export default App;
