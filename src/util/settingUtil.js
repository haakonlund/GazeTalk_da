import { SETTINGS } from "./constants"

export const updateSetting = (userData, key, value) => {
    let oldSettings = userData[SETTINGS];
    oldSettings[key] = value;
    const newSettings = oldSettings;
    let newUserdata = userData;
    newUserdata[SETTINGS] = newSettings ;
    return newUserdata;
}