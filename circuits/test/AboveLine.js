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

describe("Above Line Test", function () {
    this.timeout(100000000);

    var circuit;
    this.beforeAll(async () => {
        var filepath = path.join(__dirname, "AboveLine.circom")
        circuit = await wasm_tester(filepath);
        await circuit.loadConstraints();
        // assert.equal(circuit.constraints.length, 4347); // TODO: verify that this is expected
    })

    f = async (x, y, a, b) => {
        await circuit.calculateWitness({ "x": x, "y": y, "a": a, "b": b }, true)
    }

    it("Should fail to perform tests on vertices", async () => {
        for (var i=1; i<=64; i*=4) {
            for (var j=1; j<=64; j*=4) {
                await chai.expect(f(i, j, i, j)).to.eventually.be.rejectedWith("Assert Failed");
                await chai.expect(f(i, j, 0, 0)).to.eventually.be.rejectedWith("Assert Failed");
            }
        }
    })

    it("Should handle all cases on a 4x5 and 5x5 rectangle", async () => {
        /*
            4   1 1 1 X
            3   1 1 1 0
            2   1 1 0 0
            1   1 0 0 0
            0   X 0 0 0

                0 1 2 3
        */

        var rects = [[3,4], [4,4]];
        
        for (var k=0; k < rects.length; k++) {
            var x = rects[k][0];
            var y = rects[k][1];
            for (var a=0; a<=x; a++) {
                for (var b=0; b<=y; b++) {
                    if (y*a === x*b) {
                        await chai.expect(f(x, y, a, b)).to.eventually.be.rejectedWith("Assert Failed");
                    } else {
                        const result = y*a < x*b ? 1: 0; // y/x < b/a -> ay < bx
                        witness = await circuit.calculateWitness({ "x": x, "y": y, "a": a, "b": b }, true);
                        assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
                    }
                }
            }
        }
    })

    it("Should require consistent values of x, y, a, and b", async () => {
        var p_minus_1 = Fr.e("21888242871839275222246405745257275088548364400416034343698204186575808495616")
        var cases = [
            // a and b above x and y
            [10, 10, 11, 11],
            [10, 10, 11, 0],
            [10, 10, 0, 11],
            [100, 1, 2, 2],

            // x and y too high
            [p_minus_1, 10, 1, 1],
            [10, p_minus_1, 1, 1],

            // x and y negative
            [Fr.e(-1), 10, 1, 1],
            [10, Fr.e(-1), 1, 1],

            // a and b too high
            [10, 10, p_minus_1, 1],
            [10, 10, 1, p_minus_1],

            // a and b negative
            [10, 10, Fr.e(-1), 1],
            [10, 10, 1, Fr.e(-1)],
        ]

        for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            await chai.expect(f(c[0], c[1], c[2], c[3])).to.eventually.be.rejectedWith("Assert Failed");
        }
    })

    it("Should fail when the rectangle is a line", async () => {
        // horizontal lines of length 5
        for (var i=0; i<5; i++) {
            await chai.expect(f(4, 0, i, 0)).to.eventually.be.rejectedWith("Assert Failed");
        }

         // vertical lines of length 5
         for (var i=0; i<5; i++) {
            await chai.expect(f(0, 4, 0, i)).to.eventually.be.rejectedWith("Assert Failed");
        }
    })
})