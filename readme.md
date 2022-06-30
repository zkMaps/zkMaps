## Notion
https://www.notion.so/4fb730fe3eab4c5193120e0964990e19?v=ba4ff15f168f46a5be9c04352db18827

## Contracts details
- **in Colorado** Verifier.sol deployed to eth-mainnet: `0x2c2b1601ccb2e2d40812de8168737cc44a63ed61` 
- [mumbai polygon scan](https://mumbai.polygonscan.com/address/0x2c2b1601ccb2e2d40812de8168737cc44a63ed61)
- **in Colorado** Verifier.sol deployed to polygon-mumabi: `0xB5217d3E37F12F89138113534953E1b9583e4F3B` 
- [mumbai polygon scan](https://mumbai.polygonscan.com/address/0xB5217d3E37F12F89138113534953E1b9583e4F3B)
- initial Verifier.sol deployed to harmony-testnet: `0x801d67C424709428Ed0eCf5507ddA3040Cd84835` 
- [harmony testnet scan](https://explorer.pops.one/address/0x801d67C424709428Ed0eCf5507ddA3040Cd84835?activeTab=2)


## Using the build script

1. `npm install`
2. `cd circuits`
3.  `./full_build.sh AtEthDenver` to test the environment with a basic circuit

## Circom

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


## api proof generation
- end point: https://zk-maps.vercel.app
- monitor: https://vercel.com/zkmaps/zk-maps/GTNfdqtqdmYRJKUcxNcWC6xAXRJp
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

# Formatting Coordinates

There are no negative numbers in circom, so we add 90 to latitude and 180 to longitude, so that the numbers are between 0-180 for latitude, and 0-360 for longitude.
There are no floats in circom either, but we have different precision requirements for AtEthDenver and InColorado, vs in the treasure hunt.
For AtEthDenver/InColorado multiply by 10^14. For the treasure hunt multiply by 1000 and truncate the rest of the digits.
