import React, {useState} from 'react';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import '@testing-library/jest-dom';
import App from '../../App';
import { updateGlobalCursorPosition, globalCursorPosition } from '../../singleton/cursorSingleton';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';
jest.mock("axios");

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('../../components/TextAreaTile', () => (props) => (
  <textarea 
    id="text_region" 
    data-testid="textarea-tile" 
    readOnly 
    value={props.value} 
    style={props.style}
  />
));

describe('Word Suggestion Writing', () => {
  const dwellTime = 2000;
  test('Check Writing \"i have no clue about *this*\"', async () => {
    axios.post.mockImplementation(async (url, data) => {
      if (url.includes("continuations")) {
        return {
          data: {
            continuations: ["the", "it", "this", "if", "is", "what", "for", "can", "are", "that", "no", "yes", "not", "i"]
          }
        };
      }
      if (url.includes("lettercontinuations")) {
        return {
          data: {
            continuations: "etaoinshrlcd"
          }
        };
      }
      return { data: { continuations: [] } };
    });
  
    render(
      <UserBehaviourTestProvidor>
        <App initialView="writing" initialLayout="2+2+4x2" initialText="i have no clue about " />
      </UserBehaviourTestProvidor> 
    );

    updateGlobalCursorPosition("i have no clue about ".length);
    await waitFor(() => {
      expect(globalCursorPosition.value).toBe("i have no clue about ".length);
    });

    await waitFor(() => {
      const tileElements = document.querySelectorAll(".tile");
      expect(tileElements.length).toBe(10);
    });
    expect(screen.getByTestId('textarea-tile')).toHaveValue('i have no clue about ');

    const tiles = screen.getAllByRole('button', { name: /this/i });
    const suggestionTile = tiles.find(tile => tile.textContent.trim() === "this");
    expect(suggestionTile).toBeInTheDocument();

    jest.useFakeTimers();
    fireEvent.mouseEnter(suggestionTile); 
    act(() => {
        jest.advanceTimersByTime(dwellTime * 2); 
    });
    fireEvent.mouseLeave(suggestionTile);
    jest.useRealTimers();

    const thisTile = screen.getByText('this');
    fireEvent.mouseEnter(thisTile); 
    act(() => {
        jest.advanceTimersByTime(dwellTime); 
    });
    fireEvent.mouseLeave(thisTile);
    jest.useRealTimers();

    await waitFor(() => {
      expect(screen.getByTestId('textarea-tile')).toHaveValue('i have no clue about this');
    });
  });
});

