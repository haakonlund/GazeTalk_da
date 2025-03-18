import React, {useState} from 'react';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import '@testing-library/jest-dom';
import App from '../../App';
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

describe('Single Letter Writing', () => {
  const dwellTime = 2000;
  test('Check Writing \"eat\"', async () => {
    axios.post.mockImplementation(async (url, data) => {
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
        <App initialView="writing" initialLayout="2+2+4x2" />
      </UserBehaviourTestProvidor> 
    );
    await waitFor(() => {
        const tileElements = document.querySelectorAll(".tile");
        expect(tileElements.length).toBe(10); 
    });
    // Check Empty content in TextAreaTile
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('')

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
