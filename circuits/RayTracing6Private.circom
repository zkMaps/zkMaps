pragma circom 2.0.0;

include "./PrivateRayTracing.circom";

component main {public [pedersenHash]} = FullRayTracing(6, 26);