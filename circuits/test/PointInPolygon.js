const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const wasm_tester = require("circom_tester").wasm
const Scalar = require("ffjavascript").Scalar

chai.use(chaiAsPromised)
chai.should()

exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
)
const Fr = new F1Field(exports.p)

const assert = chai.assert

describe("Simple Polygon", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Simple5.circom")
    const EXPECTED_CONSTRAINTS_FOR_5_VERTICS = 22009
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()

    assert.equal(circuit.constraints.length, EXPECTED_CONSTRAINTS_FOR_5_VERTICS) 
  })

  it("Should make sure we can't repeat points in sequence", async () => {
    await chai
      .expect(
        _test_permutations(
          [
            [0, 0],
            [0, 0],
            [5, 0],
            [5, 5],
            [0, 5],
          ],
          0
        ) // shape is a counterclockwise square
      )
      .to.eventually.be.rejectedWith("Assert Failed") // can't do line intersections for lines that are just points
  })

  it.only("Should make sure we can't repeat points out of sequence", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 10],
        [0, 0],
        [5, 0],
        [5, 5],
      ],
      0
    ) // shape is a "b" with a trianglular loop
  })

  it("Should make sure we can't go back along a line segment", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 10],
        [0, 5],
        [5, 5],
        [5, 0],
      ],
      0
    ) // shape is a "b" with a square loop
  })

  it("Should make sure we can't touch the middle of a line segment", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 20],
        [10, 15],
        [0, 10],
        [5, 15],
      ],
      0
    ) // shape is a "B" with triangular loops
  })

  it("Should make sure we can't cross a line", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 5],
        [10, 5],
        [5, 10],
        [5, 0],
      ],
      0
    ) // shape is a fish swimming to the bottom left, made of a square and a triangle
  })

  it("Should allow basic convex pentagons", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 10],
        [5, 15],
        [10, 10],
        [10, 0],
      ],
      1
    ) // shape is a an irregular pentagon in a house shape
  })

  it("Should allow concave shapes", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 10],
        [5, 5],
        [10, 10],
        [10, 0],
      ],
      1
    ) // shape is an "M" with a closed bottom
  })

  it("Should allow squares with broken up sides", async () => {
    await _test_permutations(
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
        [5, 0],
      ],
      1
    ) // shape is a simple sqaure with a vertex on the left hand side
  })

  it("Should allow simple polygons where some vertices sit in other lines' bounding rects", async () => {
    await _test_permutations(
      [
        [0, 0],
        [10, 10],
        [6, 5],
        [5, 4],
        [4, 3],
      ],
      1
    ) // shape is a tilted trapezium
  })

  async function _test_permutations (polygon, result) {
    // cycle points around
    let i = 0
    while (i < 5) {
      i++
      polygon.unshift(polygon.pop())
      let witness = await circuit.calculateWitness({ polygon }, true)
      // assert(Fr.eq(Fr.e(witness[1]), Fr.e(result))) // assert equal field exponent of the result and the witness.
      await circuit.assertOut(witness, {out: result})

      // try the reversed polygon
      polygon.reverse()
      witness = await circuit.calculateWitness({ polygon: polygon }, true)
      await circuit.assertOut(witness, {out: result})

      polygon.reverse()
    }
  }
})

describe("Ray Tracing", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "RayTracing4.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    assert.equal(circuit.constraints.length, 16853) // TODO: verify that this is expected

    // // measure the size of the circuit
    // var fp2 = path.join(__dirname, "RayTracing5.circom")
    // c2 = await wasm_tester(fp2)
    // await c2.loadConstraints()
    // assert.equal(c2.constraints.length, 20808) // TODO: verify that this is expected
  })

  const f = async (polygon, point) => {
    await circuit.calculateWitness({ polygon: polygon, point: point }, true)
  }

  const max = Fr.e("4294967295")
  const max_plus_1 = Fr.e("4294967296")
  it("Should fail to build witness for vertices outside the range", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]

    // test each part of the polygon
    for (let i = 0; i < 4; i++) {
      // both coordinates must be less than 2^32
      for (let j = 0; j < 2; j++) {
        // passing for 2^32-1
        const p = JSON.parse(JSON.stringify(polygon))
        p[i][j] = max
        await f(p, [1, 1])

        // failing for 2^32
        p[i][j] = max_plus_1
        await chai
          .expect(f(p, [1, 1]))
          .to.eventually.be.rejectedWith("Assert Failed")
      }

      // y can be 0
      const p = JSON.parse(JSON.stringify(polygon))
      p[i][1] = 0
      await f(p, [1, 1])

      // x can't be 0
      p[i][0] = 0
      await chai
        .expect(f(p, [1, 1]))
        .to.eventually.be.rejectedWith("Assert Failed")
    }
  })

  it("Should fail to build witness for points outside the range", async () => {
    const p = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]
    await f(p, [1, 1])
    await f(p, [max, max])
    await chai
      .expect(f(p, [max_plus_1, max]))
      .to.eventually.be.rejectedWith("Assert Failed")
    await chai
      .expect(f(p, [max, max_plus_1]))
      .to.eventually.be.rejectedWith("Assert Failed")
    await chai
      .expect(f(p, [max_plus_1, max_plus_1]))
      .to.eventually.be.rejectedWith("Assert Failed")
  })

  it("Should find points that don't cross lines to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]
    const cases = [
      [1, 1], // bottom left of polygon
      [5, 5], // bottom left
      [1, 11], // left
      [11, 1], // bottom
      [1, 16], // top left
      [16, 1], // bottom right
      [16, 16], // top right
    ]

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]

      const witness = await circuit.calculateWitness(
        { polygon: polygon, point: c },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })

  it("Should find points that cross a single line to be inside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]
    const cases = [
      [10, 11],
      [11, 14],
      [14, 11],
      [14, 14],
    ]

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]
      const witness = await circuit.calculateWitness(
        { polygon: polygon, point: c },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
    }
  })

  it("Should find points that cross 2 lines to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]
    const cases = [
      [16, 11],
      [16, 14],
      [10000, 14],
      [10000, 14],
    ]

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]

      const witness = await circuit.calculateWitness(
        { polygon: polygon, point: c },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })

  it("Should find points have the same y-coordinate as a vertex to be outside the polygon", async () => {
    const polygon = [
      [10, 10],
      [10, 15],
      [15, 15],
      [15, 10],
    ]
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
    ]

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]

      const witness = await circuit.calculateWitness(
        { polygon: polygon, point: c },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })
})

describe("Multiplier5", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Multiplier5.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    assert.equal(circuit.constraints.length, 4) // TODO: verify that this is expected
  })

  it("Should give the product of 5 numbers", async () => {
    const witness = await circuit.calculateWitness(
      { in: [1, 2, 3, 4, 5] },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1 * 2 * 3 * 4 * 5)))
  })
})

describe("Intersects", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Intersects.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    // assert.equal(circuit.constraints.length, 2929) // TODO: verify that this is expected
  })

  const test_transformations = async (cases, result) => {
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]
      var witness = await circuit.calculateWitness(
        { line1: c[0], line2: c[1] },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

      // flip order
      var witness = await circuit.calculateWitness(
        { line1: c[1], line2: c[0] },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

      // flip coordinates
      var witness = await circuit.calculateWitness(
        { line1: [c[0][1], c[0][0]], line2: [c[1][1], c[1][0]] },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))
    }
  }

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
    ]

    await chai
      .expect(test_transformations(cases, 1))
      .to.eventually.be.rejectedWith("Assert Failed")
  })

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
    ]

    await test_transformations(cases, 1)
  })

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
    ]
    await test_transformations(cases, 0)
  })

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
    ]
    await test_transformations(cases, 1)
  })

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
    ]
    await test_transformations(cases, 0)
  })
})

describe("OnSegment", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "OnSegment.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    // assert.equal(circuit.constraints.length, 206) // TODO: verify that this is expected
  })

  const line = [
    [5, 5],
    [10, 10],
  ]
  it("Should accept points on the line segment", async () => {
    const points = [
      [5, 5],
      [6, 6],
      [7, 7],
      [8, 8],
      [9, 9],
      [10, 10],
    ]

    for (let i = 0; i < points.length;i++) {
      const point = points[i]
      const witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
    }
  })

  it("Should reject non collinear points inside the line's rectangle", async () => {
    const points = [
      [5, 6],
      [6, 7],
      [7, 8],
      [6, 5],
      [9, 6],
      [10, 9],
    ]

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })

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
    ]

    for (let i = 0; i < points.length;i++) {
      const point = points[i]
      const witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })
})

describe("InRect", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "InRect.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    assert.equal(circuit.constraints.length, 206) // TODO: verify that this is expected
  })

  const line = [
    [5, 5],
    [10, 10],
  ]
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
    ]

    for (let i = 0; i < points.length;i++) {
      const point = points[i]
      const witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
    }
  })

  it("Should reject when the point is on neither projection", async () => {
    const points = [
      [0, 0],
      [4, 4],
      [11, 11],
      [1000, 1000],
      [4, 11],
      [11, 4],
    ]

    for (let i = 0; i < points.length;i++) {
      const point = points[i]
      const witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })

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
    ]

    for (let i = 0; i < points.length;i++) {
      const point = points[i]
      var witness = await circuit.calculateWitness(
        { line: line, point: point },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))

      // reverse x and y
      var witness = await circuit.calculateWitness(
        { line: line, point: [point[1], point[0]] },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
    }
  })
})

describe("Order", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Order.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    assert.equal(circuit.constraints.length, 35) // TODO: verify that this is expected
  })

  it("Should return values in order", async () => {
    const cases = [
      [1234, 43],
      [84, 44],
      [0, 433],
      [0, 0],
      [12, 12],
    ]

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i]
      const witness = await circuit.calculateWitness(
        { in: [c[0], c[1]] },
        true
      )
      assert(Fr.eq(Fr.e(witness[1]), Fr.e(Math.min(c[0], c[1]))))
      assert(Fr.eq(Fr.e(witness[2]), Fr.e(Math.max(c[0], c[1]))))
    }
  })
})

describe("Orientation", function () {
  this.timeout(100000000)

  let circuit
  this.beforeAll(async () => {
    const filepath = path.join(__dirname, "Orientation.circom")
    circuit = await wasm_tester(filepath)
    await circuit.loadConstraints()
    assert.equal(circuit.constraints.length, 523) // TODO: verify that this is expected
  })

  const transform = (points, plusX, plusY, timesX, timesY) => {
    return points.map((p) => {
      return [(p[0] + plusX) * timesX, (p[1] + plusY) * timesY]
    })
  }

  // Tests an individual triplet
  const t = async (a, b, c, result) => {
    const ps = [a, b, c]
    var witness = await circuit.calculateWitness({ points: ps }, true)
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    // stretches all the points times 10 in the x and y directions and makes sure the result still holds
    var witness = await circuit.calculateWitness(
      { points: transform(ps, 0, 0, 10, 1) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    var witness = await circuit.calculateWitness(
      { points: transform(ps, 0, 0, 1, 10) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    var witness = await circuit.calculateWitness(
      { points: transform(ps, 0, 0, 10, 10) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    // adds 10 to x and/or y and makes sure the result still holds
    var witness = await circuit.calculateWitness(
      { points: transform(ps, 10, 0, 1, 1) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    var witness = await circuit.calculateWitness(
      { points: transform(ps, 0, 10, 1, 1) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))

    var witness = await circuit.calculateWitness(
      { points: transform(ps, 10, 10, 1, 1) },
      true
    )
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)))
  }

  it("Should get the right orientation for sloped lines", async () => {
    // (a,b) is the line y=x
    const a = [0, 0]
    const b = [5, 5]

    // Build up our cases
    const clockwise = [
      [5, 0, 1],
      [1, 0, 1],
      [10, 0, 1],
      [10, 9, 1],
    ]
    const counterclockwise = clockwise.map((p) => [p[1], p[0], 2]) // swap x and y, i.e., mirror across y=x and expect counterclockwise result
    const collinear = [
      [0, 0, 0],
      [1, 1, 0],
      [10, 10, 0],
    ]
    const cases = clockwise.concat(counterclockwise, collinear)

    for (var i = 0; i < cases.length; i++) {
      await t(a, b, [cases[i][0], cases[i][1]], cases[i][2])
    }

    // try a downward sloped line
    // i.e., negate the x coordinate (and add 20 to make sure we're positive), and expect inverted results
    for (var i = 0; i < cases.length; i++) {
      await t(
        [20 - a[0], a[1]],
        [20 - b[0], b[1]],
        [20 - cases[i][0], cases[i][1]],
        [0, 2, 1][cases[i][2]]
      )
    }
  })

  it("Should get the right orientation for flat lines", async () => {
    // (a,b) is the line y=5
    const a = [0, 5]
    const b = [5, 5]
    const clockwise = [
      [0, 0],
      [5, 0],
      [10, 0],
      [10, 4],
    ]

    for (let i = 0; i < clockwise.length; i++) {
      await t(a, b, clockwise[i], 1) // Clockwise
      await t(a, b, [clockwise[i][0], 10 - clockwise[i][1]], 2) // Counterclockwise (note, f(y) = 10-y flips y about the line y=5)

      // swap x and y for vertical lines
    }
  })
})
