#!/usr/bin/env bash
set -e

# This script basically automates the getting started process from https://docs.circom.io/getting-started

# $1 is the filename for the circuit

# Make sure we have a fresh .build directory for the circuit
mkdir -p ".build/groth16"
rm -rf ".build/groth16/$1"
mkdir -p ".build/groth16/$1"

# Make sure we have a fresh 'contracts' directory for the new compiled contract
mkdir -p contracts/groth16
rm -rf "contracts/groth16/$1"
mkdir -p "contracts/groth16/$1"

# Compile the circuits
circom "$1.circom" --r1cs --wasm --sym --c -o ".build/groth16/$1" || { echo 'compilation failed' ; exit 1; }
echo "Compilation successful"

# Build the witness
node ".build/groth16/$1/$1_js/generate_witness.js" ".build/groth16/$1/$1_js/$1.wasm" "$1_input.json" ".build/groth16/$1/witness.wtns" || { echo 'building the witness failed' ; exit 1; }
echo "Witness built"

# Create the trusted setup
snarkjs groth16 setup ".build/groth16/$1/$1.r1cs" ./ptau/powersOfTau28_hez_final_16.ptau ".build/groth16/$1/$1_0001.zkey" || { echo 'ptau failed' ; exit 1; }

snarkjs zkey export verificationkey ".build/groth16/$1/$1_0001.zkey" ".build/groth16/$1/verification_key.json" || { echo 'ptau failed' ; exit 1; }

start_time=$SECONDS
snarkjs groth16 prove ".build/groth16/$1/$1_0001.zkey" ".build/groth16/$1/witness.wtns" ".build/groth16/$1/proof.json" ".build/groth16/$1/public.json" || { echo 'proof generation failed' ; exit 1; }
elapsed=$(( SECONDS - start_time ))
echo "Proof built in $elapsed seconds"

# Verify proof
start_time=$SECONDS
snarkjs groth16 verify ".build/groth16/$1/verification_key.json" ".build/groth16/$1/public.json" ".build/groth16/$1/proof.json" || { echo 'verification failed' ; exit 1; }
elapsed=$(( SECONDS - start_time ))
echo "Verification successful in $elapsed seconds"

snarkjs zkey export solidityverifier "./.build/groth16/$1/$1_0001.zkey" "contracts/groth16/$1/Verifier$1.sol" || { echo 'proof generation contract failed' ; exit 1; }
echo "Verifier contract built"