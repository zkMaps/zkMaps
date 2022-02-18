# Verify proof
snarkjs groth16 verify "./verification_key.json" "./public.json" "./proof.json" || { echo 'verification failed' ; exit 1; }
echo "Verification successful"