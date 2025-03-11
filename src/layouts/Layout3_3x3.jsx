import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout3_3x3 = (props) => {
  const textAreaColSpan = 3;
  const rows = 4;
  const cols = 3;
  return (
      <KeyboardGrid {...props} 
        textAreaColSpan={textAreaColSpan} 
        rows={rows} 
        cols={cols}  />
  );
};

export default Layout3_3x3;
