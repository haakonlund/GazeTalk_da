import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout2_4_6x5 = (props) => {
  return (
    <KeyboardGridV1 {...props}  />
  );
};
Layout2_4_6x5.properties = {
  textAreaColSpan: 2,
  rows: 6,
  cols: 6,
};
export default Layout2_4_6x5;
