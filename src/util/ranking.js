import { useState } from "react";

let buttonNum = 14;
let ranking = {};

export const setRanking = (xRanking) => {
    ranking = xRanking;
}

export const setButtonNum = (xNum) => {
    // reset ranking for new button number
    ranking = {};
    buttonNum = xNum;
}

export const getButtonNum = () => {
    return buttonNum;
}

export const getRank = () => {
    return ranking;
}
const assert = function(condition, message) {
    if (!condition)
        throw Error('Assert failed: ' + (message || ''));
};
const getLetterRank = (letter) => {
    assert(ranking, "ranking does not exist");
    assert(letter, "letter does not exist");
    
    if (letter in ranking) {
        return ranking[letter];
    }
    // if tests are running return a determinisc value
    if (process.env.NODE_ENV === "test"){
        return Array(buttonNum).fill(0);
    }
    // if letter not in ranking, create it and randomize its values to reduce the amount of jumping
    ranking[letter] = Array(buttonNum).fill(0);
    ranking[letter] = Object.entries(ranking[letter]).map((key, value) => {
        return Math.floor(Math.random()*5)
    })

    return ranking[letter];
}

export const updateRank = (arr, letter) => {
    if (arr.length !== buttonNum) {
        throw new Error("Array length must be equal to button number constant");
    }
    
    let selection = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === letter) {
            selection = i;
            break;
        }
    }
    
    const currentRank = getLetterRank(letter);
    currentRank[selection] = currentRank[selection] + 1;
    ranking[letter] = currentRank;
}

export const getPreferedSpaces = (arr) => {
    let ordering = [];
    let visited = Array(buttonNum).fill(false);
   
    for (let i = 0; i < arr.length; i++) {
        let index = 0;
        let greatest = -1;
        for (let j = 0; j < arr.length; j++) {
            if (visited[j] === true) {
                continue;
            }
            if (arr[j] > greatest) {
                index = j;
                greatest = arr[j];
            }
        }
        visited[index] = true;
        ordering[i] = index;
    }
    return ordering;
}

const createPreferenceArrays = (arr, suggestionLetter, currentSelection) => {
    const setA = arr;
    const setB = Array.from({ length: buttonNum }, (_, i) => i.toString());
    
    const rankA = (letter) => {
        let letterRanking = getLetterRank(letter);
        
        if (letter === suggestionLetter) {
            let tempRanking = [...letterRanking];
            tempRanking[currentSelection] = tempRanking[currentSelection] + 1;
            letterRanking = tempRanking;
        }
        
        let preferenceIndexes = getPreferedSpaces(letterRanking);
        return preferenceIndexes.map(idx => idx.toString());
    };
    
    const rankB = (position) => {
        const posIdx = parseInt(position);
        let positionPreferences = [];
        
        for (let i = 0; i < setA.length; i++) {
            const letter = setA[i];
            const letterRanking = getLetterRank(letter);
            positionPreferences.push({
                letter: letter,
                preference: letterRanking[posIdx]
            });
        }
        
        positionPreferences.sort((a, b) => b.preference - a.preference);
        
        return positionPreferences.map(p => p.letter);
    };
    
    return { setA, setB, rankA, rankB };
}

// Stable mariage algorithm
function match(A, B, rankA, rankB) {
    if (!A || !B || !A.length || !B.length) return [];
    if (A.length === B.length) return _match(A, B, rankA, rankB);
 
    let sA = [...A];
    let sB = [...B];
    let mlen = Math.max(sA.length, sB.length);
 
    while (sA.length < mlen) sA.push(null);
    while (sB.length < mlen) sB.push(null);
 
    const sRA = (a) => {
        if (a === null) return Array(mlen).fill(null);
        let ret = rankA(a);
        while (ret.length < mlen) ret.push(null);
        return ret;
    };
 
    const sRB = (b) => {
        if (b === null) return Array(mlen).fill(null);
        let ret = rankB(b);
        while (ret.length < mlen) ret.push(null);
        return ret;
    };
 
    return _match(sA, sB, sRA, sRB).filter(pair => pair[0] !== null && pair[1] !== null);
}
 
function _match(A, B, rankA, rankB) {
    let iA = Array.from(A.keys());
    let iB = Array.from(B.keys());
 
    const iRA = (ia) => rankA(A[ia]).map(item => B.indexOf(item));
    const iRB = (ib) => rankB(B[ib]).map(item => A.indexOf(item));
 
    return _imatch(iA, iB, iRA, iRB).map(item => [A[item[0]], B[item[1]]]);
}
 
function _imatch(A, B, rankA, rankB) {
    let partners = {};
    A.forEach(a => {
        partners[a] = [rankA(a)[0], 0];
    });
 
    let stable = false;
    while (!stable) {
        stable = true;
        B.forEach(b => {
            let paired = false;
            for (let n = 0; n < A.length; n++) {
                let a = rankB(b)[n];
                let pair = partners[a];
                if (pair[0] === b) {
                    if (paired) {
                        stable = false;
                        partners[a] = [rankA(a)[pair[1] + 1], pair[1] + 1];
                    } else {
                        paired = true;
                    }
                }
            }
        });
    }
    return Object.keys(partners).map(a => [parseInt(a, 10), partners[a][0]]);
}

// Main ranking function using stable mariage
export const rank = (arr, suggestionLetter, currentSelection) => {
    // Create preference arrays for stable mariage
    const { setA, setB, rankA, rankB } = createPreferenceArrays(arr, suggestionLetter, currentSelection);
   
    // Run stable mariage algorithm
    const solution = match(setA.slice(0,buttonNum), setB.slice(0,buttonNum), rankA, rankB);

    let newArr = Array(buttonNum).fill("");
    
    for (const [letter, position] of solution) {
        newArr[parseInt(position)] = letter;
    }
    
    return newArr;
}

// Remove spaces from array
export const stripSpace = (arr) => {
    let newArr = [];
    let offset = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "space") {
            offset = 1;
            continue;
        }
        newArr[i - offset] = arr[i];
    }
    return newArr;
}