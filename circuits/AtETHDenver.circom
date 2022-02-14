pragma circom 2.0.0;

include "./dependencies/circomlib/comparators.circom";

// This contract verifies that you're in denver
template AtETHDenver() {
    // Your private coordinates
    signal input latitude;
    signal input longitude;
    signal output o; // necessary to compile as per https://github.com/iden3/snarkjs/issues/116#issuecomment-1020352690
    o <== 1;

    // Public definition of ethdenver
    // 4 city blocks, starting in the north east, going counter-clockwise
    // 12th and Lincoln
    var northEastLatitude = 12973547807205027;
    var northEastLongitude = 7501387182542445;

    // 10th and Bancock
    var southWestLatitude = 12973227978507761;
    var southWestLongitude = 7500977777251778;

    // latitude < northEastLatitude;
    component lt1 = LessThan(64);
    lt1.in[0] <== latitude;
    lt1.in[1] <== northEastLatitude;
    lt1.out === 1;

    // longitude < northEastLongitude;
    component lt2 = LessThan(64);
    lt2.in[0] <== longitude;
    lt2.in[1] <== northEastLongitude;
    lt2.out === 1;

    // latitude > southWestLatitude;
    component lt3 = LessThan(64);
    lt3.in[0] <== southWestLatitude;
    lt3.in[1] <== latitude;
    lt3.out === 1;

    // longitude > southWestLatitude;
    component lt4 = LessThan(64);
    lt4.in[0] <== southWestLongitude;
    lt4.in[1] <== longitude;
    lt4.out === 1;
}

component main = AtETHDenver();