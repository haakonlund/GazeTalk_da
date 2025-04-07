import { globalCursorPosition } from "../singleton/cursorSingleton";

export const getPreviousSection = (textValue) => {
    let start = globalCursorPosition.value;
    while (start > 0 && !(textValue[start - 1] === "\n")) {
      start--;
    }
    if (start > 0 && (textValue[start - 1] === "\n")) start--;
    return start;
}
export const getNextWord = (textValue) =>{
  let end = globalCursorPosition.value;
  while (end < textValue.length && textValue[end] !== " ") {
    end++;
  }
  if (end < textValue.length && textValue[end] === " ") end++;
  return end;
}
export const getNextSentence=(textValue) =>{
  let end = globalCursorPosition.value;
  while (end < textValue.length && textValue[end] !== ".") {
    end++;
  }
  if (end < textValue.length && textValue[end] === ".") {
    end++;
  }
  return end;
}
export const getNextSection=(textValue)=> {
  let end = globalCursorPosition.value;
  while (end < textValue.length && textValue[end] !== "\n") {
    end++;
  }
  if (end < textValue.length && textValue[end] === "\n") end++;
  return end;
}
export const getPreviousWord=(textValue)=> {
  let start = globalCursorPosition.value;
  while (start > 0 && textValue[start - 1] !== " ") {
    start--;
  }
  if (start > 0 && textValue[start - 1] === " ") start--;
  return start;
}
export const getPreviousSentence=(textValue)=> {
  let start = globalCursorPosition.value;
  while (start > 0 && !(textValue[start - 1] === ".")) {
    start--;
  }
  if (start > 0 && textValue[start - 1] === ".") start--;
  return start;
}