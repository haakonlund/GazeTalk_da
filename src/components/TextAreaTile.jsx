import React, { useEffect, useRef } from "react";
import globalCursorPosition from "../cursorSingleton";

const TextAreaTile = ({ value, onChange, colspan=2 }) => {
    const inputRef = useRef(null);
    const handleChange = (e) => {
        const cursorPos = e.target.selectionStart;
        onChange(e.target.value);
        globalCursorPosition.value = cursorPos;
    };
  
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
            inputRef.current.focus(); 
        }
    }, [value]);
  
    return (
      <div className="tile textarea-tile" style={{gridColumn: `span ${colspan}`}}>
        <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            id="text_region" 
        />
      </div>
    );
  }

export default TextAreaTile;
