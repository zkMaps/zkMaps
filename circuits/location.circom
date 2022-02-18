// pragma circom 2.0.0;

include "./dependencies/circomlib/comparators.circom";

// Utility functions for location based circuits

template AssertFixedLocation(maxLatitude, maxLongitude, minLatitude, minLongitude) {
    signal private input latitude;
    signal private input longitude;

    signal output o; // necessary to compile as per https://github.com/iden3/snarkjs/issues/116#issuecomment-1020352690
    o <== 1;

    component a = AssertInLocation();
    a.maxLatitude <== maxLatitude;
    a.maxLongitude <== maxLongitude;
    a.minLatitude <== minLatitude;
    a.minLongitude <== minLongitude;
    a.latitude <== latitude;
    a.longitude <== longitude;
}

// AssertInLocation accepts coordinates for a bounding rect and a point
// and fails if the point is not within the bounding rect.
template AssertInLocation() {
    signal input maxLatitude;
    signal input maxLongitude;
    signal input minLatitude;
    signal input minLongitude;

    signal input latitude;
    signal input longitude;

    component lt1 = LessThan(64);
    lt1.in[0] <== latitude;
    lt1.in[1] <== maxLatitude;
    lt1.out === 1;

    component lt2 = LessThan(64);
    lt2.in[0] <== longitude;
    lt2.in[1] <== maxLongitude;
    lt2.out === 1;

    component lt3 = LessThan(64);
    lt3.in[0] <== minLatitude;
    lt3.in[1] <== latitude;
    lt3.out === 1;

    component lt4 = LessThan(64);
    lt4.in[0] <== minLongitude;
    lt4.in[1] <== longitude;
    lt4.out === 1;
}