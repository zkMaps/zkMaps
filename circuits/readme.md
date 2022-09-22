# Circom Commands

First, install circom 2.0.4. [Steps](https://docs.circom.io/getting-started/installation/#installing-circom).

steps: (https://docs.circom.io/getting-started/proving-circuits/)
1. `cd circuits`
2. `circom init.circom --r1cs --wasm --sym --c`
3. `cd init_js`
4. confir `input.json` is in the foler `{a:1, b:33}`
5. `node generate_witness.js init.wasm input.json ../witness.wtns` 
-- powet of TAU - encryption
6. `snarkjs powersoftau new bn128 12 pot12_0000.ptau -v`
7. `snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v` // 'ABC' enthropy - secret
-- phase 2
8. `snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v`
9. `snarkjs groth16 setup init.r1cs pot12_final.ptau init.zkey`
10. `snarkjs zkey contribute init.zkey init.zkey --name="1st Contributor Name" -v`
11. `snarkjs zkey export verificationkey init.zkey verification_key.json`
-- generating proof
12. `snarkjs groth16 prove init.zkey witness.wtns proof.json public.json`
-- verify proof
13. `snarkjs groth16 verify verification_key.json public.json proof.json`
-- export contract verifier
14. `snarkjs zkey export solidityverifier init.zkey ../contracts/Verifier.sol`

### Formatting Coordinates

There are no negative numbers in circom, so we add 90 to latitude and 180 to longitude, so that the numbers are between 0-180 for latitude, and 0-360 for longitude.
There are no floats in circom either, but we have different precision requirements for AtEthDenver and InColorado, vs in the treasure hunt.
For AtEthDenver/InColorado multiply by 10^14. For the treasure hunt multiply by 1000 and truncate the rest of the digits.