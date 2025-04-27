import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout2_3_5x3 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};
Layout2_3_5x3.properties = {
  textAreaColSpan: 2,
  rows: 4,
  cols: 5,
};
export default Layout2_3_5x3;
