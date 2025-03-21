import React, { createContext, useContext, useState, useRef } from 'react';
import { testSentences, minimumNumberOfKeystrokes } from '../constants/testConstants';
import * as CmdConst from "../constants/cmdConstants";
import * as TestConst from "../constants/testConstants";
const UserBehaviourTest = createContext();

export const UserBehaviourTestProvidor = ({ children }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testStartTime, setTestStartTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef([]);
  const completeTestLogs = useRef([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1); 
  const [targetSentence, setTargetSentence] = useState("");
  const [counterStarted, setCounterStarted] = useState(false);

  const initTest = (id) => {
    if (id > testSentences.length - 1) {
      completeTests();
      return;
    }
    console.log("Test sentence: ", testSentences[id]);
    if (id === 0 ) {
      setIsTesting(true);
      setLogs([]); // clear previous logs
    }
    setCurrentTestIndex(id);
    setTargetSentence(testSentences[id]);
    setCounterStarted(false);
  }

  // Function to start the test
  const startTest = () => {
    setTestStartTime(Date.now());
    setCounterStarted(true);
  };


  // Function to end the test
  const endTest = () => {
    if (counterStarted) {
      const duration = Date.now() - testStartTime;
      const newAddition = { type: "finished_test", testIndex: currentTestIndex, targetSentence, duration };
      const updatedLogs = [...logsRef.current, newAddition];
      console.log(`Test ${currentTestIndex} completed. Collected logs:`, updatedLogs);
      const metrics = calculateMetrics(updatedLogs);
      const metricsEvent = metrics ? { type: "metrics", ...metrics } : null;
      const finalLogs = metricsEvent ? [...updatedLogs, metricsEvent] : updatedLogs;
      completeTestLogs.current.push(finalLogs);
      logsRef.current = [];
      setLogs([]);
      setCounterStarted(false);
    }
  };

  const completeTests = () => {
    setIsTesting(false);
    const dataToDownload = JSON.stringify(completeTestLogs, null, 2);
    const filename = `test_run_${Date.now()}.json`;
    downloadTestData(dataToDownload, filename);
    completeTestLogs.current = [];
    setCurrentTestIndex(-1);
    setTargetSentence("");
  };
  const cancelTest = () => {
    setIsTesting(false);
    setCurrentTestIndex(-1);
    setTargetSentence("");
    setCounterStarted(false);
    completeTestLogs.current = [];
    logsRef.current = [];
    console.log("Test reset");
  };

  // Generic event logging function
  const logEvent = (event) => {
    if (!isTesting) {
      setLogs(prevLogs => [
        ...prevLogs
      ]);
    } else {
      console.log("LOGGING: ", event);
      logsRef.current.push({ ...event, timestamp: new Date().toISOString() });
      setLogs(prevLogs => [
        ...prevLogs,
        { ...event, timestamp: new Date().toISOString() },
      ]);
    }
  };

  const calculateMetrics = (logs) => {
    console.log(`Test ${currentTestIndex} completed. Collected logs:`, logs);
    const testEndLog = logs.find(log => log.duration !== undefined);
    const submittedTextLog = logs.find(log => log.submittedText  !== undefined);
    const submittedText = submittedTextLog ? submittedTextLog.submittedText : "";
    if (!testEndLog) {console.log("No log with duration found"); return;}
    const durationMinutes = testEndLog.duration / 60000;
    const charactersTyped = targetSentence.length - 1; // -1 to account for the space at the end

    // WPM
    const WPM = (charactersTyped) / (durationMinutes * 5);
    // KSPC 
    const numberOfKeystrokes = logs.filter(e =>
      e.type === CmdConst.ENTER_LETTER || 
      e.type === CmdConst.NEWLINE ||
      e.type === CmdConst.SWITCH_VIEW ||
      e.type === CmdConst.DELETE_LETTER ||
      e.type === CmdConst.DELETE_LETTER_EDIT ||
      e.type === CmdConst.DELETE_WORD ||
      e.type === CmdConst.DELETE_SENTENCE ||
      e.type === CmdConst.DELETE_SECTION ||
      e.type === CmdConst.CURSOR ||
      e.type === CmdConst.START_OF_TEXT ||
      e.type === CmdConst.PREVIOUS_SECTION ||
      e.type === CmdConst.PREVIOUS_SENTENCE ||
      e.type === CmdConst.PREVIOUS_WORD ||
      e.type === CmdConst.END_OF_TEXT ||
      e.type === CmdConst.NEXT_SECTION ||
      e.type === CmdConst.NEXT_SENTENCE ||
      e.type === CmdConst.NEXT_WORD ||
      e.type === CmdConst.SHOW_SUGGESTIONS ||
      e.type === CmdConst.INSERT_SUGGESTION ||
      e.type === CmdConst.INSERT_LETTER_SUGGESTION 
    ).length;
    const KSPC = charactersTyped > 0 ? (numberOfKeystrokes / charactersTyped) : 0;
    
    //MSDErrorRate
    const MSD = levenshtein(submittedText.trim(), targetSentence.trim());
    const MSDErrorRate = MSD / charactersTyped;

    //OR
    const OR = numberOfKeystrokes / minimumNumberOfKeystrokes[targetSentence];
    //RBA
    const numberOfDeletions = logs.filter(e =>
      e.type === CmdConst.DELETE_LETTER ||
      e.type === CmdConst.DELETE_LETTER_EDIT ||
      e.type === CmdConst.DELETE_WORD ||
      e.type === CmdConst.DELETE_SENTENCE ||
      e.type === CmdConst.DELETE_SECTION
    ).length;
    const RBA = numberOfDeletions / charactersTyped;
    //RTE
    const numberOfGazesToTextField = logs.filter(e =>
      e.type === TestConst.TEXT_AREA_GAZED
    ).length;
    const RTE = numberOfGazesToTextField / charactersTyped;

    //ANSR
    const numberOfAttendedButNotSelected = logs.filter(e =>
      e.type === TestConst.TILE_GAZED_NOT_SELECTED 
    ).length;
    const ANSR = numberOfAttendedButNotSelected / charactersTyped;

    console.log("WPM: ", WPM);
    console.log("KSPC: ", KSPC);
    console.log("MSDErrorRate: ", MSDErrorRate);
    console.log("OR: ", OR);
    console.log("RBA: ", RBA);
    console.log("RTE: ", RTE);
    console.log("ANSR: ", ANSR);
    return { WPM, KSPC, MSDErrorRate, OR, RBA, RTE, ANSR };
  };

  function levenshtein (a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    if (a[0] === b[0]) {
      return levenshtein(a.slice(1), b.slice(1));
    }

    const insertDist = levenshtein(a, b.slice(1));
    const deleteDist = levenshtein(a.slice(1), b);
    const replaceDist = levenshtein(a.slice(1), b.slice(1));

    return 1 + Math.min(insertDist, deleteDist, replaceDist);
  } 

  const downloadTestData  = (data, filename) => {
    const blob = new Blob([data], { type: "application/json;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <UserBehaviourTest.Provider
      value={{
        isTesting,
        currentTestIndex,
        targetSentence,
        counterStarted,
        initTest,
        startTest,
        endTest,
        completeTests,
        logEvent,
        setLogs,
        logs,
        cancelTest,
      }}
    >
      {children}
    </UserBehaviourTest.Provider>
  );
};

// Custom hook to use the Testing context
export const useTesting = () => {
  return useContext(UserBehaviourTest);
};
