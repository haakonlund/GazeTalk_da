import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";
import Layout2_2_4x2 from "./Layout2_2_4x2";
import Layout3_3x3 from "./Layout3_3x3";
import Layout2_3_5x2 from "./Layout2_3_5x2";
import Layout2_3_5x3 from "./Layout2_3_5x3";
import Layout3_3x4 from "./Layout3_3x4";
import Layout4_4x4 from "./Layout4_4x4";
import Tracker_layout from "./tracker_layout"

const layouts = {
  "2+2+4x2": Layout2_2_4x2,
  "2+3+5x2": Layout2_3_5x2,
  "2+3+5x3": Layout2_3_5x3,
  "3+3x4": Layout3_3x4,
  "4+4x4": Layout4_4x4,
  "3+3x3": Layout3_3x3,
  "tracker" : Tracker_layout,
};

const LayoutPicker = ({ layout, view, textValue, setTextValue, handleAction, suggestions, letterSuggestions, dwellTime,buttonFontSize,textFontSize, nextLetters, getNext, handleLetterSelected, logEvent, counterStarted}) => {
  const LayoutComponent = layouts[layout];
  const { textAreaColSpan, rows, cols } = LayoutComponent.properties
  
  return (
    <div className="generic-view" data-layout={layout}>
      <Layout
        Component={LayoutComponent}
        textAreaColSpan={textAreaColSpan}
        rows={rows}
        cols={cols}
        view={view}
        textValue={textValue}
        setTextValue={setTextValue}
        onTileActivate={handleAction}
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
      <div
        data-testid="layout-metadata"
        data-textareacolspan={textAreaColSpan}
        data-rows={rows}
        data-cols={cols}
      />
    </div>
  );
};
const Layout = ({ Component, ...props }) => {
  return <Component {...props} />;
};
export default LayoutPicker;
