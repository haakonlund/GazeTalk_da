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

  test('Check Writing ABC ', () => {
    const layout = config.layouts.writing;
    const suggestions = [];
    const dwellTime = 1000;
    render(
      <KeyboardGridWrapper
        layout={layout}
        textValue=""
        setTextValue={dummySetTextValue}
        onTileActivate={dummyOnActivate}
        suggestions={suggestions}
        dwellTime={dwellTime}
      />
    );
    // Check Empty content in TextAreaTile
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent(''); //Resembles empty string for some reason

    // Click on A
    const tileA = screen.getByText('A');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tileA); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tileA);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('A');

    // Click on B
    const tileB = screen.getByText('B');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tileB); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tileB);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('AB');

    // Click on C
    const tileC = screen.getByText('C');
    jest.useFakeTimers();
    fireEvent.mouseEnter(tileC); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(tileC);
    jest.useRealTimers();

    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('ABC');
  });
});
