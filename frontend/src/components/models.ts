import { BigNumber } from 'src/utils/ethers';
import { JsonRpcSigner, Web3Provider } from 'src/utils/ethers';
import type { TokenList, TokenInfo } from '@uniswap/token-lists/dist/types';
import { UmbraLogger } from 'components/logger';
import { ETH_NETWORK_LOGO } from 'src/utils/constants';

export type { TokenList, TokenInfo } from '@uniswap/token-lists/dist/types';
export { BigNumber } from 'src/utils/ethers';
export type { Network, TransactionResponse } from 'src/utils/ethers';
export type Signer = JsonRpcSigner;
export type Provider = Web3Provider;

export const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export interface MulticallResponse {
  blockNumber: BigNumber;
  returnData: string[];
}

// Spec: https://eips.ethereum.org/EIPS/eip-3085#specification
export type Chain = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    // The address and logoURI fields are not part of the EIP-3085 spec but are added to make this field
    // compatible with type TokenInfo
    address: typeof NATIVE_TOKEN_ADDRESS;
    name: string;
    symbol: string;
    decimals: 18;
    logoURI: string;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
  // logoURI is not part of EIP-3085, but is added for convenience because that is what our BaseSelect component
  // uses to display images form the chain objects it recevies. It's not required because we always want a chain
  // logo to be showin in the network selector dropdown
  logoURI?: string; // Must be optional so it can be deleted before calling `wallet_addEthereumChain`.
};

function get_required_env_var(varname: string): string {
  let varvalue = eval(`process.env.${varname}`);
  if (!varvalue) {
    let errmsg = `Please specify a required .env var '${varname}'.`;
    console.error(errmsg);
    throw errmsg;
  }
  return <string>varvalue;
}

export const supportedChains: Array<Chain> = [
    //эфир, бнб, оптимистик, арбитум
  {
    chainId: '0x1',
    chainName: 'Mainnet',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoURI: ETH_NETWORK_LOGO,
    },
    rpcUrls: [get_required_env_var("HTTPS_ETH_RPC_PROVIDER_URL__ETH_MAINNET")],
    blockExplorerUrls: [get_required_env_var("EXPLORER_URL__ETH_MAINNET")],
    iconUrls: [ETH_NETWORK_LOGO],
    logoURI: ETH_NETWORK_LOGO,
  },
  {
    chainId: '0xaa36a7', // 11155111 as hex
    chainName: 'Sepolia',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoURI: ETH_NETWORK_LOGO,
    },
    rpcUrls: [get_required_env_var("HTTPS_ETH_RPC_PROVIDER_URL__SEPOLIA_TESTNET")],
    blockExplorerUrls: [get_required_env_var("EXPLORER_URL__ETH_TESTNET_SEPOLIA")],
    iconUrls: [ETH_NETWORK_LOGO],
    logoURI: ETH_NETWORK_LOGO,
  },
  {
    chainId: '0xa', // 10 as hex
    chainName: 'Optimism',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoURI: ETH_NETWORK_LOGO,
    },
    rpcUrls: [get_required_env_var("HTTPS_ETH_RPC_PROVIDER_URL__OPTIMISM_MAINNET")],
    blockExplorerUrls: [
      get_required_env_var("EXPLORER_URL__OPTIMISM_MAINNET")],
    iconUrls: ['/networks/optimism.svg'],
    logoURI: '/networks/optimism.svg',
  },
  /*
  {
    chainId: '0x64', // 100 as hex
    chainName: 'Gnosis Chain',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
      logoURI: 'https://docs.gnosischain.com/img/tokens/xdai.png',
    },
    rpcUrls: [process.env.HTTPS_ETH_RPC_PROVIDER_URL__GNOSIS_MAINNET],
    blockExplorerUrls: [process.env.EXPLORER_URL__GNOSIS_MAINNET],
    iconUrls: ['/networks/gnosis.svg'],
    logoURI: '/networks/gnosis.svg',
  },
  */
  /*
  {
    chainId: '0x89', // 137 as hex
    chainName: 'Polygon',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      logoURI: '/tokens/polygon.png',
    },
    rpcUrls: [process.env.HTTPS_ETH_RPC_PROVIDER_URL__POLYGON_MAINNET],
    blockExplorerUrls: [process.env.EXPLORER_URL__POLYGON_MAINNET],
    iconUrls: ['/networks/polygon.svg'],
    logoURI: '/networks/polygon.svg',
  },
  */
  {
    chainId: '0xa4b1', // 42161 as hex
    chainName: 'Arbitrum One',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoURI: ETH_NETWORK_LOGO,
    },
    rpcUrls: [get_required_env_var("HTTPS_ETH_RPC_PROVIDER_URL__ARBITRUM_MAINNET")],
    blockExplorerUrls: [get_required_env_var("EXPLORER_URL__ARBITRUM_MAINNET")],
    iconUrls: ['/networks/arbitrum.svg'],
    logoURI: '/networks/arbitrum.svg',
  },
  {
    chainId: '0x38', // 56 as decimal, 0x38 as hex
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      address: NATIVE_TOKEN_ADDRESS,
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      logoURI: '/networks/bnb.svg',
    },
    rpcUrls: [
      get_required_env_var("HTTPS_ETH_RPC_PROVIDER_URL__BSC_MAINNET")
    ],
    blockExplorerUrls: [
      get_required_env_var("EXPLORER_URL__BSC_MAINNET")
    ],
    iconUrls: ['/networks/bnb.svg'],
    logoURI: '/networks/bnb.svg',  
  }
];

// Set comprised of intersection of Chain IDs present for all contracts in src/contracts, supported by umbra-js, and by relayer
export type SupportedChainId = '1' | '10' | /*'100' | '137' |*/ '42161' | '11155111' | '56'; // strings for indexing into JSON files
export const supportedChainIds = supportedChains.map((chain) => Number(chain.chainId)); // numbers for verifying the chainId user is connected to

// CNS names owned by wallet are queried from The Graph, so these types help parse the response
type CnsName = { name: string };
export interface CnsQueryResponse {
  data: {
    domains: CnsName[];
  };
}

// Relayer types
export type ApiError = { error: string };
export interface TokenInfoExtended extends TokenInfo {
  minSendAmount: string;
}
// Omit the TokenList.tokens type so we can override it with our own.
export interface TokenListSuccessResponse extends Omit<TokenList, 'tokens'> {
  nativeTokenMinSendAmount: string;
  tokens: TokenInfoExtended[];
}
export type TokenListResponse = TokenListSuccessResponse | ApiError;
export type FeeEstimate = { fee: string; token: TokenInfo };
export type FeeEstimateResponse = FeeEstimate | ApiError;
export type WithdrawalInputs = {
  stealthAddr: string;
  acceptor: string;
  signature: string;
  sponsorFee: string;
};
export type RelayResponse = { relayTransactionHash: string } | ApiError;

export type SendTableMetadataRow = {
  dateSent: string;
  dateSentUnix: number;
  dateSentTime: string;
  amount: string;
  address: string;
  recipientId: string;
  txHash: string;
  tokenLogo?: string;
  tokenAddress: string;
  tokenSymbol: string;
  advancedMode: boolean;
  usePublicKeyChecked: boolean;
};

// Logger type added to window
declare global {
  interface Window {
    logger: UmbraLogger;
  }
}

export type Language = { label: string; value: string };
