import React from "react";
import KeyboardGridV2 from "../components/KeyboardGridV2";
const KeyboardLayoutV2_4x3 = (props) => {
  return (
      <KeyboardGridV2 {...props}  />
  );
};

KeyboardLayoutV2_4x3.properties = {
  cols: 3,
};

export default KeyboardLayoutV2_4x3;
