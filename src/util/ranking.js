import { useState } from "react";


// let [ranking, setRanking] = useState([])
let ranking = {}
// test ranking
// let ranking = {
//     "a" : [0,10,0,1,0,0],
//     "b" : [11,2,0,0,0,0],
//     "c" : [0,0,0,0,0,0],
//     "d" : [0,0,0,0,0,0],
//     "e" : [0,0,0,0,0,0],
//     "f" : [0,0,0,0,0,0],
// }

// let ranking = {
//         "a" : [0,10,0,1,0,0],
//         "b" : [11,2,0,0,0,0],
//         "c" : [0,11,0,0,0,0],
//         "d" : [0,0,0,0,0,0],
//         "e" : [0,0,0,0,0,0],
//         "f" : [0,0,0,0,0,0],
//     }
// let ranking = {
//     "a": [5, 4, 3, 2, 1, 0],
//     "b": [6, 5, 4, 3, 2, 1],
//     "c": [7, 6, 5, 4, 3, 2],
//     "d": [8, 7, 6, 5, 4, 3],
//     "e": [9, 8, 7, 6, 5, 4],
//     "f": [10, 9, 8, 7, 6, 5]
// };
// let ranking = {
//     "a" : [0,0,0,0,0,0],
//     "b" : [0,0,0,0,0,0],
//     "c" : [0,0,0,0,0,0],
//     "d" : [0,0,0,0,0,0],
//     "e" : [0,0,0,0,0,0],
//     "f" : [0,0,0,0,0,0],
// }

const buttonNum = 6
const MAXITER = 128

class R {
    constructor(currentMax, selectionArr, letter, space) {
        this.currentMax = currentMax
        this.selectionArr =selectionArr
        this.letter = letter
        this.space = space
    }
}
/*
 arr is the array of ints
*/
/* for example input:
[12,3,0,123,0,1]
example output
[3,0,1,5,4,2]
*/
const getPreferedSpaces = (arr) => {
    let ordering = []
    let visited = Array(buttonNum).fill(false)
   
       for (let i = 0; i < arr.length; i++) {
        let index = 0
        let greatest = 0
        for (let j = 0; j < arr.length; j++) {
            if (visited[j] === true) {
                continue
            }
            if (arr[j] >= greatest){
                index = j;
                greatest = arr[j]
            }

        }
        visited[index] = true
        // console.log("visited : ", visited)
        ordering[i] = index
    }
    return ordering;
}
/*
    gets the ranking for a letter if it exists otherwise create an empty one
*/
const getRank = (letter) => {
    if (letter in ranking) {
        return ranking[letter]
    }
    ranking[letter] = Array(buttonNum).fill(0)
    return ranking[letter]
}

const getLetter = (arr, suggestionLetter) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === suggestionLetter) {
            return i;
        }
        
    }
    return -1;
}
/*
arr is the array of strings that will be ranked (a new array will be returned)
suggestionLetter is to artifilically add a constant to a rank, this is used for word suggestions
currentSelection is which button is pressed 
*/
export const rank = (arr, suggestionLetter, currentSelection) => {
    let newArr = Array(buttonNum).fill("")
    let selectionArr = Array(buttonNum).fill(0)
    let rArr = Array(buttonNum)
    for (let i = 0; i < buttonNum; i++) {
        let thisRank = getRank(arr[i])
        // imagine if this letter is selected, and how it would effect the ranking without actually modifiying it
        // if (arr[i] === suggestionLetter) {
        //     console.log("before! : ", thisRank, " letter : ", arr[i]);
        //     thisRank[i] = thisRank[i] + 1; 
        //     console.log("after! : ", thisRank, " letter : ", arr[i]);
        // }
        selectionArr[i] = getPreferedSpaces(thisRank)
    }
    // if there exists a suggestionletter, add one to it
    
    console.log("before! : ", selectionArr, " letter : ", suggestionLetter);
    if (suggestionLetter) {
        const letterIndex = getLetter(arr, suggestionLetter)
        if (letterIndex !== -1) {
            selectionArr[letterIndex][currentSelection] = selectionArr[letterIndex][currentSelection] + 1
        }
    }
    console.log("after! : ", selectionArr, " letter : ", suggestionLetter);
    
    


    for (let i = 0; i < buttonNum; i++) {
        rArr[i] = new R(0,selectionArr[i],arr[i],null)
    }
    let filledSpaces = 0

    let occupied = Array(buttonNum).fill(false)
    let hasSpace = Array(buttonNum).fill(false)
    let currentMax = Array(buttonNum).fill(0)

    let iter = 0
    // the goal of this function is to finde the prefered index for each letter
    while (filledSpaces < buttonNum) {
        if (iter >= MAXITER) {
            console.log("Max iteration count hit");
            newArr = arr
            break
        }
        iter++;
        for (let i = 0; i < buttonNum; i++) {
            if (hasSpace[i]) continue; // if it already have a space skip

            let j = currentMax[i];
            let preferedSpace = selectionArr[i][j]

            if (occupied[preferedSpace] === false) {

                occupied[preferedSpace] = true
                newArr[preferedSpace] = arr[i]
                hasSpace[i] = true
                filledSpaces++;

            } else {
                const thisLetter = arr[i];
                const thisRanking = getRank(thisLetter)
                const otherLetter = newArr[preferedSpace];
                const otherRanking = getRank(otherLetter);
                let otherI = 0
                for (let k = 0; k < buttonNum; k++) {
                    if (arr[k] === otherLetter) {
                        otherI = k;
                    }
                }
                const otherPreferedSpace = selectionArr[otherI][currentMax[otherI]]

                if (otherRanking[otherPreferedSpace] < thisRanking[preferedSpace]) {
                    newArr[preferedSpace] = thisLetter
                    hasSpace[i] = true
                    hasSpace[otherI] = false
                    currentMax[otherI] = currentMax[otherI] + 1
                } else {
                    currentMax[i] = currentMax[i] + 1
                }
            }
        }
        
    }
    // console.log("before : ", arr, " after : ", newArr)
    return newArr;
}

// console.log("rank", rank(["a","b","c","d","e","f"]))



// console.log("rankings asdf : ", getPreferedSpaces([12,3,0,123,0,1]))



export const stripSpace = (arr) => {
    let newArr = []
    let offset = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "space") {
        offset = 1;
        continue
      }
      newArr[i - offset] = arr[i];
      
    }
    return newArr;
  }

/*
    Arr of suggestions
    letter is int
*/
export const updateRank = (arr, letter) => {
    if (arr.length !== buttonNum) {
        throw new Error("Array length must be equal to button number constant");

    }
    let selection = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]===letter) {
            selection = i
            break
        }
    }
    

    const currentRank = ranking[letter];
    let newRank = [];
    if (currentRank) {
        newRank = currentRank;
    } else {
        newRank = Array(buttonNum).fill(0);
    }
    newRank[selection] = newRank[selection] + 1; 

    ranking[letter] = newRank
    console.log("current ranking : ", ranking)
} 

