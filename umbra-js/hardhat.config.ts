import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, './.env') });

import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

const chainIds = {
  ganache: 1337,
  sepolia: 11155111,
  hardhat: 1337,
  mainnet: 1,
  //gnosis_chain: 100,
};

// Ensure that we have all the environment variables we need.
const mnemonic = 'test test test test test test test test test test test junk';

let HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_: string | undefined =
  process.env.HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET;
if (!HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET in a .env file');
}
let HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_;

function createTestnetConfig(network: keyof typeof chainIds, https_network_url: string): NetworkUserConfig {
  const url = https_network_url;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        url: HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET,
      },
      chainId: chainIds.hardhat,
      accounts: {
        count: 100,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/1'/0",
      },
    },
    sepolia: createTestnetConfig('sepolia', HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET),
  },
  paths: {
    cache: './cache',
    tests: './test',
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 120000,
  },
};

export default config;
