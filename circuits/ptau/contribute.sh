#!/usr/bin/env bash

# Contributes to the powers of tau ceremony
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v || { echo 'ptau failed' ; exit 1; }