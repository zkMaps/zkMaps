
# Build the proof
snarkjs powersoftau prepare phase2 ptau/pot12_0001.ptau ptau/pot12_final.ptau -v || { echo 'ptau failed' ; exit 1; }
snarkjs groth16 setup "./$1.r1cs" ptau/pot12_final.ptau "./$1_0001.zkey" || { echo 'ptau failed' ; exit 1; }
snarkjs zkey export verificationkey "./$1_0001.zkey" "./verification_key.json" || { echo 'ptau failed' ; exit 1; }
snarkjs groth16 prove "./$1_0001.zkey" "./witness.wtns" "./proof.json" "./public.json" || { echo 'proof generation failed' ; exit 1; }
# echo "Proof built"
snarkjs zkey export solidityverifier "./$1_0001.zkey" "../contracts/Verifier.sol" || { echo 'proof generation contract failed' ; exit 1; }
echo "Verifier contract built"
