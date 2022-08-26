#!/usr/bin/env bash
set -e

# This script basically automates the getting started process from https://docs.circom.io/getting-started

# $1 is the filename for the circuit

# Make sure we have a fresh .build directory for the circuit
mkdir -p .build/plonk
rm -rf ".build/plonk/$1"
mkdir ".build/plonk/$1"

# Make sure we have a fresh 'contracts' directory for the new compiled contract
rm -rf "contracts/plonk/$1"
mkdir "contracts/plonk/$1"

# Compile the circuits
circom "$1.circom" --r1cs --wasm --sym --c -o ".build/plonk/$1" || { echo 'compilation failed' ; exit 1; }
echo "Compilation successful"

# Build the witness
node ".build/plonk/$1/$1_js/generate_witness.js" ".build/plonk/$1/$1_js/$1.wasm" "$1_input.json" ".build/plonk/$1/witness.wtns" || { echo 'building the witness failed' ; exit 1; }
echo "Witness built"

# Create the trusted setup
snarkjs plonk setup ".build/plonk/$1/$1.r1cs" ./ptau/powersOfTau28_hez_final_17.ptau ".build/plonk/$1/$1_0001.zkey" || { echo 'ptau failed' ; exit 1; }

start_time=$SECONDS
snarkjs plonk prove ".build/plonk/$1/$1_0001.zkey" ".build/plonk/$1/witness.wtns" ".build/plonk/$1/proof.json" ".build/plonk/$1/public.json" || { echo 'proof generation failed' ; exit 1; }
elapsed=$(( SECONDS - start_time ))
echo "Proof built in $elapsed seconds"

snarkjs zkey export verificationkey ".build/plonk/$1/$1_0001.zkey" ".build/plonk/$1/verification_key.json" || { echo 'verification_key failed' ; exit 1; }

# Verify proof
start_time=$SECONDS
snarkjs plonk verify ".build/plonk/$1/verification_key.json" ".build/plonk/$1/public.json" ".build/plonk/$1/proof.json"
elapsed=$(( SECONDS - start_time ))
echo "Verification successful in $elapsed seconds"

snarkjs zkey export solidityverifier "./.build/plonk/$1/$1_0001.zkey" "contracts/plonk/$1/Verifier_$1.sol" || { echo 'solidityverifier failed' ; exit 1; }
echo "Verifier contract built"

snarkjs zkey export soliditycalldata ".build/plonk/$1/public.json" ".build/plonk/$1/proof.json"
echo "Smart Contract verification successful"