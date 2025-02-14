import React, { useState, useRef } from "react";
import axios from "axios";
import settings from "./settings.json";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import "./App.css";
import globalCursorPosition from "./cursorSingleton";
import GenericView from "./views/GenericView";
import AlarmPopup from "./components/AlarmPopup";
import { config } from "./config";

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
      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/continuations", {
          locale: "en_US",
          prompt: textValue,
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
    let start = globalCursorPosition.value;
    while (start > 0 && text[start-1] !== ".") {
      start--;
    }
    return text.slice(start, globalCursorPosition.value);
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
    const input = document.getElementById("text_region");
    if (action.type === "enter_letter") {
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      setTextValue(prev => {
        const cursorPos = globalCursorPosition.value;
            const newText = prev.slice(0, cursorPos) + letter + prev.slice(cursorPos);

            setTimeout(() => updateGlobalCursorPosition(cursorPos + 1), 0);
            return newText;
      });

    } else if (action.type === "switch_layout") {
      if (config.layouts[action.layout]) {
        setCurrentLayoutName(action.layout);
      }

    } else if (action.type === "delete_letter") {
      setTextValue(prev => {
        const cursorPos = globalCursorPosition.value;
        if (cursorPos > 0) {

            const newText = prev.slice(0, cursorPos - 1) + prev.slice(cursorPos);
            setTimeout(() => updateGlobalCursorPosition(cursorPos - 1), 0);
            return newText;
        }
        return prev;
      });
      updateGlobalCursorPosition(globalCursorPosition.value - 1);

    } else if (action.type === "toggle_case") {
      setIsCapsOn(prev => !prev);

    } else if (action.type === "change_language") {
      changeLanguage(action.value);

    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
      let goBack = {
         type: "switch_layout", layout: "main_menu"
      }
      handleAction(goBack);
    } else if (action.type === "show_suggestions") {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
        setCurrentLayoutName("suggestions");
      }
    } else if (action.type === "insert_suggestion") {
      const suggestion = action.value;
    
      setTextValue(prev => {
        const cursorPos = globalCursorPosition.value;
        const textUpToCursor = prev.slice(0, cursorPos);
        const rest = prev.slice(cursorPos);
        const lastSpaceIndex = textUpToCursor.lastIndexOf(" ");
        const lastWord = lastSpaceIndex >= 0 ? textUpToCursor.slice(lastSpaceIndex + 1) : textUpToCursor;
        const replaced = textUpToCursor.slice(0, textUpToCursor.length - lastWord.length);
    
        const casedSuggestion = matchCase(suggestion, lastWord);
        const newText = replaced + casedSuggestion + " " + rest;
        
        setTimeout(() => updateGlobalCursorPosition(replaced.length + casedSuggestion.length + 1), 0);
        speakText(casedSuggestion);
        return newText;
      });
    }

  };

  function updateGlobalCursorPosition(xCursorPosition) {
    globalCursorPosition.value = xCursorPosition;
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
