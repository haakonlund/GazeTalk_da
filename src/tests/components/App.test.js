import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import '@testing-library/jest-dom';
import axios from 'axios';
import { act } from '@testing-library/react';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';
// Optionally, if your App uses axios, you can mock it:
jest.mock('axios');


jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));
  
  
  
  describe('App component', () => {
    test('Check rendering of homepage "main_menuConfig" ', async () => {
        // Make some dummy values for post request.
        axios.post.mockResolvedValue({ data: { continuations: ["dummy1", "dummy2", "dummy3", "dummy4"] } });
        await act(async () => {
          render(
          <UserBehaviourTestProvidor>
            <App />
          </UserBehaviourTestProvidor> 
          );
        });
        
        // Check that the text area is present.
        await waitFor(() => {
            const textArea = document.getElementById('text_region');
            expect(textArea).toBeInTheDocument();
            expect(textArea.value).toBe('');
          });
        
        const tileElements = screen.getAllByText((content, element) =>
            element.classList.contains('tile')
        );
        expect(tileElements.length).toBeGreaterThan(0);
    });
});

