import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_2_4x2 = (props) => {
  const textAreaColSpan = 2;
  const rows = 3;
  const cols = 4;
  return (
      <KeyboardGrid {...props} 
        textAreaColSpan={textAreaColSpan} 
        rows={rows} 
        cols={cols}  />
  );
};

export default Layout2_2_4x2;
