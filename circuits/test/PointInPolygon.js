const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const wasm_tester = require("circom_tester").wasm;
const Scalar = require("ffjavascript").Scalar;

chai.use(chaiAsPromised);
chai.should();

exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

const _test_permutations = async (polygon, result) => {
  // cycle points around
  let i = 0;
  while (i < 5) {
    i++;
    polygon.unshift(polygon.pop());
    let witness = await circuit.calculateWitness({ polygon: polygon }, true);
    // assert(Fr.eq(Fr.e(witness[1]), Fr.e(result))) // assert equal field exponent of the result and the witness.
    await circuit.assertOut(witness, { out: result });

    // try the reversed polygon
    polygon.reverse();
    witness = await circuit.calculateWitness({ polygon: polygon }, true);
    await circuit.assertOut(witness, { out: result });

    polygon.reverse();
  }
};

describe("Simple Polygon", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const EXPECTED_CONSTRAINTS_FOR_5_VERTICS = 22009;
    circuit = await _checkConstrainst("Simple5.circom", EXPECTED_CONSTRAINTS_FOR_5_VERTICS);
  });

  it("Should fail for repeated points in sequence", async () => {
    const CLOCKWISE_SQUARE = [
      [0, 0],
      [0, 0],
      [5, 0],
      [5, 5],
      [0, 5],
    ];
    await chai.expect(_test_permutations(CLOCKWISE_SQUARE, 0)).to.eventually.be.rejectedWith("Assert Failed"); // can't do line intersections for lines that are just points
  });

  it("Should failed for repeated points out of sequence", async () => {
    const b_SHAPE_WITH_TRIANGLE_LOOP = [
      [0, 0],
      [0, 10],
      [0, 0],
      [5, 0],
      [5, 5],
    ];
    await _test_permutations(b_SHAPE_WITH_TRIANGLE_LOOP, 0);
  });

  it("Should fail when moving back along a line segment", async () => {
    const b_SHAPE_WITH_SQUARE_LOOP = [
      [0, 0],
      [0, 10],
      [0, 5],
      [5, 5],
      [5, 0],
    ];

    await _test_permutations(b_SHAPE_WITH_SQUARE_LOOP, 0);
  });

  it("Should fail when touching the middle of a line segment", async () => {
    const B_SHAPE_WITH_TRIANGULAR_LOOPS = [
      [0, 0],
      [0, 10],
      [0, 5],
      [5, 5],
      [5, 0],
    ];
    await _test_permutations(B_SHAPE_WITH_TRIANGULAR_LOOPS, 0);
  });

  it("Should make sure we can't cross a line", async () => {
    const LEFT_SWIMMING_FISH_FROM_RECT_AND_TRIANGLE = [
      [0, 0],
      [0, 5],
      [10, 5],
      [5, 10],
      [5, 0],
    ];
    await _test_permutations(LEFT_SWIMMING_FISH_FROM_RECT_AND_TRIANGLE, 0);
  });

  it("Should allow basic convex pentagons", async () => {
    const IRREGULAR_PENTAGON_IN_HOUSE_SHAPE = [
      [0, 0],
      [0, 10],
      [5, 15],
      [10, 10],
      [10, 0],
    ];
    await _test_permutations(IRREGULAR_PENTAGON_IN_HOUSE_SHAPE, 1);
  });

  it("Should allow concave shapes", async () => {
    const M_SHAPE_WITH_A_COLSED_BOTTOM = [
      [0, 0],
      [0, 10],
      [5, 5],
      [10, 10],
      [10, 0],
    ];
    await _test_permutations(M_SHAPE_WITH_A_COLSED_BOTTOM, 1);
  });

  it("Should allow squares with broken up sides", async () => {
    const SIMPLE_SQUARE_WITH_VERTEX_ON_THE_LFET = [
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0],
      [5, 0],
    ];
    await _test_permutations(SIMPLE_SQUARE_WITH_VERTEX_ON_THE_LFET, 1);
  });

  it("Should allow simple polygons where some vertices sit in other lines' bounding rects", async () => {
    const TILTED_TRAPEXIUM = [
      [0, 0],
      [10, 10],
      [6, 5],
      [5, 4],
      [4, 3],
    ];
    await _test_permutations(TILTED_TRAPEXIUM, 1);
  });
});

describe("Ray Tracing", function () {
  this.timeout(100000000);
  let circuit;

  this.beforeAll(async () => {
    const EXPECTED_CONSTRAINTS_FOR_4_VERTICS = 16853;
    circuit = await _checkConstrainst("RayTracing4.circom", EXPECTED_CONSTRAINTS_FOR_4_VERTICS);
  });

  const _f = async (polygon, point) => {
    await circuit.calculateWitness({ polygon: polygon, point: point }, true);
  };

  const max = Fr.e("4294967295"); // 2^32 - 1
  const max_plus_1 = Fr.e("4294967296"); // 2^32, outside allowed range
  it("Should fail to build witness for vertices outside the range", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];

    // test each part of the polygon
    for (let i = 0; i < 4; i++) {
      // both coordinates must be less than 2^32
      for (let j = 0; j < 2; j++) {
        // passing for 2^32-1
        const p = JSON.parse(JSON.stringify(polygon));
        p[i][j] = max;
        await _f(p, [1, 1]);

        // failing for 2^32
        p[i][j] = max_plus_1;
        await chai.expect(_f(p, [1, 1])).to.eventually.be.rejectedWith("Assert Failed");
      }

      // y can be 0
      const p = JSON.parse(JSON.stringify(polygon));
      p[i][1] = 0;
      await _f(p, [1, 1]);

      // x can't be 0
      p[i][0] = 0;
      await chai.expect(_f(p, [1, 1])).to.eventually.be.rejectedWith("Assert Failed");
    }
  });

  it("Should fail to build witness for points outside the range", async () => {
    const p = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];
    await _f(p, [1, 1]);
    await _f(p, [max, max]);
    await chai.expect(_f(p, [max_plus_1, max])).to.eventually.be.rejectedWith("Assert Failed");
    await chai.expect(_f(p, [max, max_plus_1])).to.eventually.be.rejectedWith("Assert Failed");
    await chai.expect(_f(p, [max_plus_1, max_plus_1])).to.eventually.be.rejectedWith("Assert Failed");
  });

  it("Should find points that don't cross lines to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];
    const cases = [
      [1, 1], // bottom left of polygon
      [5, 5], // bottom left
      [1, 11], // left
      [11, 1], // bottom
      [1, 16], // top left
      [16, 1], // bottom right
      [16, 16], // top right
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];

      const witness = await circuit.calculateWitness({ polygon: polygon, point: c }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });

  it("Should find points that cross a single line to be inside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];
    const cases = [
      [10, 11],
      [11, 14],
      [14, 11],
      [14, 14],
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      const witness = await circuit.calculateWitness({ polygon: polygon, point: c }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    }
  });

  it("Should find points that cross 2 lines to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];
    const cases = [
      [16, 11],
      [16, 14],
      [10000, 14],
      [10000, 14],
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];

      const witness = await circuit.calculateWitness({ polygon: polygon, point: c }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });

  it("Should find points have the same y-coordinate as a vertex to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ];
    const cases = [
      // Bottom line
      [10, 10],
      [11, 10],
      [12, 10],
      [13, 10],
      [14, 10],
      [15, 10],
      [16, 10],
      // Top line
      [10, 15],
      [11, 15],
      [13, 15],
      [12, 15],
      [14, 15],
      [15, 15],
      [16, 15],
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];

      const witness = await circuit.calculateWitness({ polygon: polygon, point: c }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });
});

describe("Multiplier5", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    circuit = await _checkConstrainst("Multiplier5.circom", 4);
  });

  it("Should give the product of 5 numbers", async () => {
    const witness = await circuit.calculateWitness(
      {
        in: [1, 2, 3, 4, 5],
      },
      true
    );
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1 * 2 * 3 * 4 * 5)));
  });
});

describe("Intersects", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Intersects.circom");
    circuit = await wasm_tester(filepath);
    await circuit.loadConstraints();
    // assert.equal(circuit.constraints.length, 2929) // TODO: verify that this is expected
  });

  const test_transformations = async (cases, result) => {
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      var witness = await circuit.calculateWitness({ line1: c[0], line2: c[1] }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

      // flip order
      var witness = await circuit.calculateWitness({ line1: c[1], line2: c[0] }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

      // flip coordinates
      var witness = await circuit.calculateWitness({ line1: [c[0][1], c[0][0]], line2: [c[1][1], c[1][0]] }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
    }
  };

  it("Should fail to build witnesses for a degenerate line", async () => {
    const cases = [
      [
        [
          [0, 0],
          [0, 0],
        ],
        [
          [1, 0],
          [10, 0],
        ],
      ],
      [
        [
          [10, 10],
          [10, 10],
        ],
        [
          [1, 0],
          [10, 0],
        ],
      ],
    ];

    await chai.expect(test_transformations(cases, 1)).to.eventually.be.rejectedWith("Assert Failed");
  });

  it("Should recognise basic intersections", async () => {
    const cases = [
      [
        [
          [0, 0],
          [1, 1],
        ],
        [
          [1, 0],
          [0, 1],
        ],
      ],
      [
        [
          [0, 0],
          [10, 10],
        ],
        [
          [1, 0],
          [0, 1],
        ],
      ],
      [
        [
          [0, 10],
          [10, 10],
        ],
        [
          [5, 0],
          [5, 15],
        ],
      ],
    ];

    await test_transformations(cases, 1);
  });

  it("Should recognise non intersections", async () => {
    const cases = [
      // debug cases
      [
        [
          [0, 0],
          [0, 10],
        ],
        [
          [5, 5],
          [10, 10],
        ],
      ],
      // diagonal lines
      [
        // parallel
        [
          [0, 0],
          [1, 1],
        ],
        [
          [0, 1],
          [1, 2],
        ],
      ],
      [
        // t-shaped
        [
          [0, 0],
          [1, 1],
        ],
        [
          [1, 2],
          [2, 1],
        ],
      ],
      // horizontal first line
      [
        // parallel
        [
          [0, 10],
          [10, 10],
        ],
        [
          [0, 0],
          [10, 0],
        ],
      ],
      [
        // t-shaped
        [
          [0, 10],
          [10, 10],
        ],
        [
          [11, 0],
          [11, 15],
        ],
      ],
    ];
    await test_transformations(cases, 0);
  });

  it("Should recognise edge cases where we're on the line segment", async () => {
    cases = [
      // Diagonal
      [
        // Not collinear
        [
          [0, 0],
          [5, 5],
        ],
        [
          [3, 3],
          [5234, 43],
        ],
      ],
      [
        // Collinear
        [
          [0, 0],
          [5, 5],
        ],
        [
          [3, 3],
          [100, 100],
        ],
      ],
      // Horizontal
      [
        // Not collinear
        [
          [0, 10],
          [10, 10],
        ],
        [
          [5, 10],
          [2435, 543],
        ],
      ],
      [
        // Collinear
        [
          [0, 10],
          [10, 10],
        ],
        [
          [5, 10],
          [2435, 10],
        ],
      ],
    ];
    await test_transformations(cases, 1);
  });

  it("Should reject collinear cases where we're not on the line segment", async () => {
    cases = [
      // Diagonal
      [
        [
          [0, 0],
          [5, 5],
        ],
        [
          [6, 6],
          [7, 7],
        ],
      ],
      // Horizontal
      [
        [
          [0, 10],
          [10, 10],
        ],
        [
          [11, 10],
          [2435, 10],
        ],
      ],
    ];
    await test_transformations(cases, 0);
  });
});

describe("OnSegment", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "OnSegment.circom");
    circuit = await wasm_tester(filepath);
    await circuit.loadConstraints();
    // assert.equal(circuit.constraints.length, 206) // TODO: verify that this is expected
  });

  const line = [
    [5, 5],
    [10, 10],
  ];
  it("Should accept points on the line segment", async () => {
    const points = [
      [5, 5],
      [6, 6],
      [7, 7],
      [8, 8],
      [9, 9],
      [10, 10],
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    }
  });

  it("Should reject non collinear points inside the line's rectangle", async () => {
    const points = [
      [5, 6],
      [6, 7],
      [7, 8],
      [6, 5],
      [9, 6],
      [10, 9],
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });

  it("Should reject points outside the line's rectangle", async () => {
    const points = [
      [0, 0], // bottom left
      [0, 7], // left
      [0, 15], // top left
      [7, 15], // top
      [15, 15], // top right
      [15, 7], // right
      [15, 0], // bottom right
      [7, 0], // bottom
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });
});

describe("InRect", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "InRect.circom");
    circuit = await wasm_tester(filepath);
    await circuit.loadConstraints();
    assert.equal(circuit.constraints.length, 206); // TODO: verify that this is expected
  });

  const line = [
    [5, 5],
    [10, 10],
  ];
  it("Should accept when the point is on both projections", async () => {
    const points = [
      [5, 5],
      [5, 7],
      [5, 10],

      [7, 5],
      [7, 7],
      [7, 10],

      [10, 5],
      [10, 7],
      [10, 10],
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    }
  });

  it("Should reject when the point is on neither projection", async () => {
    const points = [
      [0, 0],
      [4, 4],
      [11, 11],
      [1000, 1000],
      [4, 11],
      [11, 4],
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });

  it("Should reject when the point is on one projection but not the other", async () => {
    const points = [
      [0, 5],
      [0, 7],
      [0, 10],

      [4, 5],
      [4, 7],
      [4, 10],

      [11, 5],
      [11, 7],
      [11, 10],
    ];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      var witness = await circuit.calculateWitness({ line: line, point: point }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));

      // reverse x and y
      var witness = await circuit.calculateWitness({ line: line, point: [point[1], point[0]] }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    }
  });
});

describe("Order", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Order.circom");
    circuit = await wasm_tester(filepath);
    await circuit.loadConstraints();
    assert.equal(circuit.constraints.length, 35); // TODO: verify that this is expected
  });

  it("Should return values in order", async () => {
    const cases = [
      [1234, 43],
      [84, 44],
      [0, 433],
      [0, 0],
      [12, 12],
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      const witness = await circuit.calculateWitness({ in: [c[0], c[1]] }, true);
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(Math.min(c[0], c[1]))));
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(Math.max(c[0], c[1]))));
    }
  });
});

describe("Orientation", function () {
  this.timeout(100000000);

  let circuit;
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Orientation.circom");
    circuit = await wasm_tester(filepath);
    await circuit.loadConstraints();
    assert.equal(circuit.constraints.length, 523); // TODO: verify that this is expected
  });

  const transform = (points, plusX, plusY, timesX, timesY) => {
    return points.map((p) => {
      return [(p[0] + plusX) * timesX, (p[1] + plusY) * timesY];
    });
  };

  // Tests an individual triplet
  const _testTriplets = async (a, b, c, result) => {
    const ps = [a, b, c];
    var witness = await circuit.calculateWitness({ points: ps }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    // stretches all the points times 10 in the x and y directions and makes sure the result still holds
    var witness = await circuit.calculateWitness({ points: transform(ps, 0, 0, 10, 1) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    var witness = await circuit.calculateWitness({ points: transform(ps, 0, 0, 1, 10) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    var witness = await circuit.calculateWitness({ points: transform(ps, 0, 0, 10, 10) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    // adds 10 to x and/or y and makes sure the result still holds
    var witness = await circuit.calculateWitness({ points: transform(ps, 10, 0, 1, 1) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    var witness = await circuit.calculateWitness({ points: transform(ps, 0, 10, 1, 1) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

    var witness = await circuit.calculateWitness({ points: transform(ps, 10, 10, 1, 1) }, true);
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
  };

  it("Should get the right orientation for sloped lines", async () => {
    // (a,b) is the line y=x
    const a = [0, 0];
    const b = [5, 5];

    // Build up our cases
    const clockwise = [
      [5, 0, 1],
      [1, 0, 1],
      [10, 0, 1],
      [10, 9, 1],
    ];
    const counterclockwise = clockwise.map((p) => [p[1], p[0], 2]); // swap x and y, i.e., mirror across y=x and expect counterclockwise result
    const collinear = [
      [0, 0, 0],
      [1, 1, 0],
      [10, 10, 0],
    ];
    const cases = clockwise.concat(counterclockwise, collinear);

    for (var i = 0; i < cases.length; i++) {
      await _testTriplets(a, b, [cases[i][0], cases[i][1]], cases[i][2]);
    }

    // try a downward sloped line
    // i.e., negate the x coordinate (and add 20 to make sure we're positive), and expect inverted results
    for (var i = 0; i < cases.length; i++) {
      await _testTriplets([20 - a[0], a[1]], [20 - b[0], b[1]], [20 - cases[i][0], cases[i][1]], [0, 2, 1][cases[i][2]]);
    }
  });

  it("Should get the right orientation for flat lines", async () => {
    // (a,b) is the line y=5
    const a = [0, 5];
    const b = [5, 5];
    const clockwise = [
      [0, 0],
      [5, 0],
      [10, 0],
      [10, 4],
    ];

    for (let i = 0; i < clockwise.length; i++) {
      await _testTriplets(a, b, clockwise[i], 1); // Clockwise
      await _testTriplets(a, b, [clockwise[i][0], 10 - clockwise[i][1]], 2); // Counterclockwise (note, f(y) = 10-y flips y about the line y=5)

      // swap x and y for vertical lines
    }
  });
});
async function _checkConstrainst(filename, expectedConstraintsLength) {
  const circuitPath = path.join(__dirname, filename);
  circuit = await wasm_tester(circuitPath);
  await circuit.loadConstraints();

  assert.equal(circuit.constraints.length, expectedConstraintsLength);
  return circuit;
}
