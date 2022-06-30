import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const {
  MNEMONIC = "test test test test test test test test test test test fake",
  INFURA_MAINNET_KEY,
} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const mainnetGwei = 84;
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.6.11",
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_MAINNET_KEY}`, // <---- YOUR INFURA ID! (or it won't work)
      //      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: mainnetGwei * 1000000000,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    development: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
        initialIndex: 3,
      },
    },
    polygon: {
      url: "https://rpc-mainnet.matic.today",
      chainId: 137,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
      },
    },
    harmonytest: {
      url: `https://api.s0.b.hmny.io`,
      chainId: 1666700000,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
        initialIndex: 3,
      },
    },
    harmony: {
      url: `https://api.harmony.one`,
      chainId: 1666600000,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
        initialIndex: 3,
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
