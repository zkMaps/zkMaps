#!/usr/bin/env bash
set -e

for i in {1..1}; do
    time snarkjs plonk prove ".build/$1/$1_0001.zkey" ".build/$1/witness.wtns" ".build/$1/proof.json" ".build/$1/public.json" || { echo 'proof generation failed' ; exit 1; }
    snarkjs plonk verify ".build/$1/verification_key.json" ".build/$1/public.json" ".build/$1/proof.json" || { echo 'verification failed' ; exit 1; }
done

