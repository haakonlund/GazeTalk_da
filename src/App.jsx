import React, { useState, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

import axios from "axios";
// import {settings, setSettings} from "./util/userData.js"
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import LayoutPicker from "./layouts/LayoutPicker";
import AlarmPopup from "./components/AlarmPopup";
//import PausePopup from "./components/PausePopup";
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
import * as RankingSystem from "./util/ranking"
import * as UserDataConst from "./constants/userDataConstants"
import * as CmdConst from "./constants/cmdConstants"
import { layoutToButtonNum } from "./constants/layoutConstants";
let dwellTime = 1500;

function App({ initialView = "main_menu", initialLayout = "2+2+4x2" }) {
  const [currentViewName, setCurrentViewName] = useState(initialView);
  const [currentLayoutName, setCurrentLayoutName] = useState(initialLayout);
  const [textValue, setTextValue] = useState("");
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [letterSuggestions, setLetterSuggestions] = useState([])
  const [nextLetters, setNextLetters] = useState([[],[],[],[],[],[],[]])
  const defaultLetterSuggestions  = useState(["e","t","a","space","o","i"])
  const [nextLetterSuggestion,setNextLetterSuggestion]  = useState(null)
  
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const view = config.views[currentViewName] || config.views["main_menu"];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)
  const [buttonNum, setButtonNum] = useState(6)

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

  const changeButtonNum = (newValue) => {
    
    if (newValue < 1) {
      console.warn("Button number can't be less than 1");
      return;
    }
    
    RankingSystem.setButtonNum(newValue);
    setButtonNum(newValue)
  };


  const handleLetterSelected = (otherLetters, selectedLetter) => {
    let Letters = RankingSystem.stripSpace(otherLetters)
    RankingSystem.updateRank(Letters, selectedLetter)
    const newUserdata = updateRanking(userData, RankingSystem.getRank())
    setUserData(newUserdata)
    // console.log("Other letters:", Letters, "Selected:", selectedLetter);
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
    // console.log("first load", userData)
    const settings = userData?.settings
    if (settings) {
      const language = settings[UserDataConst.LANGUAGE] || UserDataConst.DEFAULT_LANGUAGE;
      changeLanguage(language)
      dwellTime = settings[UserDataConst.DWELLTIME]

      setButtonFontSize(settings[UserDataConst.BUTTON_FONT_SIZE])
      setTextFontSize(settings[UserDataConst.TEXT_FONT_SIZE])
    }
    
  }, [userData]);

  React.useEffect(() => {
    const setTileFontSize = () => {
      const tileHeight = window.innerHeight / 3;
      const maxAllowedFontSize = tileHeight * 0.4;
      const newTileFontSize = Math.min(buttonFontSize, maxAllowedFontSize);
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
        setSuggestions(response.data.continuations.slice(0, 15) || []);
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
        const response = await fetchLetterSuggestions(text);
        const suggestionsString = response.data.continuations;
        const suggestionArray = [...suggestionsString]; // Using spread operator instead of the loop
        return suggestionArray.slice(0, RankingSystem.getButtonNum()).reverse();
      };
    
      // Get initial suggestions
      let rankedSuggestion = [];
      if (nextLetterSuggestion) {
        rankedSuggestion = nextLetterSuggestion;
      } else {
        const currentSuggestion = await getSug(textUpToCursor);
        rankedSuggestion = RankingSystem.rank(currentSuggestion, null, null);
      }
      setNextLetterSuggestion(null);
    
      // Make all next suggestion API calls in parallel using Promise.all
      const nextSugPromises = rankedSuggestion.map(async (suggestion, index) => {
        return getSug(textUpToCursor + suggestion);
      });
    
      const nextSugResults = await Promise.all(nextSugPromises);
      
      // Process results
      const letterSuggestionsArray = nextSugResults.map((result, i) => {
        return RankingSystem.rank(result, rankedSuggestion[i], i);
      });
      
      setLetterSuggestions(rankedSuggestion);
      setNextLetters(letterSuggestionsArray);
    };
    
    fillLetterSuggestions();

  }, [textValue, buttonNum]);

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
    if (action.type === CmdConst.ENTER_LETTER) {
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
      setTextValue(newText);
      
      updateGlobalCursorPosition(input.selectionStart + 1);
      // always go back to writing view after entering a letter
      setCurrentViewName("writing");

      // if the last letter was punctuation speak it
      if (action.value === CmdConst.PERIOD) {
        const lastSentenceStart = getLastSentence(textValue)
        const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
        speakText(lastSentence)
      }

    } else if (action.type === CmdConst.NEWLINE) {
      // insert a newline at the global cursor position 
      const newText = textValue.slice(0, globalCursorPosition.value) + "\n" + textValue.slice(globalCursorPosition.value, textValue.length);
      setTextValue(newText);
      // move the cursor to the next line after inserting a newline
      updateGlobalCursorPosition(globalCursorPosition.value + 1);
    } else if (action.type === CmdConst.SWITCH_VIEW) {
      if (config.views[action.view]) {
        setCurrentViewName(action.view);
      }

    } else if (action.type === CmdConst.DELETE_LETTER) {
      // delete the letter at the global cursor position
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);

      if (currentViewName !== "suggestions")
        setCurrentViewName("writing");
    } else if (action.type === CmdConst.DELETE_LETTER_EDIT) {
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);


    } else if (action.type === CmdConst.TOGGLE_CASE) {
      setIsCapsOn(prev => !prev);

    } else if (action.type === CmdConst.CURSOR) {
      const cursorPosition = input.selectionStart;

      if (action.direction === CmdConst.LEFT) {
        if (cursorPosition === 0) return;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);

      } else if (action.direction === CmdConst.RIGHT) {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);

      } else if (action.direction === CmdConst.UP) {
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

      } else if (action.direction ===CmdConst.DOWN) {
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



    } else if (action.type === CmdConst.DELETE_WORD) {
      const { newText, newCursorPosition } = deleteWordAtCursor(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);

    } else if (action.type === CmdConst.DELETE_SENTENCE) {
      const { newText, newCursorPosition } = deleteSentence(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === CmdConst.DELETE_SECTION) {
      const { newText, newCursorPosition } = deleteSection(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === CmdConst.UNDO) {
      // todo
    } else if (action.type === CmdConst.START_OF_TEXT) {
      updateGlobalCursorPosition(0)

    } else if (action.type === CmdConst.PREVIOUS_SECTION) {
      let start = getPreviousSection(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === CmdConst.PREVIOUS_SENTENCE) {
      let start = getPreviousSentence(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === CmdConst.PREVIOUS_WORD) {
      let start = getPreviousWord(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === CmdConst.END_OF_TEXT) {
      updateGlobalCursorPosition(textValue.length)

    } else if (action.type === CmdConst.NEXT_SECTION) {
      let end = getNextSection(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === CmdConst.NEXT_SENTENCE) {
      let end = getNextSentence(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === CmdConst.NEXT_WORD) {
      let end = getNextWord(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === CmdConst.SHOW_SUGGESTIONS) {
      if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
        setShowSuggestions(true);
        setCurrentViewName("suggestions");
      }
    } else if (action.type === CmdConst.INSERT_SUGGESTION) {
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

    } else if (action.type === CmdConst.CHOOSE_BUTTON_LAYOUT) {
      // settings.buttons_layout = action.value;
    } else if (action.type === CmdConst.CHANGE_LANGUAGE) {
      const newUserdata =  updateSetting(userData, UserDataConst.LANGUAGE, action.value)
      setUserData(newUserdata)
      changeLanguage(userData[UserDataConst.SETTINGS][UserDataConst.LANGUAGE]);
    } else if (action.type === CmdConst.CHANGE_DWELL_TIME) {
      
      dwellTime = parseFloat(action.value);
      const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, dwellTime)
      setUserData(newUserdata)
      let goBack = {
        type: "switch_view", view: "main_menu"
      }
      handleAction(goBack);
    } else if (action.type === CmdConst.PLAY_ALARM) {
      setAlarmActive(true);
    } else if (action.type === CmdConst.CLOSE_ALARM) {
      setAlarmActive(false);
    } else if (action.type === CmdConst.INCREASE_BUTTON_FONT_SIZE) {
      const size = buttonFontSize < 96 ? buttonFontSize + 1 : buttonFontSize
      const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size) 
      setUserData(newUserdata)
      setButtonFontSize(size)
    } else if (action.type === CmdConst.DECREASE_BUTTON_FONT_SIZE) {
      const size = buttonFontSize > 0 ? buttonFontSize - 1 : buttonFontSize
      const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size)
      setUserData(newUserdata)
      setButtonFontSize(size)
    } else if (action.type === CmdConst.INCREASE_TEXT_FONT_SIZE) {
      const size = textFontSize < 96 ? textFontSize + 1 : textFontSize
      const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size)
      setUserData(newUserdata)
      setTextFontSize(size)
    } else if (action.type === CmdConst.DECREASE_TEXT_FONT_SIZE) {
      const size = textFontSize > 0 ? textFontSize - 1 : textFontSize
      const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size)
      setUserData(newUserdata)
      setTextFontSize(size)

    } else if (action.type === CmdConst.INSERT_LETTER_SUGGESTION) {
       // insert the letter at the global cursor position


       const letter = action.value === "space" ? " " : 
                      isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
       const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
       setTextValue(newText);
       
       updateGlobalCursorPosition(input.selectionStart + 1);
       // always go back to writing view after entering a letter
       setCurrentViewName("writing");
 
       // if the last letter was punctuation speak it
       if (action.value === ".") {
         const lastSentenceStart = getLastSentence(textValue)
         const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
         speakText(lastSentence)
       }
    } else if (action.type === "toggle_pause") {
      setIsPaused((prev) => !prev);
    } else if (action.type === "switch_layout") {
      changeButtonNum(
        layoutToButtonNum[action.value] || 6
      )
      setCurrentLayoutName(action.value);
    }
    input.focus();    
  };

  return (
    <div className="App">
      <LayoutPicker
        layout={currentLayoutName}
        view={view}
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
        {
          // Uncomment to show debug button
          //<PausePopup isPaused={isPaused} /> 
        }
        {
          //<button onClick={() => setIsPaused((prev) => !prev)}>Toggle Pause</button> 
        }
    </div>
  );
}

export default App;
