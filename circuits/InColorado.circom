include "./location.circom";

// Colorado is between 41N and 37N by latitude
// It is between -109.04539496353976 and -102.04184635030175 by longitude
component main = AssertFixedLocation(22100000000000000, 7795815364969825, 21700000000000000, 7095460503646024);