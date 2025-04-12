import React, {useState} from 'react';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import '@testing-library/jest-dom';
import App from '../../App';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';
import * as CmdConst from "../../constants/cmdConstants";
import { handleActionWrapper } from '../../App';

HTMLMediaElement.prototype.play = () => Promise.resolve();

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

describe('Check ' + CmdConst.ENTER_LETTER, () => {
  test('Inserting "a" to the text field', async () => {
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
        <App initialView="writing" initialLayout="2+3+5x3"  />
      </UserBehaviourTestProvidor>
    );
    await waitFor(() => {
        const tileElements = document.querySelectorAll(".tile");
        expect(tileElements.length).toBe(18); 
    });
    expect(screen.getByTestId('textarea-tile')).toHaveTextContent('')
    const action = { type: CmdConst.ENTER_LETTER, value: "a" };
    
    //handleActionWrapper(action);
    //expect(screen.getByTestId('textarea-tile')).toHaveTextContent('a')
  });
});
