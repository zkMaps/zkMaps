#!/usr/bin/env bash

# This script basically automates the getting started process from https://docs.circom.io/getting-started

# $1 is the filename for the circuit
# $2 is the input file
# Make sure we have a fresh .build directory for the circuit
mkdir -p .build
rm -rf ".build/$1"
mkdir ".build/$1"

# Compile the circuits
circom "$1.circom" --r1cs --wasm --sym --c -o ".build/$1"

# Build the witness
node "./.build/$1/$1_js/generate_witness.js" "./.build/$1/$1_js/$1.wasm" $2 "./.build/$1/witness.wtns"

# Build the proof
snarkjs powersoftau prepare phase2 ptau/pot12_0001.ptau ptau/pot12_final.ptau -v
snarkjs groth16 setup "./.build/$1/$1.r1cs" ptau/pot12_final.ptau "./.build/$1/$1_0001.zkey"
snarkjs zkey export verificationkey "./.build/$1/$1_0001.zkey" "./.build/$1/verification_key.json"
snarkjs groth16 prove "./.build/$1/$1_0001.zkey" "./.build/$1/witness.wtns" "./.build/$1/proof.json" "./.build/$1/public.json"

# Verify proof
snarkjs groth16 verify "./.build/$1/verification_key.json" "./.build/$1/public.json" "./.build/$1/proof.json"
