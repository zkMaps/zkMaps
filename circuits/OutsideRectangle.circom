pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/*

Ensures that a line is outside a given rectangle.
We check whether the line falls fully outside any of the rectangle's sides.

For example., in the rectangle below, a-b not outside, x-y is outside the right hand side, and m-n is outside both the left and bottom sides.
Note: we have some false negatives: n-x is outside the rectangle, but we can't prove it with the constraint for simplicity.

//     __
//    | a|    y
//    |b |   
//    |__|      x
// 
// m
//  n

Returns 1 the line is fully outside the rectangle on any of the 4 sides, i.e.:
    both [px1, px2] > [rx1, rx2] or
    both [px1, px2] < [rx1, rx2] or
    both [py1, py2] > [ry1, ry2] or
    both [py1, py2] < [ry1, ry2]
*/

template LineOutsideRectangle(accuracy) {
    signal input rect[4]; // rx1, ry1, rx2, ry2
    signal input line[4]; // px1, py1, px2, py2

    signal output out; // 1 if the line is outside the rectangle, 0 otherwise

    // check line[0] < rect[0] && line[0] < rect[2] && line[2] < rect[0] && line[2] < rect[2]
    component leftCheck = BothLess(accuracy);
    leftCheck.lesser[0] <== line[0];
    leftCheck.lesser[1] <== line[2];
    leftCheck.greater[0] <== rect[0];
    leftCheck.greater[1] <== rect[2];
    signal left <== leftCheck.out;

    // check line[0] > rect[0] && line[0] > rect[2] && line[2] > rect[0] && line[2] > rect[2]
    component rightCheck = BothLess(accuracy);
    rightCheck.lesser[0] <== rect[0];
    rightCheck.lesser[1] <== rect[2];
    rightCheck.greater[0] <== line[0];
    rightCheck.greater[1] <== line[2];
    signal right <== rightCheck.out;

    // check line[1] < rect[1] && line[1] < rect[3] && line[3] < rect[1] && line[3] < rect[3]
    component topCheck = BothLess(accuracy);
    topCheck.lesser[0] <== rect[1];
    topCheck.lesser[1] <== rect[3];
    topCheck.greater[0] <== line[1];
    topCheck.greater[1] <== line[3];
    signal top <== topCheck.out;
    
    component bottomCheck = BothLess(accuracy);

    bottomCheck.lesser[0] <== line[1];
    bottomCheck.lesser[1] <== line[3];
    bottomCheck.greater[0] <== rect[1];
    bottomCheck.greater[1] <== rect[3];
    signal bottom <== bottomCheck.out;

    // assume that top, bottom, left, and right are constrained to 0 or 1 by the GreaterThan and LessThan components,
    // so outside_sides is 0, 1, 2, 3, or 4 (0, 1, or 2 if the geometry is correct)
    signal outside_sides;
    outside_sides <== top + bottom + left + right;

    // normalise output to 0 or 1
    component isZero = IsZero();
    isZero.in <== outside_sides;
    out <== (isZero.out - 1) * (-1); // swaps 0 and 1
}

/*
Outputs a 1 if both lesser[i] are less than both lesser[j]
*/
template BothLess(accuracy) {
    signal input lesser[2];
    signal input greater[2];
    signal output out;

    component lt[4];
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            var ind = i*2+j;
            lt[ind] = LessThan(accuracy);
            lt[ind].in[0] <== lesser[i];
            lt[ind].in[1] <== greater[j];
        }
    }

    signal l1 <== lt[0].out * lt[1].out;
    signal l2 <== lt[2].out * lt[3].out;
    out <== l1 * l2;
}
