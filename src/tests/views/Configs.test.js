import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import { config } from '../../config/config';
import '@testing-library/jest-dom';
import axios from 'axios';
import { act } from '@testing-library/react';

// Mock react-i18next to provide a simple translation function.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

jest.mock('axios');

describe('Checking configurations', () => {

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
       // config.layouts["numbers2"],
        config.layouts["edit_language"],
        config.layouts["writing"],
        config.layouts["suggestions"],
        config.layouts["main_menu"],
        config.layouts["writing_submenu"],
        config.layouts["navigation_menu"],
        config.layouts["edit_menu"],
        config.layouts["edit_dwelltime"],
        config.layouts["edit_settings"],
        config.layouts["more_function_menu"],
        config.layouts["ABCDEFGH_menu"],
        config.layouts["IJKLMNOP_menu"],
        config.layouts["QRSTUVWX_menu"],
        config.layouts["YZÆØÅ,?.._menu"],
        config.layouts["numbers"],
        //config.layouts["special_chars1"],
        //config.layouts["special_chars2"],
        //config.layouts["special_chars3"],
        config.layouts["adjust_font_size"],
        config.layouts["pause"]
    ];
    for (let i = 0; i < staticConfigs.length; i++) {
        test(`Static configuration: ${staticConfigs[i].name} renders correctly`, async () => {
            await act(async () => {
                render(<App initialLayout={staticConfigs[i].name} />);
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
