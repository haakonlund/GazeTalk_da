import React from 'react';
import { render, fireEvent, screen, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import Tile from '../components/Tile';


let tileLabel = "tileLabel";
let curAction = { type: "enter_letter", value: "A" };
// action: { type: "switch_layout", layout: "main_menu" }

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key) => key })
  }));

describe("Testing Tile component", () => {
    const onActivateMock = jest.fn();
    const tile = {
        label: tileLabel,        
        action: curAction,
        surroundingLetters: ["A", "B", "C", "D", "E", "F"]
    };

    beforeEach(() => {
        onActivateMock.mockClear();
    });

    test("Check label", () => {
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        expect(screen.getByText(tileLabel)).toBeInTheDocument();
    });

    test("Call onActivate", () => {
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        const tileDiv = screen.getByText(tileLabel).closest(".tile");
        fireEvent.click(tileDiv);
        expect(onActivateMock).toHaveBeenCalledWith(curAction);
    });

    test("Progress bar shows on hover", () => {
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        const tileDiv = screen.getByText(tileLabel).closest(".tile");

        // Simulate mouse hover
        fireEvent.mouseEnter(tileDiv);

        // Expect the progress bar to appear when hovering
        expect(tileDiv.querySelector(".progress-bar")).toBeInTheDocument();
    });

    test("Progress bar removed when exiting hover", () => {
        jest.useFakeTimers();
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        const tileDiv = screen.getByText(tileLabel).closest(".tile");

        // Simulate mouse hover
        fireEvent.mouseEnter(tileDiv);

        act(() => {
            jest.advanceTimersByTime(500); // Hovering for 0.5 seconds
        });

        // Stop Hovering
        fireEvent.mouseLeave(tileDiv);

        // Expect the progress bar to disappear when exiting hover
        expect(tileDiv.querySelector(".progress-bar")).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    test("Trigger onActivate after dwell time", () => {
        jest.useFakeTimers(); // For some reason only needed for this test
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        const tileDiv = screen.getByText(tileLabel).closest(".tile");
        fireEvent.mouseEnter(tileDiv); // Hovering
        
        act(() => {
            jest.advanceTimersByTime(1000); // Hovering for 1 second
        });
        
        //Check that onActivate was called with the correct action
        expect(onActivateMock).toHaveBeenCalledWith(curAction);

        jest.useRealTimers();
    });

    test("DON'T trigger onActivate before dwell time", () => {
        jest.useFakeTimers();
        render(<Tile tile={tile} onActivate={onActivateMock} dwellTime={1000} />);
        const tileDiv = screen.getByText(tileLabel).closest(".tile");

        fireEvent.mouseEnter(tileDiv); // Hovering

        act(() => {
            jest.advanceTimersByTime(500); // Hovering for 0.5 seconds
        });

        // Stop Hovering
        fireEvent.mouseLeave(tileDiv);

        // Check that onActivate was not called since hover time was less than dwell time
        expect(onActivateMock).not.toHaveBeenCalled();
        jest.useRealTimers();
    });
});