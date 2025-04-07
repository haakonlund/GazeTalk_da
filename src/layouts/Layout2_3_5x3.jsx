import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_3_5x3 = (props) => {
  return (
    <KeyboardGrid {...props}  />
  );
};
Layout2_3_5x3.properties = {
  textAreaColSpan: 2,
  rows: 4,
  cols: 5,
};
export default Layout2_3_5x3;
