pragma circom 2.0.0;

include "./dependencies/circomlib/comparators.circom";
include "./location.circom";

// This contract verifies that you're in denver
template AtETHDenver() {
    // Your private coordinates
    signal input latitude;
    signal input longitude;

    signal northEastLatitude;
    signal northEastLongitude;
    signal southWestLatitude;
    signal southWestLongitude;

    signal output o; // necessary to compile as per https://github.com/iden3/snarkjs/issues/116#issuecomment-1020352690
    o <== 1;

    // Public definition of ethdenver
    // 4 city blocks, starting in the north east, going counter-clockwise
    // 12th and Lincoln
    northEastLatitude <== 12973547807205027;
    northEastLongitude <== 7501387182542445;

    // 10th and Bancock
    southWestLatitude <== 12973227978507761;
    southWestLongitude <== 7500977777251778;

    component inLoc = AssertInLocation();
    inLoc.maxLatitude <== northEastLatitude;
    inLoc.maxLongitude <== northEastLongitude;
    inLoc.minLatitude <== southWestLatitude;
    inLoc.minLongitude <== southWestLongitude;
    inLoc.latitude <== latitude;
    inLoc.longitude <== longitude;
}

component main = AtETHDenver();