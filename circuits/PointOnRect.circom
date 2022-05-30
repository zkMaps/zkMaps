pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/*
Given a rectangle starting at [0,0] defined by its top left corner, return 1 if a point lies on the rectangle, 0 otherwise.
*/

template PointOnRect(accuracy) {
    signal input rect[2];
    signal input point[2];
    signal output out;

    // Check that the point is within the rectangle
    // TODO: do we need to check that the points are non negative?
    component ltx = LessEqThan(accuracy);
    ltx.in[0] <== point[0];
    ltx.in[1] <== rect[0];

    component lty = LessEqThan(accuracy);
    lty.in[0] <== point[1];
    lty.in[1] <== rect[1];

    signal withinRect <== ltx.out * lty.out;

    // Check that the point lies on one of the lines
    // signals that are zero if the point lies on various sides
    signal axes <== point[0] * point[1];
    signal non_axes <== (point[0] - rect[0]) * (point[1] - rect[1]);
    signal sides <== axes * non_axes;

    component isZero = IsZero();
    isZero.in <== sides;

    out <== isZero.out * withinRect; // swap 0 and 1 and combine with withinRect
}