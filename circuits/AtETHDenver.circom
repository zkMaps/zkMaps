pragma circom 2.0.0;

// This contract verifies that you're in denver

template AtETHDenver() {
    // Your private coordinates
    signal input latitude;
    signal input longitude;

    // Public definition of ethdenver
    // 4 city blocks, starting in the north east, going counter-clockwise
    // 12th and Lincoln
    var northEastLatitude = 39.73547807205027;
    var northEastLongitude = -104.98613919370023;

    // 10th and Lincoln
    var southWestLatitude = 39.73227978507761;
    var southWestLongitude = -104.98612139274626;

    x < northEastLatitude;
    y < northEastLongitude;
    x > southWestLatitude;
    y > southWestLatitude;
}

 component main = AtETHDenver();