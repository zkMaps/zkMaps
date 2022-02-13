pragma circom 2.0.0;

// This contract verifies that you're in denver

template AtETHDenver() {
    // Your private coordinates
    signal input x;
    signal input y;

    // Public definition of ethdenver
    // 4 city blocks, starting in the north east, going counter-clockwise
    // 12th and Lincoln
    var northEastLatitude = 39.73547807205027;
    var northEastLongitude = -104.98613919370023;

    // 12th and Acoma
    var northWestLatitude = 39.73543227022188;
    var northWestLongitude = -104.98879917874464;

    // 10th and Acoma
    var southEastLatitude = 39.73221877758723;
    var southEastLongitude = -104.98884719485505;

    // 10th and Lincoln
    var southWestLatitude = 39.73227978507761;
    var southWestLongitude = -104.98612139274626;

    

    signal input a;
    signal input b;
    signal output c;
    a * b === 33;
    c <== a*b;
 }

 component main = AtETHDenver();