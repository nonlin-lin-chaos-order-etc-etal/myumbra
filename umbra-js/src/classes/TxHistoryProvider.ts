import { BigNumber, BigNumberish, EtherscanProvider } from '../ethers';

let _isCommunityResource = false;

export class TxHistoryProvider extends EtherscanProvider {
  constructor(chainId: BigNumberish, apiKey?: string) {
    const _chainId = BigNumber.from(chainId).toNumber();
    if (!apiKey) _isCommunityResource = true;

    let defaultApiKey: string;
    switch (_chainId) {
      case 1: // mainnet
        console.log("implement tx history provider")
        throw "implement tx history provider"
        defaultApiKey = <string>process.env.ETHERSCAN_API_KEY;
        break;
      case 10: // optimism
      console.log("implement tx history provider")
      throw "implement tx history provider"
      defaultApiKey = <string>process.env.OPTIMISTIC_ETHERSCAN_API_KEY;
        break;
      /*
      case 100: // gnosis
        defaultApiKey = <string>process.env.GNOSISSCAN_API_KEY;
        break;
      case 137: // polygon
        defaultApiKey = <string>process.env.POLYGONSCAN_API_KEY;
        break;
      */
      case 42161: // arbitrum
      console.log("implement tx history provider")
      throw "implement tx history provider"
      defaultApiKey = <string>process.env.ARBISCAN_API_KEY;
        break;
      case 11155111: // sepolia
      console.log("implement tx history provider")
      throw "implement tx history provider"
      defaultApiKey = <string>process.env.TESTNET_SCAN_API_KEY;
        break;
      case 56: // bnb smart chain
      console.log("implement tx history provider")
      throw "implement tx history provider"
      defaultApiKey = <string>process.env.BSCSCAN_API_KEY;
        break;
      default:
        throw new Error(`Unsupported chain ID ${_chainId}`);
    }

    super(_chainId, apiKey || defaultApiKey);
  }

  isCommunityResource(): boolean {
    return _isCommunityResource;
  }
}
