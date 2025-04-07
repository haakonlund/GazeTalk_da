import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const Layout2_4_6x5 = (props) => {
  return (
    <KeyboardGrid {...props}  />
  );
};
Layout2_4_6x5.properties = {
  textAreaColSpan: 2,
  rows: 6,
  cols: 6,
};
export default Layout2_4_6x5;
