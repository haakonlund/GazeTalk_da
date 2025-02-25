import { useState } from "react";


// let [ranking, setRanking] = useState([])
// let ranking = {}
// test ranking
let ranking = {
    "a" : [0,10,0,1,0,0],
    "b" : [11,2,0,0,0,0],
    "c" : [0,0,0,0,0,0],
    "d" : [0,0,0,0,0,0],
    "e" : [0,0,0,0,0,0],
    "f" : [0,0,0,0,0,0],
}
const buttonNum = 6


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
 k is the numbers away from the max. For example 0 is the max, 1 is the next to the max
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



export const rank = (arr) => {
    let newArr = Array(buttonNum).fill("")
    let selectionArr = Array(buttonNum).fill(0)
    let rArr = Array(buttonNum)
    for (let i = 0; i < buttonNum; i++) {
        const thisRank = getRank(arr[i])

        selectionArr[i] = getPreferedSpaces(thisRank)
    }
    for (let i = 0; i < buttonNum; i++) {
        rArr[i] = new R(0,selectionArr[i],arr[i],null)
    }
    let filledSpaces = 0

    let occupied = Array(buttonNum).fill(false)
    let hasSpace = Array(buttonNum).fill(false)
    let currentMax = Array(buttonNum).fill(0)
    // the goal of this function is to finde the prefered index for each letter
    debugger
    while (filledSpaces < buttonNum) {
        // get biggest index in ranking
        let largest = 0;
        let coords = [];
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
                const thisCurrentMax = j
                // const thisRanking = selectionArr[i]
                const otherLetter = newArr[preferedSpace];
                const otherRanking = getRank(otherLetter);
                // const otherCurrentMax = 
                let otherI = 0
                for (let k = 0; k < buttonNum; k++) {
                    if (arr[k] === otherLetter) {
                        otherI = k;
                    }
                }

                if (otherRanking[preferedSpace] < thisRanking[preferedSpace]) {
                    newArr[preferedSpace] = thisLetter
                    hasSpace[i] = true
                    hasSpace[otherI] = false
                    currentMax[otherI] = currentMax[otherI] + 1
                } else {
                    currentMax[i] = currentMax[i] + 1
                }
            }

            
        }
        console.log("coords : ", coords)
        console.log("largest : ", largest)
        
        
        
    }



    return newArr;
}

console.log("rank", rank(["a","b","c","d","e","f"]))



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

    let selection = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]===letter) {
            selection = i
            break
        }
    }
    

    const currentRank = ranking[selection];
    let newRank = [];
    if (currentRank) {
        newRank = currentRank;
    } else {
        newRank = Array(buttonNum).fill(0);
    }
    newRank[selection] = newRank[selection] + 1; 

    ranking[letter] = newRank
} 



// make a cucko algorithm
/*
a [2,1,0,0,0,1]
b [0,0,0,2,3,4]
c
d
...

*/