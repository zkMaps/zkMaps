export default ([
  northEastX,
  northEastY,
  southWestX,
  southWestY,
]: Array<number>) => `
pragma circom 2.0.0;

include "../../location.circom";

// geofence template (public inputs)
component main = AssertFixedLocation(${northEastX}, ${northEastY}, ${southWestX}, ${southWestY});
`;
