import React from 'react';
import { render } from '@testing-library/react';
import TextAreaTile from '../../components/TextAreaTile';
import { globalCursorPosition, cursorEventTarget } from '../../cursorSingleton';

const cursorPosition = 0;

// Ensure the global cursor position is set to a known value before each test.
beforeEach(() => {
  globalCursorPosition.value = cursorPosition;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TextAreaTile component', () => {

  test('Check selection/focus called on mount and when text updated', () => {
    // Spy the methods
    const setSelectionRangeSpy = jest.spyOn(HTMLTextAreaElement.prototype, 'setSelectionRange');
    const focusSpy = jest.spyOn(HTMLTextAreaElement.prototype, 'focus');

    // Render component
    const { rerender } = render(<TextAreaTile value="initial" />);
    
    expect(setSelectionRangeSpy).toHaveBeenCalledWith(cursorPosition, cursorPosition);
    expect(focusSpy).toHaveBeenCalled();

    // Simulate text in text area being updated
    rerender(<TextAreaTile value="updated" />);
    // Check methods are called again after update
    expect(setSelectionRangeSpy).toHaveBeenNthCalledWith(2, cursorPosition, cursorPosition);
    expect(focusSpy).toHaveBeenCalledTimes(2);
  });

  test('Check selection/focus updates when "handleCursorUpdate" is called', () => {
    // Spy the methods.
    const setSelectionRangeSpy = jest.spyOn(HTMLTextAreaElement.prototype, 'setSelectionRange');
    const focusSpy = jest.spyOn(HTMLTextAreaElement.prototype, 'focus');

    // Render component.
    render(<TextAreaTile value="example" />);

    // Clear calls since we only care about calls after event
    setSelectionRangeSpy.mockClear();
    focusSpy.mockClear();

    // Call cursorUpdated event.
    const event = new Event('cursorUpdated');
    cursorEventTarget.dispatchEvent(event);

    // Checks the methods have been called 1 with the correct arguments
    expect(setSelectionRangeSpy).toHaveBeenNthCalledWith(1, cursorPosition, cursorPosition);
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
