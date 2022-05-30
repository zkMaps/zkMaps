const chai = require("chai");
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
        var filepath = path.join(__dirname, "..", "AboveLine.circom")
        circuit = await wasm_tester(filepath);
        await circuit.loadConstraints();
        assert.equal(circuit.constraints.length, 3171); // TODO: verify that this is expected
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
})