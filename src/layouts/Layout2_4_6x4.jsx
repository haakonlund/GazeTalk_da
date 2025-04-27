import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout2_4_6x4 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};
Layout2_4_6x4.properties = {
  textAreaColSpan: 2,
  rows: 5,
  cols: 6,
};
export default Layout2_4_6x4;
