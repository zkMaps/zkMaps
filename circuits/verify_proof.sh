#!/usr/bin/env bash
set -e

# Verify proof

snarkjs groth16 verify ".build/$1/verification_key.json" ".build/$1/public.json" ".build/$1/proof.json" || { echo 'verification failed' ; exit 1; }
echo "Verification successful"