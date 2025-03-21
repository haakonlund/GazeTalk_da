import React, { useEffect, useState, useRef } from "react";
import "./TrackerLayout.css";
import KeyboardGrid from "../components/KeyboardGrid";
import * as DA from "../util/dataAnalysis.js"


const TrackerLayout = (props) => {
    const logInterval = 1;
    const transitionTime = 2000;
    
    const handleAction = props.onTileActivate; // Destructure handleAction from props
    const points = [
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

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(0);
    const [scale, setScale] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const animationRef = useRef(null);
    const timeoutRefs = useRef([]);
    const containerRef = useRef(null);

    const element = document.querySelector(".shrinking-circle");

    const [trackingData, setTrackingData] = useState({
        start_of_test : Date.now(),
        end_of_test : 0,
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
        points, points,
        accuracy: 0,
        precision: 0,
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
            const newIndex = (currentIndexRef.current + 1) % points.length;
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
            startShrinking(shrinkTime);
            moveToNextPoint();
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
    };

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const logData = setInterval(() => {
            setTrackingData(prevData => {
                const newData = { ...prevData };
                const tracking_points = newData.tracking_points;
    
                tracking_points.x.push(mousePosition.x);
                tracking_points.y.push(mousePosition.y);
                tracking_points.is_shrinking.push(animationRef.current !== null);
                tracking_points.timestamp.push(Date.now());
                tracking_points.fixation_index.push(currentIndex);
    
                if (element) {
                    const rect = element.getBoundingClientRect();
                    tracking_points.fixation_x.push(rect.left);
                    tracking_points.fixation_y.push(rect.top);
                }
    
                return { ...newData };
            });
        }, logInterval);
    
        return () => clearInterval(logData);
    }, [mousePosition, logInterval]);
    
    const calculateStats = () => {
        
        // debugger
        const tracking_points = trackingData.tracking_points;
        
        if (tracking_points.x.length === 0) {
                console.log("No tracking data available.");
                return;
        }
        trackingData.end_of_test = Date.now()
        saveTrackingData()
    
    };
    function saveTrackingData() {
        // Save as JSON
        const jsonData = JSON.stringify(trackingData, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

        jsonLink.download = `trackingData_${dd}/${mm}.json`;
        jsonLink.click();
        
    
        // Save as CSV
        const { tracking_points, screen_width, screen_height, points, accuracy, precision, start_of_test, end_of_test } = trackingData;
        const csvRows = [];
    
        // Headers for CSV
        const headers = [
            'x', 'y', 'is_shrinking', 'fixation_x', 'fixation_y', 'timestamp', 'fixation_index',
            'screen_width', 'screen_height', 'points', 'accuracy', 'precision'
        ];
        csvRows.push(headers.join(','));
    
        // Rows for CSV
        const numPoints = tracking_points.x.length;
        for (let i = 0; i < numPoints; i++) {
            const row = [
                tracking_points.x[i],
                tracking_points.y[i],
                tracking_points.is_shrinking[i],
                tracking_points.fixation_x[i],
                tracking_points.fixation_y[i],
                tracking_points.timestamp[i],
                tracking_points.fixation_index[i],
                screen_width,
                screen_height,
                points.map(p => `(${p.top},${p.left})`).join(';'), // Join points array into a single string
                accuracy,
                precision,
                start_of_test,
                end_of_test,
                

            ].map(value => (value !== undefined ? value : ''));
            csvRows.push(row.join(','));
        }
        // const csvData = csvRows.join('\n');
        // const csvBlob = new Blob([csvData], { type: 'text/csv' });
        // const csvUrl = URL.createObjectURL(csvBlob);
        // const csvLink = document.createElement('a');
        // csvLink.href = csvUrl;
        // csvLink.download = 'trackingData.csv';
        // csvLink.click();
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
                         top: points[currentIndex].top,
                         left: points[currentIndex].left
                     }}
                 />

                 {/* Shrinking circle */}
                 <div
                     className={`shrinking-circle ${isComplete ? 'fade-out' : ''}`}
                     style={{
                         top: points[currentIndex].top,
                         left: points[currentIndex].left,
                         transform: `translate(-50%, -50%) scale(${scale})`
                     }}
                 />
                 <canvas id="plotting_canvas" width="500" height="500"></canvas>
             </div>
             <p>Mouse Position: X={mousePosition.x}, Y={mousePosition.y}</p>
         </div>
    );
};

TrackerLayout.properties = {
    textAreaColSpan: 0,
    rows: 0,
    cols: 0,
};

export default TrackerLayout;
