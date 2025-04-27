import React from "react";
import KeyboardGridV1 from "../components/KeyboardGridV1";

const Layout2_2_4x2 = (props) => {
  return (
      <KeyboardGridV1 {...props}  />
  );
};

Layout2_2_4x2.properties = {
  textAreaColSpan: 2,
  rows: 3,
  cols: 4,
};

export default Layout2_2_4x2;
