import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout3_3x3 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};
Layout3_3x3.properties = {
  textAreaColSpan: 3,
  rows: 4,
  cols: 3,
};
export default Layout3_3x3;
