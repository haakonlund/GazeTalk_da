import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout3_3x4 = (props) => {
  return (
    <KeyboardGrid {...props}  />
  );
};
Layout3_3x4.properties = {
  textAreaColSpan: 3,
  rows: 5,
  cols: 3,
};
export default Layout3_3x4;
