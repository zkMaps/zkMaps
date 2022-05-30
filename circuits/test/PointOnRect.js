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
        var filepath = path.join(__dirname, "PointOnRect.circom")
        circuit = await wasm_tester(filepath);
        await circuit.loadConstraints();
        assert.equal(circuit.constraints.length, 137); // TODO: verify that this is expected
    })

    it("Should be able to identify if a point is on a 5x5 rectangle", async () => {
        for (var x=0; x < 10; x++) {
            for (var y=0; y < 10; y++) {
                var witness = await circuit.calculateWitness({ "rect": [8,3], "point": [x, y] }, true);
                result = (x == 0 || y == 0 || x == 8 || y == 3) && x <= 8 && y <= 3 ? 1 : 0;
                assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
            }
        }
    })
})