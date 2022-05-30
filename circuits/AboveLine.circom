pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/compconstant.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/*

Given a line L from the point (0,0) to the point (x,y) where x and y are positive, is the point P = (a,b), output 1 if 
P is above L, and output 0 if it is on or below the line. The component fails if the point is on the line.
The component also fails if the point is outside the rectangle [(0,0), (x,y)].

To avoid overflow issues we require that 0 <= x, y <= 2^accuracy
Note, we assume that 2^accuracy < sqrt(p)

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
Note, we use 2^accuracy rather than sqrt(p), usually with accuracy=64, since 64 bits is *far* more than enough to represent a latitude or longitude: circumference_of_earth / 2^32 ~= 1cm
*/

template AboveLine(accuracy) {
    signal input x; // The x-coordinate of the end of our line
    signal input y; // The y-coordinate of the end of our line
    signal input a; // The x coordinate of our point
    signal input b; // The y coordinate of our point

    signal output out; // Boolean specifying whether the point (a,b) above the line (x,y)

    // check that x, y, a, and b < 2^accuracy
    component xinrange = inrange(accuracy);
    xinrange.in <== x;
    
    component yinrange = inrange(accuracy);
    yinrange.in <== y;
    
    component ainrange = inrange(accuracy);
    ainrange.in <== a;
    
    component binrange = inrange(accuracy);
    binrange.in <== b;

    // check that a <= x and b <= y
    component aleqx = LessEqThan(accuracy);
    aleqx.in[0] <== a;
    aleqx.in[1] <== x;
    aleqx.out === 1;

    component bleqy = LessEqThan(accuracy);
    bleqy.in[0] <== b;
    bleqy.in[1] <== y;
    bleqy.out === 1;

    // check y*a < x*b
    // this is the critical check
    signal ya <== y*a;
    signal xb <== x*b;

    component lt = LessThan(accuracy);
    lt.in[0] <== ya;
    lt.in[1] <== xb;

    // fail if y*a = x*b
    component isZero = IsZero();
    isZero.in <== ya - xb;
    isZero.out === 0;

    out <== lt.out;
}

// outputs 1 if input is greater than 2**accuracy, 0 otherwise
template inrange(accuracy) {
    signal input in;
    signal output out;

    component sizeCheck = CompConstant(2**accuracy);
    component aboveZero = CompConstant(0);
    component num2bits = Num2Bits_strict();
    num2bits.in <== in;
    for (var i=0; i<254; i++) {
        sizeCheck.in[i] <== num2bits.out[i];
        aboveZero.in[i] <== num2bits.out[i];
    }

    sizeCheck.out * 1 === 0;
    (aboveZero.out - 1) * 0 === 0; // make sure it's greater than or equal to 0
    out <== sizeCheck.out;
}
