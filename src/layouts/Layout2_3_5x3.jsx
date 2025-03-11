import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_3_5x3 = (props) => {
  const textAreaColSpan = 2;
  const rows = 4;
  const cols = 5;
  return (
      <KeyboardGrid {...props} 
        textAreaColSpan={textAreaColSpan} 
        rows={rows} 
        cols={cols}  />
  );
};

export default Layout2_3_5x3;
