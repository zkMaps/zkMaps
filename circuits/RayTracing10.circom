pragma circom 2.0.0;

include "./PointInPolygon.circom";

component main {public [polygon]} = RayTracing(10, 26);