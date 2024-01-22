import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, './.env') });

import { HardhatUserConfig } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';
import './tasks/accounts';
import './tasks/clean';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-web3';
import '@nomiclabs/hardhat-truffle5';
import '@nomiclabs/hardhat-ethers';
//import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-gas-reporter';

const chainIds = {
  ganache: 1337,
  hardhat: 1337,
  mainnet: 1,
  bsc: 56,
  //polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  sepolia: 11155111,
  goerli: 5,
  //gnosis_chain: 100,
};

// Ensure that we have all the environment variables we need.
// Note: So that the monorepo can be imported to other projects, we make these env variables
// optional so that typechain can still build its types without hard failing on this.
let mnemonic = '';
if (!process.env.MNEMONIC) {
  console.warn('MNEMONIC not found in .env file, using default mnemonic');
  mnemonic = 'test test test test test test test test test test test junk';
} else {
  mnemonic = process.env.MNEMONIC;
}

let HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_: string|undefined = process.env.HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET;
if (!HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET in a .env file');
}
let  HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET_

let HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET_: string|undefined = process.env.HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET;
if (!HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET in a .env file');
}
let  HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET_

let HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET_ = process.env.HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET
if (!HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET in a .env file');
}
let  HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET_;

let HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET_ = process.env.HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET
if (!HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET in a .env file');
}
let  HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET_;

let HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET_ = process.env.HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET
if (!HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET in a .env file');
}
let HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET_;

let HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET_ = process.env.HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET
if (!HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET_) {
  console.warn('Please set your HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET in a .env file');
}
let HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET: string = <string>HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET_;

/*let etherscanApiKey = '';
if (!process.env.ETHERSCAN_VERIFICATION_API_KEY) {
  console.warn('Please set your ETHERSCAN_VERIFICATION_API_KEY in a .env file');
} else {
  etherscanApiKey = process.env.ETHERSCAN_VERIFICATION_API_KEY;
}
*/
const shouldReportGas = process.env.REPORT_GAS === 'true';

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
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    // For testing deployments locally with forked anvil environments. For example, to test
    // deployment to sepolia with a local fork first run:
    // anvil --fork-url <YOUR-RPC> --mnemonic "test test test test test test test test test silent silent junk"
    anvil: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['sepolia'],
      url: 'http://127.0.0.1:8545',
    },
    sepolia: createTestnetConfig('sepolia', HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET),
    goerli: createTestnetConfig('goerli', HTTPS_ETH_RPC_PROVIDER_URL__GOERLI_TESTNET),
    mainnet: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['mainnet'],
      url: HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET,
      gasPrice: 60000000000, // 60 gwei
    },
    bsc: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['bsc'],
      url: HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET,
      gasPrice: 60000000000, // 60 gwei
    },
    /*
    polygon: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['polygon'],
      url: 'https://polygon-rpc.com/',
      gasPrice: 33000000000, // 33 gwei
    },
    */
    arbitrum: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['arbitrum'],
      url: HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET,
    },
    optimism: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['optimism'],
      url: HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET,
    },
    /*
    gnosis_chain: {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds['gnosis_chain'],
      url: 'https://rpc.ankr.com/gnosis',
    },
    */
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  gasReporter: {
    enabled: shouldReportGas,
    currency: 'USD',
    gasPrice: 200,
    excludeContracts: ['TestToken.sol', 'MockHook.sol', 'ERC20.sol'],
  },
  /*etherscan: {
    apiKey: etherscanApiKey,
  },*/
};

export default config;
