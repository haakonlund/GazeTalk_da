import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout4_4x4 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};

Layout4_4x4.properties = {
  textAreaColSpan: 4,
  rows: 5,
  cols: 4,
};
export default Layout4_4x4;
