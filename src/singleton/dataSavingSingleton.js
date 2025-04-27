
// const serverIP = window.location.hostname
const serverIP = "139.162.147.37"

export let testActive = {isActive : false}
export const data = (
        {
           form_data : {},
           first_calibration : {},
           writing_test : {},
           second_calibration : {},
    });

export const saveRemotely = async () => {
    const [isWellformed, msg] = wellformed()
    if (!isWellformed) {
        console.error(msg)
    }
    // Format timestamp for the filename
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var time = String(today.getHours()).padStart(2, '0') + "-" + String(today.getMinutes()).padStart(2, '0') + "-" + String(today.getSeconds()).padStart(2, '0');
    const name = data.form_data.name || "unknown";
    const filename = `${name}_${dd}-${mm}_${time}.json`;
    

    data.timestamp = new Date().toISOString()
    
    // Send data to server

    console.log("Current IP:", serverIP);
    fetch(`http://${serverIP}:5000/save-test-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(
        )
    .then(data => {
        console.log('Successfully saved data:', data);
    })
    .catch((error) => {
        console.log('Error data:' + error+" ip " + serverIP + " response: " + error.response + " data: " + JSON.stringify(data) + " filename: " + filename);
        // Fallback to local download if server save fails
        alert("Cannot connect to server, falling back to local download...");
        saveLocally();
    });
}

export const saveLocally = () => {
    const [isWellformed, msg] = wellformed()
    if (!isWellformed) {
        console.error(msg)
    }
    const jsonData = JSON.stringify(data, null, 2);
    const jsonBlob = new Blob([jsonData], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = "data.json";
    jsonLink.click();
    URL.revokeObjectURL(jsonUrl);
}
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
export const wellformed = () => {
    if (isObjectEmpty(data.first_calibration)) {
        return [false, "first_calibration is empty"];
    }
    if (isObjectEmpty(data.writing_test)) {
        return [false, "writing_test is empty"];
    }
    if (isObjectEmpty(data.second_calibration)) {
        return [false, "second_calibration is empty"];
    }
    if (isObjectEmpty(data.form_data)) {
        return [false, "form_data is empty"];
    }
    return [true, ""];
}