import React, {useState} from 'react';
import { render, fireEvent, screen, act  } from '@testing-library/react';
import KeyboardGrid from '../../components/KeyboardGrid';
import { config } from '../../config/config';
import '@testing-library/jest-dom';

// Holds the text value in a state and passes it to the KeyboardGrid.
const KeyboardGridWrapper = ({ initialValue, ...props }) => {
    const [textValue, setTextValue] = useState(initialValue || '');
    // Simple onTileActivate handler that appends the letter.
    const onTileActivate = (action) => {
      if (action && action.value) {
        setTextValue((prev) => prev + action.value);
      }
    };
    return (
      <KeyboardGrid
        {...props}
        textValue={textValue}
        setTextValue={setTextValue}
        onTileActivate={onTileActivate}
      />
    );
  };

// Get TextareaTile and Tile components.
jest.mock('../../components/TextAreaTile', () => (props) => (
  <div data-testid="textarea-tile">{props.value}</div>
));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key) => key })
}));


describe('KeyboardGrid component', () => {
  const dummyOnActivate = jest.fn();
  const dummySetTextValue = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Check Writing \"eat\"', () => {
    const layout = config.layouts.writing;
    const suggestions = [];
    const dwellTime = 1000;
    const letterSuggestions = ["e","t","a","space","o","i","r"];
    render(
      <KeyboardGridWrapper
        layout={layout}
        textValue=""
        setTextValue={dummySetTextValue}
        onTileActivate={dummyOnActivate}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        dwellTime={dwellTime}
      />
    );
    // Check Empty content in TextAreaTile
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent(''); //Resembles empty string for some reason

    // Click on e
    const tile1 = screen.getByText('e');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tile1); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tile1);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('e');

    // Click on a
    const tile2 = screen.getByText('a');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tile2); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tile2);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('ea');

    // Click on t
    const tile3 = screen.getByText('t');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tile3); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tile3);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('eat');
  });
});
