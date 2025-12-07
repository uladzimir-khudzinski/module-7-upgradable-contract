require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    coreTestnet: {
      url: process.env.CORE_TESTNET_RPC_URL,
      accounts: [process.env.CORE_TESTNET_PRIVATE_KEY],
      chainId: 1114
    }
  }
};

