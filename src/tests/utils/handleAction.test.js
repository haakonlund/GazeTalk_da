import React, {useState} from 'react';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import '@testing-library/jest-dom';
import App from '../../App';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';
import { handleAction } from '../../util/handleAction';
import * as CmdConst from '../../constants/cmdConstants';

let initProps;
let initTextValue;


describe('Check ' + CmdConst.ENTER_LETTER, () => {
  let props;
  let textValue; 

  beforeEach(() => {
    textValue = "";
    const setTextValue = jest.fn((newText) => {
      textValue = newText;
    });

    let currentViewName = "";
    const setCurrentViewName = jest.fn((newView) => {
      currentViewName = newView;
    });

    const globalCursorPosition = { value: 0 };
    const updateGlobalCursorPosition = jest.fn((newPos) => {
      globalCursorPosition.value = newPos;
    });

    const input = {
      selectionStart: 0,
      focus: jest.fn(),
      setSelectionRange: jest.fn(),
    };

    const isCapsOn = false;
    const setIsCapsOn = jest.fn();
    const userData = {};
    const setUserData = jest.fn();
    const speakText = jest.fn();
    const alarmActive = false;
    const nextLetterSuggestion = null;
    const setAlarmActive = jest.fn();
    const isPaused = false;
    const setIsPaused = jest.fn();
    const setNextLetterSuggestion = jest.fn();
    const letterSuggestions = [];
    const setLetterSuggestions = jest.fn();
    const nextLetters = [];
    const setNextLetters = jest.fn();
    const suggestions = [];
    const setSuggestions = jest.fn();
    const buttonFontSize = 30;
    const setButtonFontSize = jest.fn();
    const textFontSize = 20;
    const setTextFontSize = jest.fn();
    const config = { views: {} };
    const currentLayoutName = "layout1";
    const setCurrentLayoutName = jest.fn();
    const setShowSuggestions = jest.fn();
    const showSuggestions = false;
    const changeButtonNum = jest.fn();
    const buttonNum = 6;
    const isTesting = false;
    const counterStarted = false;
    const startUserTest = jest.fn();
    const logEvent = jest.fn();
    const abandonTest = jest.fn();
    const dwellTime = 1500;
    const currentTestIndex = 0;

    props = {
      textValue,
      setTextValue,
      currentViewName,
      setCurrentViewName,
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
      currentLayoutName,
      setCurrentLayoutName,
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
    };
  });

  test('Inserting "a" to the text field', async () => {
    const action = { type: CmdConst.ENTER_LETTER, value: "a" };

    handleAction(action, props);

    expect(props.setTextValue).toHaveBeenCalledWith("a");

    expect(props.updateGlobalCursorPosition).toHaveBeenCalledWith(1);

    expect(props.logEvent).toHaveBeenCalledWith({ type: CmdConst.ENTER_LETTER, value: "a" });

    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.WRITING);

    expect(props.input.focus).toHaveBeenCalled();
  });
});


describe('Check ' + CmdConst.NEWLINE, () => {
  let props;
  let textValue; 

  beforeEach(() => {
    textValue = "";
    const setTextValue = jest.fn((newText) => {
      textValue = newText;
    });

    let currentViewName = "";
    const setCurrentViewName = jest.fn((newView) => {
      currentViewName = newView;
    });

    const globalCursorPosition = { value: 0 };
    const updateGlobalCursorPosition = jest.fn((newPos) => {
      globalCursorPosition.value = newPos;
    });

    const input = {
      selectionStart: 0,
      focus: jest.fn(),
      setSelectionRange: jest.fn(),
    };

    const isCapsOn = false;
    const setIsCapsOn = jest.fn();
    const userData = {};
    const setUserData = jest.fn();
    const speakText = jest.fn();
    const alarmActive = false;
    const nextLetterSuggestion = null;
    const setAlarmActive = jest.fn();
    const isPaused = false;
    const setIsPaused = jest.fn();
    const setNextLetterSuggestion = jest.fn();
    const letterSuggestions = [];
    const setLetterSuggestions = jest.fn();
    const nextLetters = [];
    const setNextLetters = jest.fn();
    const suggestions = [];
    const setSuggestions = jest.fn();
    const buttonFontSize = 30;
    const setButtonFontSize = jest.fn();
    const textFontSize = 20;
    const setTextFontSize = jest.fn();
    const config = { views: {} };
    const currentLayoutName = "layout1";
    const setCurrentLayoutName = jest.fn();
    const setShowSuggestions = jest.fn();
    const showSuggestions = false;
    const changeButtonNum = jest.fn();
    const buttonNum = 6;
    const isTesting = false;
    const counterStarted = false;
    const startUserTest = jest.fn();
    const logEvent = jest.fn();
    const abandonTest = jest.fn();
    const dwellTime = 1500;
    const currentTestIndex = 0;

    props = {
      textValue,
      setTextValue,
      currentViewName,
      setCurrentViewName,
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
      currentLayoutName,
      setCurrentLayoutName,
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
    };
  });

  test('Inserting "a" to the text field', async () => {
    props.textValue = "Hello";
    props.globalCursorPosition.value = 5;
    props.input.selectionStart = 5;

    const action = { type: CmdConst.NEWLINE };

    handleAction(action, props);
    expect(props.setTextValue).toHaveBeenCalledWith("Hello\n");
    expect(props.updateGlobalCursorPosition).toHaveBeenCalledWith(6);
    expect(props.logEvent).toHaveBeenCalledWith({ type: CmdConst.NEWLINE, value: "Hello\n" });
    expect(props.input.focus).toHaveBeenCalled();
  });
});
