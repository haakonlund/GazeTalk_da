import React, { useEffect, useRef } from "react";
import Tile from "./Tile";
import * as DataSavingSingleton from "../singleton/dataSavingSingleton";
const FormPopup = ({ onClose, dwellTime }) => {

  
  useEffect(() => {
    // Effect logic here
  }, []);
  const submit= () => {
    const data = {
      name: document.querySelector('.nameInput').value,
      device: document.querySelector('.deviceInput').value,
      screensize: document.querySelector('.screensizeInput').value,
      screen_resolution: window.screen.width + "x" + window.screen.height,
      
    }
    DataSavingSingleton.data.form_data = data
    onClose()
  }
  return (
    <div className="form-overlay">
      <div className="form-popup-content">
        <h2>Data form</h2> 
        <div>
          <p>Please enter your name</p>
          <input className="nameInput" type="text" placeholder="Name" />
        </div>
        <div>
          <p>Please write what device you are using </p>
          <input className="deviceInput" type="text" placeholder="iPad gen 10" />
          {/* <p>if you are using a computer please enter the screen resolution and the sceensize in inches </p>
          <input type="text" placeholder="1920x1080" /> */}
          Please enter the sceensize in inches 
          <input className="screensizeInput" type="text" placeholder="27" />
        </div>
        <div>
          <p>
              
          </p>
        </div>
        <button onClick={submit}>start test</button>
      </div>
      
      <style jsx>{`
        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .form-popup-content {
          background-color: #333;
          padding: 2rem;
          border-radius: 8px;
          width: 80%;
          max-width: 500px;
        }
        
        .form-popup-content h2,
        .form-popup-content p,
        .form-popup-content div {
          color: white;
          margin-bottom: 1rem;
        }
        
        .form-popup-content input {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          border: 1px solid #555;
          background-color: #444;
          color: white;
        }
        
        .form-popup-content button {
          background-color: #4CAF50;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .form-popup-content button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default FormPopup;