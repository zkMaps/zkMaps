pragma circom 2.0.0;

include "./PointInPolygon.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";


template FullRayTracing(n, grid_bits) {
    signal input point[2];
    signal input polygon[n][2];
    signal input polygonHash[2];

    // Create circuits to check that the polygon is simple and that the point is in the polygon
    component sp = SimplePolygon(n, grid_bits);
    component rt = RayTracing(n, grid_bits);

    // feed the polygon into both sub circuits
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < 2; j++) {
            sp.polygon[i][j] <== polygon[i][j];
            rt.polygon[i][j] <== polygon[i][j];
        }
    }
    rt.point[0] <== point[0];
    rt.point[1] <== point[1];

    // Make sure both sub circuits output true
    rt.out === 1;
    sp.out === 1;

    // hash the polygon to ensure it matches the provided value
    component hasher = Pedersen(n*2);
    for (var i = 0; i < n; i++) {
        hasher.in[i*2] <== polygon[i][0];
        hasher.in[i*2+1] <== polygon[i][1];
    }
    polygonHash[0] === hasher.out[0];
    polygonHash[1] === hasher.out[1];
}

component main{public[polygonHash]} = FullRayTracing(4, 32);