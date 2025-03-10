import { RANKING, SETTINGS } from "../constants/userDataConstants"

export const updateSetting = (userData, key, value) => {
    let oldSettings = userData[SETTINGS];
    oldSettings[key] = value;
    const newSettings = oldSettings;
    let newUserdata = userData;
    newUserdata[SETTINGS] = newSettings ;
    return newUserdata;
}
// used to set the ranking that is saved in browser
export const updateRanking = (userData, value) => {
    userData[RANKING] = value;
    return userData;
}