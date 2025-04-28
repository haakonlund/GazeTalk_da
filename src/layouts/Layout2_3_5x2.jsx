import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout2_3_5x2 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};
Layout2_3_5x2.properties = {
  textAreaColSpan: 2,
  rows: 3,
  cols: 5,
};
export default Layout2_3_5x2;
