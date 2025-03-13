import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout4_4x4 = (props) => {
  return (
    <KeyboardGrid {...props}  />
  );
};

Layout4_4x4.properties = {
  textAreaColSpan: 4,
  rows: 5,
  cols: 4,
};
export default Layout4_4x4;
