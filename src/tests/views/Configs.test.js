import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import { config } from '../../config/config';
import '@testing-library/jest-dom';
import axios from 'axios';
import { act } from '@testing-library/react';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';

// Mock react-i18next to provide a simple translation function.
// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key) => key,
//     i18n: { changeLanguage: () => jest.fn() },
//   }),
// }));

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('axios');
jest.mock("@uidotdev/usehooks", () => ({
    useLocalStorage: (key, initialValue) => [
      {
        settings: {
          language: "en",  // Force a different language
          dwelltime: 1000,
          button_font_size: 40,  // Custom button font size
          text_font_size: 25,    // Custom text font size
        },
        ranking: {}, // Custom ranking
      },
      jest.fn(), // Mock setter function
    ],
  }));
  

describe('Checking configurations', () => {
    const settings = 
    beforeEach(() => {
        // For tests that do not need suggestions (static), we return empty arrays.
        axios.post.mockImplementation((url) => {
            if (url.includes("continuations")) {
            return Promise.resolve({ data: { continuations: [] } });
            }
            if (url.includes("lettercontinuations")) {
            return Promise.resolve({ data: { continuations: [] } });
            }
            return Promise.resolve({ data: {} });
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    const staticConfigs = [ // Some excluded as they contain special characters.
       // config.views["numbers2"],
        config.views["edit_language"],
        config.views["writing"],
        config.views["suggestions"],
        config.views["main_menu"],
        // config.views["writing_submenu"],
        config.views["navigation_menu"],
        config.views["edit_menu"],
        config.views["edit_dwelltime"],
        config.views["edit_settings"],
        config.views["more_function_menu"],
        config.views["ABCDEFGH_menu"],
        config.views["IJKLMNOP_menu"],
        config.views["QRSTUVWX_menu"],
        config.views["YZÆØÅ,?.._menu"],
        config.views["numbers"],
        //config.views["special_chars1"],
        //config.views["special_chars2"],
        //config.views["special_chars3"],
        config.views["adjust_font_size"],
        config.views["pause"]
    ];
    for (let i = 0; i < staticConfigs.length; i++) {
        test(`Static configuration: ${staticConfigs[i].name} renders correctly`, async () => {
            await act(async () => {
                render(
                  <UserBehaviourTestProvidor>
                    <App initialView={staticConfigs[i].name} />
                  </UserBehaviourTestProvidor>
                );
              });
            const textArea = document.getElementById('text_region');
            expect(textArea).toBeInTheDocument();
            const tiles = staticConfigs[i].tiles.filter(tile => tile.type !== 'textarea');
            tiles.forEach(tile => {
                if (tile.label.trim() !== "") {
                    expect(
                        screen.getByText((content, element) =>
                          element.classList.contains("label") &&
                          content.trim() === tile.label.trim()
                        )
                      ).toBeInTheDocument();
                }
            });
        });
    }
   
    /*
    test('Dynamic configuration: dynamic suggestions update App', async () => {
        // For dynamic suggestions, we simulate axios returning suggestion data.
        axios.post.mockImplementation((url) => {
        if (url.includes("continuations")) {
            return Promise.resolve({
            data: { continuations: ["suggestion1", "suggestion2", "suggestion3", "suggestion4"] },
            });
        }
        if (url.includes("lettercontinuations")) {
            return Promise.resolve({
            data: { continuations: ["L1", "L2", "L3", "L4", "L5", "L6"] },
            });
        }
        return Promise.resolve({ data: {} });
        });

        // For a dynamic scenario, we need to set textValue to something nonempty so that the suggestions endpoint is hit.
        // One approach is to simulate a user typing. For simplicity, assume App’s initial text is empty, but an effect
        // kicks off when textValue changes.
        // You can either simulate a keyboard event or directly update state via user interactions.
        // For this example, we assume the App’s effect will run after the component mounts.
        render(<App />);
        
        // Wait for the axios call to complete and for the dynamic suggestions to render.
        // (How suggestions appear in the UI depends on your App implementation; for instance, they might appear
        // in a tile or as part of a suggestions view.)
        await waitFor(() => {
        // For example, if your dynamic suggestions are rendered in a tile, check for one of the dummy suggestions:
        expect(screen.getByText("suggestion1")).toBeInTheDocument();
        expect(screen.getByText("suggestion2")).toBeInTheDocument();
        });
    });*/
});
