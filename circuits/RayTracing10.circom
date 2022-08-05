pragma circom 2.0.0;

include "./PointInPolygon.circom";

template FullRayTracing(n, grid_bits) {
    signal input point[2];
    signal input polygon[n][2];

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
}

component main = FullRayTracing(10, 32);