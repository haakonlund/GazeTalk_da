import { globalCursorPosition } from "../singleton/cursorSingleton";
export const getLastSentence = (text) => {
    let start = globalCursorPosition.value
    let punctuationCnt = 1
    while (start > 0 ) {
      if (text[start-1] === "." || text[start-1] === "!" || text[start-1] === "?") {
        punctuationCnt--;
        if (punctuationCnt === 0) {
          break;
        } 
      }
        start--;
    }
    return start
  };


export const matchCase = (suggestion, existingWord = "") => {
    if (!existingWord) return suggestion;
    if (existingWord[0] === existingWord[0].toUpperCase()) {
      return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    } else {
      return suggestion.toLowerCase();
    }
  };
export const getWordBoundaries = (text, cursorPosition) => {
    let start = cursorPosition;
    let end = cursorPosition;
  
    
    // get the left boundary
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }
  
    // get the right boundary
    while (end < text.length && !/\s/.test(text[end])) {
      end++;
    }
  
    return { x0: start, x1: end };
  };
  
  export const getCurrentLine = (currentLines, cursorPosition) => {
    let line = 0;
    for (let i = 0; i < cursorPosition; i++) {
      let currentLine = currentLines[line];
      for (let j = 0; j < currentLine.length; j++) {
        if (i >= cursorPosition) {
          break;
        }
        i++;
      }
      if ((i >= cursorPosition)) {
        break;
      } else {
        line++;
      }
    }
    return line;
  };
  
  export const getCharDistance = (currentLines, line) => {
    let previousDistance = 0;
    for (let i = 0; i < line; i++) {
      previousDistance += currentLines[i].length;
    }
    return previousDistance + line;
  };
  
  export const calcCursorDistance = (textValue, input, currentLines) => {
    let line = getCurrentLine(currentLines, input.selectionStart);
    return input.selectionStart - getCharDistance(currentLines, line);
  };
  
  export const deleteWordAtCursor = (textValue, cursorPosition) => {
    // const { x0, x1 } = getWordBoundaries(textValue, cursorPosition);



    let start = cursorPosition;
    let end = cursorPosition;

    // include all spaces
    // while (start > 0 && /\s/.test(textValue[start - 1])) {
    //   start--;
    // }
    // get the left boundary
    if (start > 0 && !/\s/.test(textValue[start - 1])) {
      while (start > 0 && !/\s/.test(textValue[start - 1])) {
            start--;
          }
           // move to the previous word
      while (start > 0 && /\s/.test(textValue[start - 1])) {
        start--;
      }
    } else {
      // move to the previous word
      while (start > 0 && /\s/.test(textValue[start - 1])) {
        start--;
      }

    }
   
    
  
    // get the right boundary
    while (end < textValue.length && !/\s/.test(textValue[end])) {
      end++;
    }

    let x0 = start;
    let x1 = end;


    const newText = textValue.slice(0, x0) + textValue.slice(x1, textValue.length);
    const newCursorPosition = cursorPosition - (x1 - x0) + (textValue.slice(0, x1).length - cursorPosition);
  
    return {
      newText,
      newCursorPosition
    };
  };
  
  export const deleteSentence = (textValue, cursorPosition) => {
    let start = cursorPosition;
    let end = start;
    
    if (start > 0 && (textValue[start - 1] === "." || textValue[start - 1] === "!" || textValue[start - 1] === "?")) {
        start--; 
    }
    while (start > 0 && !(textValue[start - 1] === "." || textValue[start - 1] === "!" || textValue[start - 1] === "?")) {
      start--;
    }
    while (end < textValue.length && !(textValue[end] === "." || textValue[end] === "!" || textValue[end] === "?")) {
      end++;
    }
    if (end < textValue.length && textValue[end] === "." || textValue[end] === "!" || textValue[end] === "?") {
      end++;
    }
  
    const newText = textValue.slice(0, start) + textValue.slice(end, textValue.length);
    const newCursorPosition = cursorPosition - (end - start) + (textValue.slice(0, end).length - cursorPosition);
  
    return {
      newText,
      newCursorPosition
    };
  };
  
  export const deleteSection = (textValue, cursorPosition) => {
    let start = cursorPosition;
    let end = start;
  
    while (start > 0 && !(textValue[start - 1] === "\n")) {
      start--;
    }
    while (end < textValue.length && !(textValue[end] === "\n")) {
      end++;
    }
    if (end < textValue.length && textValue[end] === "\n") {
      end++;
    }
  
    const newText = textValue.slice(0, start) + textValue.slice(end, textValue.length);
    const newCursorPosition = cursorPosition - (end - start) + (textValue.slice(0, end).length - cursorPosition);
  
    return {
      newText,
      newCursorPosition
    };
  };
  export const stripSpace = (arr) => {
    let newArr = []
    let offset = 0
    for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "space") {
        offset = 1;
        continue
    }
    newArr[i - offset] = arr[i];
    
    }
    return newArr;
}
// export const insertSuggestion = (action, textValue) => {
//     const suggestion = action.value;

//     const cursorPos = globalCursorPosition.value;
//     const textUpToCursor = textValue.slice(0, cursorPos);
//     const rest = textValue.slice(cursorPos, textValue.length);
//     const lastSpaceIndex = textUpToCursor.lastIndexOf(" ");
//     const lastWord = lastSpaceIndex >= 0
//       ? textUpToCursor.slice(lastSpaceIndex + 1)
//       : textUpToCursor;
//     const replaced = textUpToCursor.slice(0, textUpToCursor.length - lastWord.length);
//     const casedSuggestion = matchCase(suggestion, lastWord);
//     const newText = replaced + casedSuggestion + " " + rest;
//     return newText
//   }