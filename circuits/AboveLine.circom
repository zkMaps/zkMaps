pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/compconstant.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/*

Given a line L from the point (0,0) to the point (x,y), is the point P = (a,b), output 1 if 
P is above L, and output 0 if it is below.

Note that this should be used with other constraints specifying that 0 <= a <= x, and 0 <= b <= y, and
that P is not on the line L.

i.e., (x,y) = (2,2)

1 1 X
1 X 0
X 0 0

or (x,y) = (3,4)

1 1 1 X
1 1 1 0
1 1 0 0
1 0 0 0
X 0 0 0

Think of y/x as slope, and note that if y/x * a < b we output a 1.
Take the above example: let (x,y) = (3,4) and (a,b) = (1,2), then 4/3 * 1 = 1.33... < 2

Rearranging we get y*a < x*b, and this is the constraint that we need to check.

Note that if y*a or x*b are greater than p (the size of our prime field), we'll get an overflow, so we make sure y,a,x, and b are less than sqrt(p)
Note, we use 2^120 rather than sqrt(p), since 120 bits is *far* more than enough to represent a latitude or longitude
*/

template AboveLine() {
    signal input x; // The x-coordinate of the end of our line
    signal input y; // The y-coordinate of the end of our line
    signal input a; // The x coordinate of our point
    signal input b; // The y coordinate of our point

    signal output out; // Is the point (a,b) about the line (x,y)?

    // check that x, y, a, and b < sqrt(p)
    component xgt120 = gt120();
    xgt120.in <== x;
    xgt120.out * 1 === 0;
    
    component ygt120 = gt120();
    ygt120.in <== y;
    ygt120.out * 1 === 0;
    
    component agt120 = gt120();
    agt120.in <== a;
    agt120.out * 1 === 0;
    
    component bgt120 = gt120();
    bgt120.in <== b;
    bgt120.out * 1 === 0;

    // check y*a < x*b
    signal ya <== y*a;
    signal xb <== x*b;

    component lt = LessThan(120);
    lt.in[0] <== ya;
    lt.in[1] <== xb;

    out <== lt.out;
}

// outputs 1 if input is greater than 2**120, 0 otherwise
template gt120() {
    signal input in;
    signal output out;

    component sizeCheck = CompConstant(120);
    component num2bits = Num2Bits_strict();
    num2bits.in <== in;
    for (var i=0; i<254; i++) {
        sizeCheck.in[i] <== num2bits.out[i];
    }

    out <== sizeCheck.out;
}

component main = AboveLine();