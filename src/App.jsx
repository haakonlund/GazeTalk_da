import React, { useState, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { flushSync } from 'react-dom';
import axios from "axios";
// import {settings, setSettings} from "./util/userData.js"
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import LayoutPicker from "./layouts/LayoutPicker";
import AlarmPopup from "./components/AlarmPopup";
import UnlockAudioPopup from "./components/UnluckAudioPopup";
//import PausePopup from "./components/PausePopup";
import { config } from "./config/config";
import { speakText } from './singleton/textToSpeachSingleton'
import { updateSetting, updateRanking } from "./util/settingUtil";
import * as RankingSystem from "./util/ranking"
import { handleAction } from "./util/handleAction";
import {rank, updateRank, stripSpace, getRank} from "./util/ranking"
import * as UserDataConst from "./constants/userDataConstants"
import * as CmdConst from "./constants/cmdConstants"
import { layoutToButtonNum } from "./constants/layoutConstants";
import { useTesting } from "./components/UserBehaviourTest";
import { getLastSentence } from "./util/textUtils";
import * as TestConst from "./constants/testConstants/testConstants";
import { getDeviceType } from "./util/deviceUtils";
let dwellTime = 800;

function App({ initialView = CmdConst.MAIN_MENU, initialLayout = "2+2+4x2", initialText="", unitTesting=process.env.NODE_ENV === "test" }) {
  const [currentViewName, setCurrentViewName] = useState(initialView);
  const [currentLayoutName, setCurrentLayoutName] = useState(initialLayout);
  const [textValue, updateTextValue] = useState(initialText);
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
  const view = config.views[currentViewName] || config.views[CmdConst.MAIN_MENU];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)
  const [buttonNum, setButtonNum] = useState(6)
  const showNextSuggestions = unitTesting // turn on to show next suggestions
  //const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  // Testing 
  const { isTesting, currentTestIndex, targetSentence, counterStarted, initTest, startTest, endTest, completeTests, logEvent, setLogs, logs, cancelTest } = useTesting();
  
  const unlockAudio = () => {
    const audio = new Audio("/click_button.mp3");
    audio.play().then(() => {
      setAudioUnlocked(true);
    });
  };

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
  const startUserTest = () => {
    initTest(0, userData);
  };

 

function setupRemoteLogging() {
    const originalLog = console.log;
    console.log = function (...args) {
      originalLog(...args);
      const currentIP = window.location.hostname;
      fetch(`http://${currentIP}:5000/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: args })
      }).catch(err => originalLog("Failed to send log:", err));
    };
  }

  React.useEffect(() => {
    const deviceID = getDeviceType()
    if (unitTesting){
      return
    }
    if (deviceID === "ipad") {
      changeButtonNum(14);
      setCurrentLayoutName("2+3+5x3");
      setupRemoteLogging();
      console.log("Remote logging enabled for device:", deviceID);
    } else if (deviceID === "iphone") {
      changeButtonNum(13);
      setCurrentLayoutName("4+4x4");
      setupRemoteLogging();
      console.log("Remote logging enabled for device:", deviceID);
    } else {
      changeButtonNum(6);
      setCurrentLayoutName(initialLayout);
      console.log("Remote logging enabled for device:", deviceID);
    }
  }, []);

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
  const setTextValue = (text) => {
    if (isTesting && !counterStarted) {
      startTest();
      //gets last word of 'text'
      updateTextValue(text);
    } else if (isTesting && text === targetSentence 
      || isTesting 
         && (targetSentence.split("")[targetSentence.length - 1] === " ")
         && text === targetSentence.slice(0, targetSentence.length - 1)
      || isTesting && text.split("")[text.length - 1] === ".") {
        const lastSentenceIndex = getLastSentence(text);
        const lastSentence = text.slice(lastSentenceIndex).trim();
        logEvent({ type: "sentenceComplete", submittedText: lastSentence });
        endTest();
        //Tests are done
        if (currentTestIndex === TestConst.NUMBER_OF_TESTS - 1) {
          initTest(currentTestIndex + 1, userData);
          updateTextValue("");
          updateGlobalCursorPosition(0);
          setAudioUnlocked(false);
        } else { //Next tests
          initTest(currentTestIndex + 1, userData);
          updateTextValue(targetSentence + "\n");
          updateGlobalCursorPosition((targetSentence + "\n").length);
        }
    }
    else {
      updateTextValue(text);
    }
  };
  const abandonTest = () => {
    cancelTest();
  }

  //Needed to unlock audio on browsers
  React.useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener('hover', unlockAudio);
    };
  
    document.addEventListener('hover', unlockAudio);
  
    return () => {
      document.removeEventListener('hover', unlockAudio);
    };
  }, []);

  
  React.useEffect(() => {
    if (!isTesting && targetSentence === "") {
      
    } else if (isTesting && targetSentence) {
      updateTextValue(targetSentence + "\n");
      updateGlobalCursorPosition((targetSentence + "\n").length);
    }
  }, [targetSentence]);


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
        setSuggestions(response.data.continuations.slice(0, 16) || []);
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
        const suggestionArray = [...suggestionsString]; 

        return suggestionArray.slice(0, RankingSystem.getButtonNum());
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
    
      
      // Process results
      if (showNextSuggestions) {
        // Make all next suggestion API calls in parallel using Promise.all
        const nextSugPromises = rankedSuggestion.map(async (suggestion, index) => {
          return getSug(textUpToCursor + suggestion);
        });

        const nextSugResults = await Promise.all(nextSugPromises);
        const letterSuggestionsArray = nextSugResults.map((result, i) => {
          return RankingSystem.rank(result, rankedSuggestion[i], i);
        });
        setNextLetters(letterSuggestionsArray);
      
      } else {
        setNextLetters(new Array(buttonNum).fill([]));

      }
      setLetterSuggestions(rankedSuggestion);
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


  const handleActionWrapper = (action) => {
    handleAction(action, {
      textValue,
      setTextValue,
      setCurrentViewName,
      currentViewName,
      globalCursorPosition,
      updateGlobalCursorPosition,
      isCapsOn,
      setIsCapsOn,
      input,
      userData,
      setUserData,
      speakText,
      alarmActive,
      nextLetterSuggestion,
      setAlarmActive,
      isPaused,
      setIsPaused,
      setNextLetterSuggestion,
      letterSuggestions,
      setLetterSuggestions,
      nextLetters,
      setNextLetters,
      suggestions,
      setSuggestions,
      buttonFontSize,
      setButtonFontSize,
      textFontSize,
      setTextFontSize,
      config,
      setCurrentLayoutName,
      currentLayoutName,
      setShowSuggestions,
      showSuggestions,
      changeButtonNum,
      buttonNum,
      isTesting,
      counterStarted,
      startUserTest,
      logEvent,
      abandonTest,
      dwellTime,
      currentTestIndex,
    });
  };

  return (
    <div className="App">
      {!unitTesting && !audioUnlocked && <UnlockAudioPopup onUnlock={unlockAudio} />}
      {(unitTesting || audioUnlocked) && !alarmActive && <LayoutPicker
        layout={currentLayoutName}
        view={view}
        textValue={textValue}
        setTextValue={setTextValue}
        handleAction={handleActionWrapper}
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={nextLetters}
        dwellTime={dwellTime} 
        handleLetterSelected={handleLetterSelected}
        logEvent={logEvent}
        counterStarted={counterStarted}
        />
      }
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
