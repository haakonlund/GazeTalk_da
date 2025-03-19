
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
export const find_euclid_dist = (xy0, xy1) => {
    return (
        Math.sqrt(
            (xy0[0] - xy1[0])**2 + (xy0[1] - xy1[1])**2
        )
    )
};

