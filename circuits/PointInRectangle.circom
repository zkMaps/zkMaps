pramga circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template PointInRectangle(accuracy) {
    signal input rect[4];
    signal input point[2];
    signal output out;

    component lts[4];

    // first iteration checks x coordinates, second checks y coordinates
    for (var i=0; i<2; i++) {
        // check r1 <= p
        lt[2*i] = LessEqThan();
        lt[2*i].in[0] <== rect[i];
        lt[2*i].in[1] <== point[i]

        // check p <= r2
        lt[2*i+1] = LessEqThan();
        lt[2*i+1].in[0] <== point[i];
        lt[2*i+1].in[1] <== rect[i+2];
    }

    out <== lt[0] * lt[1] * lt[2] * lt[3];
}