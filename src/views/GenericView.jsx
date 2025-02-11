import React from "react";
import KeyboardGrid from "../components/KeyboardGrid";

const GenericView = ({ layout, textValue, setTextValue, handleAction, suggestions }) => {
  return (
    <div className="generic-view">
      <KeyboardGrid 
        layout={layout} 
        textValue={textValue} 
        setTextValue={setTextValue} 
        onTileActivate={handleAction} 
        suggestions={suggestions}
      />
    </div>
  );
};

export default GenericView;
