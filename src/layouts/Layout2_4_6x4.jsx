import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_4_6x4 = (props) => {
  return (
    <KeyboardGrid {...props}  />
  );
};
Layout2_4_6x4.properties = {
  textAreaColSpan: 2,
  rows: 5,
  cols: 6,
};
export default Layout2_4_6x4;
