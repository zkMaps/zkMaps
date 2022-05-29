const chai = require("chai");
const path = require("path");
const fs = require("fs")

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Binary sum test", function () {
    this.timeout(100000000);

    var circuit;
    this.beforeAll(async () => {
        var filepath = path.join(__dirname, "..", "OutsideRectangle.circom")
        circuit = await wasm_tester(filepath);
        await circuit.loadConstraints();
        assert.equal(circuit.constraints.length, 1054); // TODO: verify that this is expected
    })

    it("Should accept lines fully outside one or more sides", async () => {
        /*
        Each radial line [x, x] should be considered outside the rectangle

        6   a . . b . . c 
        5   . a . b . c . 
        4   . . ._._. . . 
        3   h h | . | d d 
        2   . . ._._. . . 
        1   . g . f . e . 
        0   g . . f . . e 

            0 1 2 3 4 5 6
        */
        await check_circuit(circuit, [2,2,4,4], [
            [1,5,0,6], // Top Left
            [3,5,3,6], // Top
            [5,5,6,6], // Top Right
            [5,3,6,3], // Right
            [5,1,6,0], // Bottom Right
            [3,1,3,0], // Bottom
            [1,1,0,0], // Bottom Left
            [1,3,0,3], // Left

            [123415,47890,2283747,12389749847], // Distant Top Right
        ], 1)
    })
    
    it("Should reject lines with points on the rectangle", async () => {
        /*
        each line [x,x] has a point on the rectangle and should be rejected

        4   a . b . c
        3   . a_b_c .    
        2   h h . d d        
        1   . f_f_e .    
        0   g . f . e
        
            0 1 2 3 4
        */
        await check_circuit(circuit, [1, 1, 3, 3], [
            [0,4,1,3], // Top Left
            [2,4,2,3], // Top
            [4,4,3,3], // Top Right
            [4,2,3,2], // Right
            [4,0,3,1], // Bottom Right
            [2,0,2,1], // Bottom
            [0,0,1,1], // Bottom Left
            [0,2,1,2], // Left
        ], 0)

    })

    it("Should reject lines that cross the rectangle", async () => {
        /*
        Some lines cross the rectangle though both points lie outside it.
        For example the lines from 0 to 3, 0 to 4, and 0 to 5.

        4   0 . 1 . 2
        3   . ._._. .    
        2   7 | . | 3        
        1   . ._._. .    
        0   6 . 5 . 4
        
            0 1 2 3 4
        */
        
        var p = [[0,4], [2,4], [4,4], [4,2], [4,0], [2,0], [0,0], [0,2]];
        await check_circuit(circuit, [1,1,3,3], [
            [p[0], p[3]],
            [p[0], p[4]],
            [p[0], p[5]],
            [p[2], p[5]],
            [p[2], p[6]],
            [p[2], p[7]],
            [p[4], p[7]],
            [p[4], p[0]],
            [p[4], p[1]],
            [p[6], p[1]],
            [p[6], p[2]],
            [p[6], p[3]],
        ], 0)
    })

    it("Should reject lines that cross quadrants", async () => {
        /*
        Some lines actually sit outside the rectangle but can't be shown to be outside the rectangle with this constraint.
        Not worth testing extensively since we're largely interested in disproving the existence of false positives in this test.

        7   x . . . . . . .
        6   . \ . . . . . .
        5   . . \ . . . . .
        4   . . . \ . . . .
        3   . ._._. \ . . .    
        2   . | . | . \ . .        
        1   . ._._. . . \ .    
        0   . . . . . . . x
        
            0 1 2 3 4 5 6 7
        */
        await check_circuit(circuit, [1,1,3,3], [
            [0,7,7,0],
            [0,7,7,1],
            [0,7,7,2],
            [0,7,7,3],
        ], 0)
    })

    it("Should reject lines inside the rectangle", async () => {
        // arbitrary points inside the larger rectangle
        await check_circuit(circuit, [0,0,5,5], [
            [1,4,3,2],
            [3,1,4,3],
            [1,3,4,2],
            [0,4,3,4],
            [0,3,4,0],
        ], 0)
    });

    async function check_circuit(circuit, rect, lines, result) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const witness = await circuit.calculateWitness({ "rect": rect, "line": line }, true);
            assert(Fr.eq(Fr.e(witness[1]), Fr.e(result)));
        }
    }
});