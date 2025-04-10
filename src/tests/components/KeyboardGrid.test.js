import React from 'react';
import { render, screen } from '@testing-library/react';
import KeyboardGrid from '../../components/KeyboardGrid';
import { config } from '../../config/config';
import '@testing-library/jest-dom';

// Get TextareaTile and Tile components.
jest.mock('../../components/TextAreaTile', () => (props) => (
  <div data-testid="textarea-tile">{props.value}</div>
));

jest.mock('../../components/Tile', () => (props) => (
  <div
    data-testid="tile"
    data-label={props.tile.label}
    data-dwell={props.dwellTime}
    onClick={props.onActivate}
  >
    {props.tile.label}
  </div>
));

describe('KeyboardGrid component', () => {
  const dummyOnActivate = jest.fn();
  const dummySetTextValue = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Check KeyboardGrid renders suggestions in suggestion button using writing config', () => {
    const view = config.views.writing;
    const suggestions = ["lot", "good", "problem", "great", "very", "nice", "look", "few"];
    const letterSuggestions = ["e","t","a","space","o","i","r"];
    render(
      <KeyboardGrid
        view={view}
        textValue=""
        setTextValue={dummySetTextValue}
        onTileActivate={dummyOnActivate}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={letterSuggestions}
        dwellTime={1000}
      />
    );

    // Check Empty content in TextAreaTile
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent(''); //Resembles empty string for some reason

    // Check number of Tiles
    const renderedTiles = screen.getAllByTestId('tile');
    expect(renderedTiles.length).toBe(10);
  });

  test('Check KeyboardGrid renders with suggestions in suggestion button using writing config', () => {
    const view = config.views.writing;
    const suggestions = ["lot", "good", "problem", "great", "very", "nice", "look", "few"];
    const letterSuggestions = ["e","t","a","o","i","r"];
    const nextLetters = [
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"],
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"]
    ];
    render(
      <KeyboardGrid
        view={view}
        textValue="hello i have a "
        setTextValue={dummySetTextValue}
        onTileActivate={dummyOnActivate}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={nextLetters}
        dwellTime={1000}
      />
    );

    // Check Empty content in TextAreaTile
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('hello i have a'); 

    // Check Tiles' values
    const renderedTiles = screen.getAllByTestId('tile');
    expect(renderedTiles.length).toBe(10);
    // Check labels.
    expect(renderedTiles[0]).toHaveAttribute('data-label', 'DELETE');
    expect(renderedTiles[1]).toHaveAttribute('data-label', 'ABCD...');
    expect(renderedTiles[2]).toHaveAttribute('data-label', 'lot\ngood\nproblem\ngreat');
    expect(renderedTiles[3]).toHaveAttribute('data-label', 'e');
    expect(renderedTiles[4]).toHaveAttribute('data-label', 't');
    expect(renderedTiles[5]).toHaveAttribute('data-label', 'a');
    expect(renderedTiles[6]).toHaveAttribute('data-label', 'space');
    expect(renderedTiles[7]).toHaveAttribute('data-label', 'o');
    expect(renderedTiles[8]).toHaveAttribute('data-label', 'i');
    expect(renderedTiles[9]).toHaveAttribute('data-label', 'r');
  });

  test('Check KeyboardGrid renders with suggestions using writing config', () => {
    // When view.name is "suggestions", an extra mapping is done over the suggestions array.
    const view = config.views.suggestions;
    const suggestions = ["lot", "good", "problem", "great", "very", "nice", "look", "few"];
    const letterSuggestions = ["e","t","a","space","o","i","r"];
    
    render(
      <KeyboardGrid
        view={view}
        textValue="hello i have a "
        setTextValue={dummySetTextValue}
        onTileActivate={dummyOnActivate}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        dwellTime={1000}
      />
    );

    const suggestionTiles = screen.getAllByTestId('tile');
    expect(suggestionTiles.length).toBe(10);

    // Check labels.
    expect(suggestionTiles[0]).toHaveAttribute('data-label', 'DELETE');
    expect(suggestionTiles[1]).toHaveAttribute('data-label', 'back');
    expect(suggestionTiles[2]).toHaveAttribute('data-label', 'lot');
    expect(suggestionTiles[3]).toHaveAttribute('data-label', 'good');
    expect(suggestionTiles[4]).toHaveAttribute('data-label', 'problem');
    expect(suggestionTiles[5]).toHaveAttribute('data-label', 'great');
    expect(suggestionTiles[6]).toHaveAttribute('data-label', 'very');
    expect(suggestionTiles[7]).toHaveAttribute('data-label', 'nice');
    expect(suggestionTiles[8]).toHaveAttribute('data-label', 'look');
    expect(suggestionTiles[9]).toHaveAttribute('data-label', 'few');
  });
});
