pragma circom 2.0.0;

include "./dependencies/circomlib/poseidon.circom";

template FindTreasure() {
    // inputs
    signal input latitude;
    signal input longitude;
    signal input salt; // Finders add a random number to their proof to make their proof unique so it can't simply be copied

    // outputs
    signal output hashOutput;
    signal output saltOutput;

    component hash = Poseidon(2);
    hash.inputs[0] <== latitude;
    hash.inputs[1] <== longitude;

    hashOutput <== hash.out;
    saltOutput <== salt;
}

component main = FindTreasure();