import React, { useState, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

import axios from "axios";
// import {settings, setSettings} from "./util/userData.js"
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import GenericView from "./views/GenericView";
import AlarmPopup from "./components/AlarmPopup";
import { config } from "./config/config";
import {speakText} from './singleton/textToSpeachSingleton'
import {
  deleteWordAtCursor,
  deleteSentence,
  deleteSection,
  getCurrentLine,
  getCharDistance,
  calcCursorDistance,
  getLastSentence,
  matchCase,
} from './util/textUtils';
import {
  getPreviousSection,
  getNextWord, 
  getNextSentence, 
  getNextSection, 
  getPreviousWord, 
  getPreviousSentence
} from './util/cursorUtils'
import { updateSetting, updateRanking } from "./util/settingUtil";
import {rank, updateRank, stripSpace, getRank} from "./util/ranking"
import * as UserDataConst from "./constants/userDataConstants"
import * as CmdConst from "./constants/cmdConstants"
let dwellTime = 2000;

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [letterSuggestions, setLetterSuggestions] = useState([])
  const [nextLetters, setNextLetters] = useState([[],[],[],[],[],[],[]])
  const defaultLetterSuggestions  = useState(["e","t","a","space","o","i"])
  const [nextLetterSuggestion,setNextLetterSuggestion]  = useState(null)
  
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const layout = config.layouts[currentLayoutName] || config.layouts["main_menu"];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)

  const [userData, setUserData] = useLocalStorage(
    UserDataConst.USERDATA,  {
        settings : {
          language : UserDataConst.DEFAULT_LANGUAGE,
          dwelltime: UserDataConst.DEFAULT_DWELLTIME,
          button_font_size : UserDataConst.DEFAULT_BUTTON_FONT_SIZE,
          text_font_size : UserDataConst.DEFAULT_TEXT_FONT_SIZE,
        },
        ranking : UserDataConst.DEFAULT_RANKING
    },
  )




  const handleLetterSelected = (otherLetters, selectedLetter) => {
    // debugger
    let Letters = stripSpace(otherLetters)
    updateRank(Letters, selectedLetter)
    console.log(getRank())
    const newUserdata = updateRanking(userData, getRank())
    setUserData(newUserdata)
    console.log("Other letters:", Letters, "Selected:", selectedLetter);
    let index = 0;
    for (let i = 0; i < Letters.length; i++) {
      if ( Letters[i] === selectedLetter) {
        index = i;
      }
    }
    if (nextLetters[index].length !== 0) {
      setNextLetterSuggestion(nextLetters[index])
      
    }
  };
  
  // load settings initalially
  React.useEffect(() => {
    console.log("first load", userData)
    const settings = userData.settings
    changeLanguage(settings[UserDataConst.LANGUAGE])
    dwellTime = settings[UserDataConst.DWELLTIME]

    setButtonFontSize(settings[UserDataConst.BUTTON_FONT_SIZE])
    setTextFontSize(settings[UserDataConst.TEXT_FONT_SIZE])

  }, [userData]);

  React.useEffect(() => {
    const setTileFontSize = () => {
      const tileHeight = window.innerHeight / 3;
      const maxAllowedFontSize = tileHeight * 0.4;
      const newTileFontSize = Math.min(buttonFontSize, maxAllowedFontSize);
      console.log(buttonFontSize);
      document.documentElement.style.setProperty('--tile-font-size', `${newTileFontSize}px`);
    };
    setTileFontSize();
    window.addEventListener("resize", setTileFontSize);
    return () => window.removeEventListener("resize", setTileFontSize);
  }, [buttonFontSize]);

  React.useEffect(() => {
    const textUpToCursor = textValue.slice(0, globalCursorPosition.value)

    const fetchSuggestions = async () => {

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

    const fetchLetterSuggestions = async (text) => {
      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/lettercontinuations", {
          locale: "en_US",
          prompt: text,
        });
        return response
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        return []
        
      }
    }
    
    const fillLetterSuggestions = async () => {
        const getSug = async (text) => {
          const response = await fetchLetterSuggestions(text)
          const suggestionsString = response.data.continuations
          let suggestionArray = []
          for (let i = 0; i < suggestionsString.length; i++) {
            suggestionArray.push(suggestionsString[i])
          }
          const topSuggestion = suggestionArray.slice(0, 6)
          topSuggestion.reverse()
          return topSuggestion
      }
      // if there is already a selection use that
      let rankedSuggestion = []
      if (nextLetterSuggestion) {
        rankedSuggestion = nextLetterSuggestion
      } else {
        const currentSuggestion = (await getSug(textUpToCursor))
        rankedSuggestion = rank(currentSuggestion, null, null)
      }
      setNextLetterSuggestion(null)
      // insert space

      const letterSuggestionsArray = []
      for (let i = 0; i < 7; i++) {
        if (i === 3) {
          letterSuggestionsArray[i] = []
          continue;
        };
        const nextSug = await getSug(textUpToCursor + rankedSuggestion[i])
        letterSuggestionsArray[i] = rank(nextSug, rankedSuggestion[i], i)
      }
      rankedSuggestion.splice(3,0,"space") // add space
      
      setLetterSuggestions(rankedSuggestion)



      setNextLetters(letterSuggestionsArray);
    }
    
    fillLetterSuggestions();

  }, [textValue]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();

        const loremText = "Lorem ipsum, consectetur adipiscing elit, sed do eiusmod.\nnostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        const cursorPos = input.selectionStart;
        const newText = textValue.slice(0, cursorPos) + loremText + textValue.slice(cursorPos);

        setTextValue(newText);
        updateGlobalCursorPosition(cursorPos + loremText.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textValue]); // Depend on textValue so it updates properly.


  const handleAction = (action) => {
    if (action.type === "enter_letter") {
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
      setTextValue(newText);
      
      updateGlobalCursorPosition(input.selectionStart + 1);
      // always go back to writing layout after entering a letter
      setCurrentLayoutName("writing");

      // if the last letter was punctuation speak it
      if (action.value === ".") {
        const lastSentenceStart = getLastSentence(textValue)
        const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
        console.log("last sentence : ", lastSentence)
        speakText(lastSentence)
      }

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

      if (currentLayoutName !== "suggestions")
        setCurrentLayoutName("writing");
    } else if (action.type === "delete_letter_edit") {
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);


    } else if (action.type === "toggle_case") {
      setIsCapsOn(prev => !prev);

    } else if (action.type === "cursor") {
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
        let previousDistance = getCharDistance(currentLines, line - 1);
        let currentLineLength = currentLines[line].length;
        if (calcCursorDistance() === currentLineLength) {
          const previousLineLength = previousLine.length;
          input.setSelectionRange(previousDistance + previousLineLength, previousDistance + previousLineLength);
        } else {
          input.setSelectionRange(previousDistance + calcCursorDistance(), previousDistance + calcCursorDistance());

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
      const { newText, newCursorPosition } = deleteWordAtCursor(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);

    } else if (action.type === "delete_sentence") {
      const { newText, newCursorPosition } = deleteSentence(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === "delete_section") {
      const { newText, newCursorPosition } = deleteSection(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === "undo") {
      // todo
    } else if (action.type === "start_of_text") {
      updateGlobalCursorPosition(0)

    } else if (action.type === "previous_section") {
      let start = getPreviousSection(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "previous_sentence") {
      let start = getPreviousSentence(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "previous_word") {
      let start = getPreviousWord(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "end_of_text") {
      updateGlobalCursorPosition(textValue.length)

    } else if (action.type === "next_section") {
      let end = getNextSection(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "next_sentence") {
      let end = getNextSentence(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "next_word") {
      let end = getNextWord(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "show_suggestions") {
      if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
        setShowSuggestions(true);
        setCurrentLayoutName("suggestions");
      }
    } else if (action.type === "insert_suggestion") {
      const suggestion = action.value;

      const cursorPos = globalCursorPosition.value;
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
      // settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      const newUserdata =  updateSetting(userData, UserDataConst.LANGUAGE, action.value)
      setUserData(newUserdata)
      changeLanguage(userData[UserDataConst.SETTINGS][UserDataConst.LANGUAGE]);
    } else if (action.type === "change_dwell_time") {
      
      dwellTime = parseFloat(action.value);
      const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, dwellTime)
      setUserData(newUserdata)
      let goBack = {
        type: "switch_layout", layout: "main_menu"
      }
      handleAction(goBack);
    } else if (action.type === "play_alarm") {
      setAlarmActive(true);
    } else if (action.type === 'close_alarm') {
      setAlarmActive(false);
    } else if (action.type === "increase_button_font_size") {
      const size = buttonFontSize < 96 ? buttonFontSize + 1 : buttonFontSize
      const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size) 
      setUserData(newUserdata)
      setButtonFontSize(size)
    } else if (action.type === "decrease_button_font_size") {
      const size = buttonFontSize > 0 ? buttonFontSize - 1 : buttonFontSize
      const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size)
      setUserData(newUserdata)
      setButtonFontSize(size)
      console.log("decrease button font size ", buttonFontSize);
    } else if (action.type === "increase_text_font_size") {
      const size = textFontSize < 96 ? textFontSize + 1 : textFontSize
      const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size)
      setUserData(newUserdata)
      setTextFontSize(size)
    } else if (action.type === "decrease_text_font_size") {
      const size = textFontSize > 0 ? textFontSize - 1 : textFontSize
      const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size)
      setUserData(newUserdata)
      setTextFontSize(size)

    } else if (action.type === "insert_letter_suggestion") {
       // insert the letter at the global cursor position


       const letter = action.value === "space" ? " " : 
                      isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
       const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
       setTextValue(newText);
       
       updateGlobalCursorPosition(input.selectionStart + 1);
       // always go back to writing layout after entering a letter
       setCurrentLayoutName("writing");
 
       // if the last letter was punctuation speak it
       if (action.value === ".") {
         const lastSentenceStart = getLastSentence(textValue)
         const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
         console.log("last sentence : ", lastSentence)
         speakText(lastSentence)
       }
    }
    input.focus();    
  };

  return (
    <div className="App">
      <GenericView
        layout={layout}
        textValue={textValue}
        setTextValue={setTextValue}
        handleAction={handleAction}
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={nextLetters}
        dwellTime={dwellTime} 
        handleLetterSelected={handleLetterSelected}
        />
      {alarmActive && <AlarmPopup onClose={() => setAlarmActive(false)} dwellTime={dwellTime} />}
    </div>
  );
}

export default App;
