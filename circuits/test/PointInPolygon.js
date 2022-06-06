const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Orientation", function () {
    this.timeout(100000000);

    var circuit;
    this.beforeAll(async () => {
        var filepath = path.join(__dirname, "Orientation.circom")
        circuit = await wasm_tester(filepath);
        await circuit.loadConstraints();
        assert.equal(circuit.constraints.length, 523); // TODO: verify that this is expected
    })

    var transform = (points, plusX, plusY, timesX, timesY) => {
        return points.map((p)=>{
            return [(p[0]+plusX)*timesX, (p[1]+plusY)*timesY]
        })
    }

    // Tests an individual triplet
    var t = async (a,b,c, result) => {
        var ps = [a,b,c]
        var witness = await circuit.calculateWitness({ "points": ps }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

        // stretches all the points times 10 in the x and y directions and makes sure the result still holds
        var witness = await circuit.calculateWitness({ "points": transform(ps, 0, 0, 10, 1) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
        
        var witness = await circuit.calculateWitness({ "points": transform(ps, 0, 0, 1, 10) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

        var witness = await circuit.calculateWitness({ "points": transform(ps, 0, 0, 10, 10) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

        // adds 10 to x and/or y and makes sure the result still holds
        var witness = await circuit.calculateWitness({ "points": transform(ps, 10, 0, 1, 1) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

        var witness = await circuit.calculateWitness({ "points": transform(ps, 0, 10, 1, 1) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));

        var witness = await circuit.calculateWitness({ "points": transform(ps, 10, 10, 1, 1) }, true);
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
    }

    it("Should get the right orientation for sloped lines", async () => {
        // (a,b) is the line y=x
        var a = [0,0]
        var b = [5,5]
    
        // Build up our cases
        var clockwise = [
            [5,0,1],
            [1,0,1],
            [10,0,1],
            [10,9,1],
        ]
        var counterclockwise = clockwise.map(p => [p[1], p[0], 2]) // swap x and y, i.e., mirror across y=x and expect counterclockwise result
        var colinear = [
            [0,0, 0],
            [1,1, 0],
            [10,10, 0],
        ]
        var cases = clockwise.concat(counterclockwise, colinear)

        for (var i=0; i<cases.length; i++) {
            await t(a,b,[cases[i][0], cases[i][1]], cases[i][2]);
        }

        // try a downward sloped line
        // i.e., negate the x coordinate (and add 20 to make sure we're positive), and expect inverted results
        for (var i=0; i<cases.length; i++) {
            await t(
                [20 - a[0], a[1]],
                [20 - b[0], b[1]],
                [
                    20-cases[i][0],
                    cases[i][1],
                ],
                [0,2,1][cases[i][2]],
        );
        }
    })

    it("Should get the right orientation for flat lines", async () => {
        // (a,b) is the line y=5
        var a = [0,5]
        var b = [5,5]
        var clockwise = [
            [0,0],
            [5,0],
            [10, 0],
            [10, 4]
        ]

        for (var i=0; i<clockwise.length; i++) {
            await t(a,b,clockwise[i], 1); // Clockwise
            await t(a,b, [clockwise[i][0], 10 - clockwise[i][1]], 2); // Counterclockwise (note, f(y) = 10-y flips y about the line y=5)
            
            // swap x and y for vertical lines
        }
    })
})
