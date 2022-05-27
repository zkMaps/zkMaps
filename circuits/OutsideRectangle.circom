pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/*

Ensures that a point is outside a given rectangle.

Returns 1 if:
    px > x1 and px > x2 or
    px < x1 and px < x1 or
    py < y1 and py < y2 or
    py > y1 and py > y2
*/

template PointOutsideRectangle(accuracy) {
    signal input rect[4]; // x1, y1, x2, y2
    signal input point[2]; // px, py

    signal output out; // 1 if the point is outside the rectangle, 0 otherwise

    signal gt[4];
    signal lt[4];
    component gtc[4];
    component ltc[4];
    for (var i = 0; i < 4; i++) {
        gtc[i] = GreaterThan(accuracy);
        
        gtc[i].in[0] <== rect[i];
        gtc[i].in[1] <== point[i%2];
        gt[i] <== gtc[i].out;

        ltc[i] = LessThan(accuracy);
        ltc[i].in[0] <== rect[i];
        ltc[i].in[1] <== point[i%2];
        lt[i] <== ltc[i].out;
    }

    // outside_sides is the number of sides the point is outside of
    // i.e., x is outside 0 sides, y is outside 1, and z is outside 2.
    //     __
    //    | x|    y
    //    |__|
    // z

    // assume that each gt[i] and lt[i] is constrained to 0 or 1 by the GreaterThan and LessThan components,
    // so outside_sides is 0, 1, 2, 3, or 4 (0, 1, or 2 if the geometry is correct)
    signal outside_sides;
    signal s1 <== gt[0]*gt[2];
    signal s2 <== gt[1]*gt[3];
    signal s3 <== lt[0]*lt[2];
    signal s4 <== lt[1]*lt[3];
    outside_sides <== s1 + s2 + s3 + s4;

    // normalise output to 0 or 1
    component isZero = IsZero();
    isZero.in <== outside_sides;
    out <== (isZero.out - 1) * (-1); // swaps 0 and 1
}

component main = PointOutsideRectangle(64);