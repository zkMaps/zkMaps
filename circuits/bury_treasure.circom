pragma circom 2.0.0;

include "./dependencies/circomlib/comparators.circom";
include "./dependencies/circomlib/poseidon.circom";
include "./location.circom";

template DropTreasure() {
    // Public inputs
    signal input maxLatitude;
    signal input maxLongitude;
    signal input minLatitude;
    signal input minLongitude;

    // Private inputs
    signal input treasureLatitude;
    signal input treasureLongitude;

    // Outputs
    signal output maxLatitudeOutput;
    signal output maxLongitudeOutput;
    signal output minLatitudeOutput;
    signal output minLongitudeOutput;

    signal output hashOutput;

    // Confirm that the treasure is in the range
    component inLoc = AssertInLocation();
    inLoc.maxLatitude <== maxLatitude;
    inLoc.maxLongitude <== maxLongitude;
    inLoc.minLatitude <== minLatitude;
    inLoc.minLongitude <== minLongitude;
    inLoc.latitude <== treasureLatitude;
    inLoc.longitude <== treasureLongitude;

    // Hash the treasure location
    component hash = Poseidon(2);

    hash.inputs[0] <== treasureLatitude;
    hash.inputs[1] <== treasureLongitude;

    // Pass public inputs through the circuit
    maxLatitudeOutput <-- maxLatitude;
    maxLongitudeOutput <-- maxLongitude;
    minLatitudeOutput <-- minLatitude;
    minLongitudeOutput <-- minLongitude;

    // Output the hash
    hashOutput <-- hash.out;
}

component main = DropTreasure();