import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout4_4x4 = (props) => {
  const textAreaColSpan = 4;
  const rows = 5;
  const cols = 4;
  return (
      <KeyboardGrid {...props} 
        textAreaColSpan={textAreaColSpan} 
        rows={rows} 
        cols={cols}  />
  );
};

export default Layout4_4x4;
