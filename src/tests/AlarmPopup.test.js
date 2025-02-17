// AlarmPopup.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlarmPopup from '../components/AlarmPopup';

// Render the Tile component since it's used by the AlarmPopup
jest.mock('../components/Tile', () => (props) => {
  return (
    <button onClick={props.onActivate}>
      {props.tile.label}
    </button>
  );
});

describe('AlarmPopup component', () => {
    //Idk I can only get play using this precondition
    beforeAll(() => {
        HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
    });

    test('Check AlarmPopup content', () => {
        render(<AlarmPopup onClose={jest.fn()} />);
        expect(screen.getByText('Alarm playing')).toBeInTheDocument();
        expect(screen.getByText('Do you want to stop it?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    test('Check audio playing', () => {
        //Used to find play attribute
        const playSpy = jest
            .spyOn(window.HTMLMediaElement.prototype, 'play')
            .mockImplementation(() => Promise.resolve());

        const { container } = render(<AlarmPopup onClose={jest.fn()} />);
        const audio = container.querySelector('audio');
        expect(audio).toBeInTheDocument();
        expect(audio).toHaveAttribute('src', '/alarm.mp3');
        expect(audio).toHaveAttribute('autoPlay');
        expect(audio).toHaveAttribute('loop');
        expect(playSpy).toHaveBeenCalled();
        playSpy.mockRestore();
    });

    test('Check AlarmPopup gone when closing', () => {
        const onCloseMock = jest.fn();
        render(<AlarmPopup onClose={onCloseMock} />);
        const tileButton = screen.getByText('Yes');
        fireEvent.click(tileButton);
        expect(onCloseMock).toHaveBeenCalled();
    });
});
