
/*
For finding the Root Mean Square from points in a list;
<points> is a list of positions.
*/
export const find_rms = (points_x, points_y) => {
    let sx = 0.0
    let sy = 0.0
    for (let i = 0; i < points_x.length - 1; i++) {
        sx = sx + (points_x[i] - points_x[i + 1] ** 2)
        sy = sy + (points_y - points_y[i + 1] ** 2)
    }
    sx = Math.sqrt(sx)
    sy = Math.sqrt(sy)
    return {sx, sy}
}
// For finding euclidean distance between a set of 2 points.
export const euclid_dist = (xy0, xy1) => {
    return (
        Math.sqrt(
            (xy0[0] - xy1[0])**2 + (xy0[1] - xy1[1])**2
        )
    )
};

// xs: x list
// xy: y list
// fx:  fixation x
// fy:  fixation y
// fi:  fixation index (the index that is active)
// s : is shrinking
export const calculateAccuracy  = ({xs,ys},{fx,fy, fi},s) => {

    // slice up the points into an array for each active fixation point
    const split = (arr) => fi.reduce((acc, index, i) => {
        acc[index] = acc[index] || [];
        acc[index].push(arr[i]);
        return acc;
    }, []); 
    
    const xsSplit = split(xs);
    const ysSplit = split(ys);
    const fxSplit = split(fx);
    const fySplit = split(fy);
    // distance from each point to the fixation point
    const dist = (xsArr, ysArr, fxArr, fyArr) => {
        return xsArr.map((xGroup, groupIndex) => {
            // For each group, calculate distances between points and fixation
            return xGroup.map((x, pointIndex) => {
                return euclid_dist(
                    [x, ysArr[groupIndex][pointIndex]],
                    [fxArr[groupIndex][pointIndex], fyArr[groupIndex][pointIndex]]
                );
            });
        });
    };
    
    
    const distances = dist(xsSplit, ysSplit, fxSplit, fySplit);
    // flatten that array to get 1d array of distances
    const flattened = distances.reduce((acc, current) => {
        return [...acc,...current]
    }, [])
    
    
    console.log("Distances: ", distances);
    console.log("flatten: ", flattened);

    console.log("xsSplit : ",dist(
        xsSplit, ysSplit,fxSplit,fySplit
    ))

    const b = xs.map
}
// let p = {xs : [1,22,333,4444,55555,666666], ys : [6,5,4,3,2,1]}
// let f = {fx : [1,2,3,4,5,6], fy : [7,8,9,10,11,12], fi : [0,0,1,1,2,2]}
// console.log(calculateAccuracy(p, f,true))