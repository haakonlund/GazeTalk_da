import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const KeyboardLayout4x4 = (props) => {
  return (
      <KeyboardGrid {...props}  />
  );
};

KeyboardLayout4x4.properties = {
  textAreaColSpan: 4,
  rows: 4,
  cols: 4,
};

export default KeyboardLayout4x4;
