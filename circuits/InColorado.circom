pragma circom 2.0.0;

include "./location.circom";

// Colorado is between 41N and 37N by latitude
// It is between -109.04539496353976 and -102.04184635030175 by longitude
component main = AssertFixedLocation(4100000000000000, -10204184635030175, 3700000000000000, -10904539496353976);