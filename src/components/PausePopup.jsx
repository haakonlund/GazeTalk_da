import React from "react";
import Tile from "./Tile";
import * as CmdConst from "../constants/cmdConstants";

const PausePopup = ({isPaused, onActivate, dwellTime}) => {
    if (isPaused) {
        return (
            <div className="pause-overlay">
                <div className="pause-popup-content">
                    <h2>Paused</h2>
                    <Tile
                        tile={{ 
                            label: 'Unpause', 
                            action: { type: CmdConst.TOGGLE_PAUSE }, 
                            customStyle: { fontSize: '3rem', padding: '30px 50px' } 
                        }}
                        onActivate={() => onActivate( { type: CmdConst.TOGGLE_PAUSE })}
                        dwellTime={dwellTime}
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
  }

export default PausePopup;
