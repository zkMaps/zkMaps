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
    signal private input treasureLatitude;
    signal private input treasureLongitude;

    // Outputs
    signal output maxLatitudeOutput;
    signal output maxLongitudeOutput;
    signal output minLatitudeOutput;
    signal output minLongitudeOutput;

    signal output hashOutput;

    // We expect the location to be formatted as a positive latitude and longitude to 4 decimal places.
    // In Colorado (for example), a single unit of latitude is 36 feet, and a single unit of longitude is 28 feet,
    // the length of a unit of longitude decreases as you move towards the poles.
    // Assert that the treasure is a valid latitude and longitude.
    signal maxPossibleLatitude;
    maxPossibleLatitude <== 1800000;
    component lt1 = LessThan(64);
    lt1.in[0] <== latitude;
    lt1.in[1] <== maxPossibleLatitude;
    lt1.out === 1;

    signal maxPossibleLongitude;
    maxPossibleLongitude <== 3600000
    component lt1 = LessThan(64);
    lt1.in[0] <== latitude;
    lt1.in[1] <== maxPossibleLongitude;
    lt1.out === 1;

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

    // Output the hash
    hashOutput <== hash.out;

    // Pass public inputs through the circuit
    maxLatitudeOutput <== maxLatitude;
    maxLongitudeOutput <== maxLongitude;
    minLatitudeOutput <== minLatitude;
    minLongitudeOutput <== minLongitude;
}

component main = DropTreasure();