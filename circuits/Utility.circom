pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/compconstant.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

// Non geometric utilities

// From https://docs.circom.io/more-circuits/more-basic-circuits/#extending-our-multiplier-to-n-inputs
template MultiplierN (N){
   //Declaration of signals.
   signal input in[N];
   signal output out;
   component comp[N-1];

   //Statements.
   for(var i = 0; i < N-1; i++){
       comp[i] = Multiplier2();
   }
   comp[0].in1 <== in[0];
   comp[0].in2 <== in[1];
   for(var i = 0; i < N-2; i++){
       comp[i+1].in1 <== comp[i].out;
       comp[i+1].in2 <== in[i+2];

   }
   out <== comp[N-2].out; 
}

// Multiplies 2 numbers (from circom docs)
template Multiplier2() {
    signal input in1;
    signal input in2;
    signal output out;
    out <== in1*in2;
}

/*
Compare a signal to some constant
Aids readability by handling binary decomposition of the signal
*/
template Comp(ct) {
    signal input in;
    signal output out;

    // TODO: optimise by using grid_bits instead of 254
    component num2Bits = Num2Bits(254);
    num2Bits.in <== in;

    component compare = CompConstant(ct);
    for (var i=0; i<254; i++) {
        compare.in[i] <== num2Bits.out[i];
    }

    out <== compare.out;
}

/*
Return two values in order
*/
template Order(grid_bits) {
    signal input in[2];
    signal output out[2];

    component lt = GreaterThan(grid_bits);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1];

    out[0] <== (in[1] - in[0])*lt.out + in[0];
    out[1] <== (in[0] - in[1])*lt.out + in[1];
}