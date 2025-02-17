const globalCursorPosition = { value: 0 };
const cursorEventTarget = new EventTarget();

const updateGlobalCursorPosition = (newValue) => {
  globalCursorPosition.value = newValue;
  cursorEventTarget.dispatchEvent(new CustomEvent("cursorUpdated", { detail: newValue }));
};

export { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition };
