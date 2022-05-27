pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/*

TODO: refactor to LineOutside Rectangle - we have to make sure both points on the line are on the same side!

Ensures that a line is outside a given rectangle.

Returns 1 if:
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
    component leftLT[4];
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            var ind = i*2+j;
            leftLT[ind] = LessThan(accuracy);
            leftLT[ind].in[0] <== line[2*i];
            leftLT[ind].in[1] <== rect[2*j];
        }
    }
    signal l1 <== leftLT[0].out * leftLT[1].out;
    signal l2 <== leftLT[2].out * leftLT[3].out;
    signal left <== l1 * l2;

    // check line[0] > rect[0] && line[0] > rect[2] && line[2] > rect[0] && line[2] > rect[2]
    component rightGT[4];
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            var ind = i*2+j;
            rightGT[ind] = GreaterThan(accuracy);
            rightGT[ind].in[0] <== line[2*i];
            rightGT[ind].in[1] <== rect[2*j];
        }
    }
    signal r1 <== rightGT[0].out * rightGT[1].out;
    signal r2 <== rightGT[2].out * rightGT[3].out;
    signal right <== r1 * r2;
    
    // check line[1] < rect[1] && line[1] < rect[3] && line[3] < rect[1] && line[3] < rect[3]
    component topGT[4];
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            var ind = i*2+j;
            topGT[ind] = GreaterThan(accuracy);
            topGT[ind].in[0] <== line[2*i+1];
            topGT[ind].in[1] <== rect[2*j+1];
        }
    }
    signal t1 <== topGT[0].out * topGT[1].out;
    signal t2 <== topGT[2].out * topGT[3].out;
    signal top <== t1 * t2;

    // check line[1] < rect[1] && line[1] < rect[3] && line[3] < rect[1] && line[3] < rect[3]
    component bottomLT[4];
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            var ind = i*2+j;
            bottomLT[ind] = LessThan(accuracy);
            bottomLT[ind].in[0] <== line[2*i+1];
            bottomLT[ind].in[1] <== rect[2*j+1];
        }
    }
    signal b1 <== bottomLT[0].out * bottomLT[1].out;
    signal b2 <== bottomLT[2].out * bottomLT[3].out;
    signal bottom <== b1 * b2;


    // outside_sides is the number of sides the line is outside of
    // i.e., a-b is outside 0 sides, x-y is outside 1, and m-n is outside 2.
    //     __
    //    | a|    y
    //    |b |   x
    //    |__|
    //
    // m
    //  n

    // assume that each gt[i] and lt[i] is constrained to 0 or 1 by the GreaterThan and LessThan components,
    // so outside_sides is 0, 1, 2, 3, or 4 (0, 1, or 2 if the geometry is correct)
    signal outside_sides;
    outside_sides <== top + bottom + left + right;

    // normalise output to 0 or 1
    component isZero = IsZero();
    isZero.in <== outside_sides;
    out <== (isZero.out - 1) * (-1); // swaps 0 and 1
}

component main = LineOutsideRectangle(64);