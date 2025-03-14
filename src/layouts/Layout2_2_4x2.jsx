import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_2_4x2 = (props) => {
  return (
      <KeyboardGrid {...props}  />
  );
};

Layout2_2_4x2.properties = {
  textAreaColSpan: 2,
  rows: 3,
  cols: 4,
};

export default Layout2_2_4x2;
