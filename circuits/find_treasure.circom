pragma circom 2.0.0;

include "./dependencies/circomlib/poseidon.circom";

template FindTreasure() {
    // inputs
    signal private input latitude;
    signal private input longitude;

    // outputs
    signal output hashOutput;

    component hash = Poseidon(2);
    hash.inputs[0] <== latitude;
    hash.inputs[1] <== longitude;

    hashOutput <== hash.out;
}

component main = FindTreasure();