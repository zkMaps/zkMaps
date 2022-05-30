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

    it("Should consider vertices to be below the line", async () => {
        for (var i=1; i<=64; i*=4) {
            for (var j=1; j<=64; j*=4) {
                var witness = await circuit.calculateWitness({ "x": i, "y": j, "a": i, "b": j }, true);
                assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));

                witness = await circuit.calculateWitness({ "x": i, "y": j, "a": 0, "b": 0 }, true);
                assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
            }
        }
    })

    it("Should handle all cases on a 4x5 rectangle", async () => {
        /*
            4   1 1 1 0
            3   1 1 1 0
            2   1 1 0 0
            1   1 0 0 0
            0   0 0 0 0

                0 1 2 3
        */

        for (var i=0; i<4; i++) {
            for (var j=0; j<5; j++) {
                witness = await circuit.calculateWitness({ "x": 3, "y": 4, "a": i, "b": j }, true);
                const result = 4*i < 3*j ? 1: 0; // y/x < b/a -> ay < bx -> 4i < 3j
                assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
            }
        }
    })

    it("Should require positive x and y", async () => {
        f = async (x, y, a, b) => {
            await circuit.calculateWitness({ "x": x, "y": y, "a": a, "b": b }, true)
        }
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
            [-1, 10, 1, 1],
            [10, -1, 1, 1],

            // a and b too high
            [10, 10, p_minus_1, 1],
            [10, 10, 1, p_minus_1],

            // a and b negative
            [10, 10, -1, 1],
            [10, 10, 1, -1],
        ]

        for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            await chai.expect(f(c[0], c[1], c[2], c[3])).to.eventually.be.rejectedWith("Assert Failed");
        }
    })

    it("Should require small positive a and b")
})