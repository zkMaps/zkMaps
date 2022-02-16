## Using the build script

1. `cd circuits`
2. `./full_build.sh basic` to test the environment with a simple circuit
3.  `./full_build.sh AtEthDenver` to build the AtEthDenver circuit

## Circom

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


## Contracts details
- initial Verifier.sol deployedto polygon-mumabi: `0x420edb0c08654eA0Deac07979697663db08E0548` 
- [mumbai polygon scan](https://mumbai.polygonscan.com/address/0x420edb0c08654eA0Deac07979697663db08E0548)
- initial Verifier.sol deployedto harmony-testnet: `0x801d67C424709428Ed0eCf5507ddA3040Cd84835` 
- [harmony testnet scan](https://explorer.pops.one/address/0x801d67C424709428Ed0eCf5507ddA3040Cd84835?activeTab=2)

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

