import React, { useEffect, useState, useRef } from "react";
import "./TrackerLayout.css";
import KeyboardGrid from "../components/KeyboardGrid";
import * as DA from "../util/dataAnalysis.js"
import { useLocalStorage } from "@uidotdev/usehooks";
import { getDeviceType } from "../util/deviceUtils.js";
import { calculateAccuracy, calculatePrecision } from "../util/dataAnalysis.js";
const TrackerLayout = (props) => {
    const logInterval = 5;
    const transitionTime = 2000;
    
    const handleAction = props.onTileActivate; // Destructure handleAction from props
    const screenPoints = [
        { top: "10%", left: "10%" },     // Top-left
        { top: "30%", left: "30%" },   // Top-left (inner)
        { top: "10%", left: "50%" },    // Top-center
        { top: "30%", left: "65%" },   // Top-right (inner)
        { top: "10%", left: "85%" },    // Top-right
        { top: "50%", left: "85%" },   // Middle-right
        { top: "85%", left: "85%" },   // Bottom-right
        { top: "65%", left: "65%" },   // Bottom-right (inner)
        { top: "85%", left: "50%" },   // Bottom-center
        { top: "65%", left: "30%" },   // Bottom-left (inner)
        { top: "85%", left: "10%" },    // Bottom-left
        { top: "50%", left: "10%" },    // Middle-left
        { top: "50%", left: "50%" },   // Center
    ];

    const isStarted = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(0);
    const [scale, setScale] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const animationRef = useRef(null);
    const timeoutRefs = useRef([]);
    const containerRef = useRef(null);
    const [prevoiusLargest, setPrevoiusLargest] = useState(-1);


    const eyeTrackingData = "eyeTrackingData"
    const [trackingData, setTrackingData] = useState(
        {
            start_of_test : Date.now(),
            end_of_test : 0,
            device: "",
            tracking_points: {
                x: [],
                y: [],
                is_shrinking: [],
                fixation_x: [],
                fixation_y: [],
                timestamp: [],
                fixation_index: [],
            },
            screen_width : window.innerWidth,
            screen_height : window.innerHeight,
            points: screenPoints,
    });

    // Clear all timeouts
    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutRefs.current = [];

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    // Handle point transitions
    useEffect(() => {
        const initialWaitTime = 5000; // 5 seconds initial wait time
        const waitTime = 2000; // 2 seconds wait time
        const shrinkTime = transitionTime - 800; // Leave 800ms buffer before next point
    
        const moveToNextPoint = () => {
            // Cancel any ongoing animations and timeouts
            clearAllTimeouts();
    
            // Reset scale before moving to next point
            setScale(1);
    
            // Move to next point
            const newIndex = (currentIndexRef.current + 1) % screenPoints.length;
            setCurrentIndex(newIndex);
            currentIndexRef.current = newIndex;
    
            if (newIndex === 0) {
                console.log("COMPLETE")
                setIsComplete(true);
                calculateStats();
                switchToMainMenu();
                return; // Stop transitions when reaching the last point
            }
    
            // Wait for 2 seconds at the new point before starting to shrink
            const waitTimer = setTimeout(() => {
                startShrinking(shrinkTime);
            }, waitTime);
    
            timeoutRefs.current.push(waitTimer);
    
            // Schedule the next point transition
            const nextPointTimer = setTimeout(moveToNextPoint, waitTime + shrinkTime);
            timeoutRefs.current.push(nextPointTimer);
        };
    
        // Initial wait before starting the cycle
        const initialWaitTimer = setTimeout(() => {
            // Start shrinking the first point
            isStarted.current = true;
            startShrinking(shrinkTime);
            
            // Schedule the move to the next point after the shrinking animation completes
            const nextPointTimer = setTimeout(() => {
                moveToNextPoint();
            }, shrinkTime);
            
            timeoutRefs.current.push(nextPointTimer);
        }, initialWaitTime);
        
        timeoutRefs.current.push(initialWaitTimer);
        
        // Cleanup on unmount
        return () => {
            clearAllTimeouts();
        };
    }, [transitionTime]);

    // Shrinking animation function
    const startShrinking = (duration) => {
        const startTime = performance.now();

        const animate = (timestamp) => {
            const elapsedTime = timestamp - startTime;
            const newScale = Math.max(0, 1 - (elapsedTime / duration));

            setScale(newScale);

            if (newScale > 0) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };


        // Start the animation
        animationRef.current = requestAnimationFrame(animate);
        // console.log("Shrinking animation started for duration:", animationRef.current !== null);

    };


    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const mousePositionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            const newPosition = { x: event.clientX, y: event.clientY };
            setMousePosition(newPosition);
            mousePositionRef.current = newPosition; // Update the ref
        };
        
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const logData = setInterval(() => {
            const element = document.querySelector(".shrinking-circle");

            setTrackingData(prevData => {
                if (!isStarted.current) return prevData; // Don't log data if not started
                // console.log(isStarted.current)
                // console.log("logging data")
                const newData = { ...prevData };
                const tracking_points = newData.tracking_points;
                // Use the ref value which is always up-to-date
                tracking_points.x.push(mousePositionRef.current.x);
                tracking_points.y.push(mousePositionRef.current.y);
                tracking_points.is_shrinking.push(animationRef.current !== null);
                tracking_points.timestamp.push(Date.now());

                const isLarger = currentIndexRef.current > prevoiusLargest
                isLarger ? 
                    tracking_points.fixation_index.push(currentIndexRef.current) : {}
                isLarger ? setPrevoiusLargest(currentIndexRef.current) : {}

                if (element) {
                    const rect = element.getBoundingClientRect();
                    tracking_points.fixation_x.push(rect.left);
                    tracking_points.fixation_y.push(rect.top);
                }

                return { ...newData };
            });
        }, logInterval);

        return () => clearInterval(logData);
    }, [logInterval]); // Keep the dependency array as is
    
    const calculateStats = () => {
        
        const tracking_points = trackingData.tracking_points;
        
        if (tracking_points.x.length === 0) {
                console.log("No tracking data available.");
                return;
        }
        trackingData.end_of_test = Date.now()
        trackingData.device = getDeviceType();
        trackingData.accuracyStill =  calculateAccuracy(
            trackingData.tracking_points.x, 
            trackingData.tracking_points.y, 
            trackingData.tracking_points.fixation_x, 
            trackingData.tracking_points.fixation_y, 
            trackingData.tracking_points.fixation_index, 
            trackingData.tracking_points.is_shrinking
        ),
        trackingData.accuracyMoving = calculateAccuracy(
            trackingData.tracking_points.x, 
            trackingData.tracking_points.y, 
            trackingData.tracking_points.fixation_x, 
            trackingData.tracking_points.fixation_y, 
            trackingData.tracking_points.fixation_index,
            null
        )
        trackingData.precision = calculatePrecision(
            trackingData.tracking_points.x,
            trackingData.tracking_points.y,
            trackingData.tracking_points.fixation_index,
            trackingData.tracking_points.is_shrinking
        )

        setPrevoiusLargest(0) // Reset the largest index for the next test
        saveTrackingData()
    
    };
    function saveTrackingData() {
        // Format timestamp for the filename
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var time = String(today.getHours()).padStart(2, '0') + "-" + String(today.getMinutes()).padStart(2, '0') + "-" + String(today.getSeconds()).padStart(2, '0');
        
        const filename = `eyeTrackingData_${dd}-${mm}_${time}.json`;
        
        // Prepare tracking data to send to server
        const dataToSend = {
            ...trackingData,
            timestamp: new Date().toISOString(),
            dataType: "eyeTrackingData",
            
        };
        
        // Send data to server
        const currentIP = window.location.hostname;
        console.log("Current IP:", currentIP);
        fetch(`http://${currentIP}:5000/save-json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(alert("Eye tracking data saved successfully!"))
        .then(data => {
            console.log('Successfully saved eye tracking data:', data);
        })
        .catch((error) => {
            console.log('Error saving eye tracking data:' + error+" ip " + currentIP + " response: " + error.response + " data: " + JSON.stringify(dataToSend) + " filename: " + filename);
            
         
        });
        // Fallback to local download if server save fails
        console.log("Falling back to local download...");
        const jsonData = JSON.stringify(trackingData, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = filename;
        jsonLink.click();
        URL.revokeObjectURL(jsonUrl);
    }
    const switchToMainMenu = () => {
        // Call handleAction here
        if (handleAction) { 
            const action ={ type: "switch_layout", value: "2+2+4x2" };
            
            handleAction(action);
        }
        
    }
    return (

        <div>                                                   
             <div ref={containerRef} className="calibrationDiv">
                 {/* Static background circle with 50% opacity */}
                 <div
                     className={`static-circle ${isComplete ? 'fade-out' : ''}` }
                     style={{
                         top: screenPoints[currentIndex].top,
                         left: screenPoints[currentIndex].left
                     }}
                 />

                 {/* Shrinking circle */}
                 <div
                     className={`shrinking-circle ${isComplete ? 'fade-out' : ''}`}
                     style={{
                         top: screenPoints[currentIndex].top,
                         left: screenPoints[currentIndex].left,
                         transform: `translate(-50%, -50%) scale(${scale})`
                     }}
                 />
                 <canvas id="plotting_canvas" width="500" height="500"></canvas>
             </div>
         </div>
    );
};

TrackerLayout.properties = {
    textAreaColSpan: 0,
    rows: 0,
    cols: 0,
};

export default TrackerLayout;
