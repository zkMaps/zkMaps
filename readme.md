# zkMaps 

📍🗺️ | ⛓️ | 🔏

zkMaps is a tool to verify if a user is within a certain geographic area without giving away their exact location. 
This repository is composed of the circuits which enable the deployment of a verifier contract and the creation of the location proof by the end user. 

You can check our [Dune](https://dune.com/zkmaps/zkmaps) dashboard. 

## Roadmap
https://shrouded-fruitadens-1ef.notion.site/ZKmaps-roadmap-epics-18196ee96b4f4a2982fa1ec05f1c920e

## API proof generation
- end point: https://zk-maps.vercel.app
- monitor: https://vercel.com/zkmaps/zk-maps/GTNfdqtqdmYRJKUcxNcWC6xAXRJp

## Compiling and deploying circuits

### 1. Compiling .circom circuits

A. Install dependencies
```npm install```
B. Go to the circuits directory:
```cd circuits```
C. Compile circuits:
```./full_build.sh <CIRCUIT-NAME>```

### 2. Create proof on client

You can create proofs in a CLI (as explained in the `circuits/readme.md`) or in a client like our implementation at [https://zkmaps.vercel.app/](https://zkmaps.vercel.app/) (can find the implementation at [github.com/zkMaps/client](https://github.com/zkMaps/client)). 

To create proofs on a web client, circuit files must be available. We are currently using IPFS to upload and access `.zkey` and `.wasm` files.

### 3. Deploy smart contract

A. We recommend installing [hh](https://hardhat.org/hardhat-runner/docs/guides/command-line-completion) as a global dependency.
```npm install --global hardhat-shorthand```

B. Set a deployment script in the `deploy` directory

C. Set your deployer address' MNEMONIC or Private Key at `.env`. You can duplicate `.env.template` to do so.

D. Ultimately run the command below. Make sure to do so from the root directory.

```hh deploy --network mumbai```



You will be able to access ABI and contract address from `deployments/<NETWORK>/Verifier<CIRCUIT-NAME>.json`. This information will be needed by the client to parse data from the contract.

## Contracts details
### Private Zones 
- VerifierRayTracing6  `polygon` [0x0Eb82353271c162256b15BA540b10303F209F636](https://polygonscan.com/address/0x0Eb82353271c162256b15BA540b10303F209F636)

### Public Zones 
- VerifierRayTracing6  `polygon` [0x97006Df5D736EA002a768245dfD289B648bbE610](https://polygonscan.com/address/0x97006Df5D736EA002a768245dfD289B648bbE610)

- VerifierRayTracing6  `mumbai` [0x0a23af15ce2642689aF312B8A570534731285E83](https://mumbai.polygonscan.com/address/0x0a23af15ce2642689aF312B8A570534731285E83)


