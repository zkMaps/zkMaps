include "../node_modules/circomlib/circuits/sign.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/*
Returns 1 if a given point is in an n sided polygon, 0 otherwise.
Implements ray tracing algorithm for simple polygons on a discrete 2^grid_bits length plane.
Note, we don't check for complex or degenerate polygon.
*/
template RayTracing(n, grid_bits) {
    signal input point[2];
    signal input polygon[n][2];
    signal output out;

    // Check that (2^grid_bits)^2 < p to prevent overflow

    // Make sure every vertex in the polygon is in the range (0, 2^grid_bits)
    // Note we don't allow vertices on the y-axis

    // Make sure the point is in the range (0, 2^grid_bits)

    // Make sure no vertices share a y coordinate with the point
    // This avoids edge cases where the ray intersects the polygon at a corner
    // Note that it means we don't consider these points to be inside the polygon

    // Count the number of intersections with the ray
    // For each edge, determine whether the ray intersects the edge
    // Return whether the number of intersections is even, meaning the point is outside the polygon
}

/*
Returns 1 if two lines segments intersect, 0 otherwise.
*/
template Intersects(grid_bits) {
    signal input ray_end[2];
    signal input line2[2][2];
    signal output out;
}

/*
Returns 1 if the 3 points are arranged in a clockwise order,
0 if they are in a line, and 2 if they are in a counter-clockwise order.

We use the slopes of the lines (p0, p1) and (p1, p02) to determine the orientation.
If the first slope is greater it's clockwise, if the second is greater it's anticlockwise,
and if they're equal it's in a line.

The slope of (p0, p1) is (y1 - y0) / (x1 - x0), and the slope of (p1,  p2) is (y2 - y1) / (x2 - x1).
Therefore the following expression will be positive for clockwise etc:
    f = (y1 - y0) / (x1 - x0) - (y2 - y1) / (x2 - x1)
      = (y1 - y0) * (x2 - x1) - (y2 - y1) * (x1 - x0)

Note that f is in the range (-(2^grid_bits)^2, (2^grid_bits)^2), so we have to make sure 2^grid_bits^2 < 2^252 (since 2^252 < p), or we overflow.
So grid_bits <= 127
*/
template Orientation(grid_bits) {
    signal input points[3][2];
    signal output out;

    assert(grid_bits <= 126);

    // (y1 - y0) * (x2 - x1) - (y2 - y1) * (x1 - x0)
    signal f <== (points[1][1] - points[0][1]) * (points[2][0] - points[1][0]) - (points[2][1] - points[1][1]) * (points[1][0] - points[0][0]);
    
    // Find the sign of f
    component num2Bits = Num2Bits(254);
    num2Bits.in <== f;

    component isNegative = Sign();
    for (var i=0; i<254; i++) {
        isNegative.in[i] <== num2Bits.out[i];
    }
    
    // Find out whether f is 0
    component isZero = IsZero();
    isZero.in <== f;

    // Calculate the orientation
    // isZero   | isNegative    | Orientation
    // 0        | 0             | 1
    // 0        | 1             | 2
    // 1        | 0             | 0
    // 1        | 1             | 0
    out <== (isZero-1)*(isNegative+1)
    
}

/*
Returns 1 if a polygon is simple and non-degenerate, 0 otherwise.
*/
template SimplePolygon(n, grid_bits) {
    signal input polygon[n][2];
    signal output out;

    // https://web.archive.org/web/20060613060645/http://softsurfer.com/Archive/algorithm_0108/algorithm_0108.htm#Test%20if%20Simple
}