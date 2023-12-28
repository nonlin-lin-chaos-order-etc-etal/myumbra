import { BigNumber, BigNumberish, EtherscanProvider } from '../ethers';

let _isCommunityResource = false;

function get_required_env_var(varname: string): string {
  let varvalue = eval(`process.env.${varname}`);
  if (!varvalue) {
    let errmsg = `Please specify a required .env var '${varname}'.`;
    console.error(errmsg);
    throw errmsg;
  }
  return <string>varvalue;
}

//check the env
get_required_env_var("ETHSCANAPI_HTTPS_URL_MAINNET");
get_required_env_var("ETHSCANAPI_OPTIMISTIC_HTTPS_URL_MAINNET");
get_required_env_var("ETHSCANAPI_ARBITRUM_HTTPS_URL_MAINNET");
get_required_env_var("ETHSCANAPI_SEPOLIA_HTTPS_URL_TESTNET");
get_required_env_var("ETHSCANAPI_BSC_HTTPS_URL_MAINNET");

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

  getBaseUrl(): string {
    switch (BigNumber.from(this.network.chainId).toNumber()) {
      case 1:
        return get_required_env_var("ETHSCANAPI_HTTPS_URL_MAINNET");
      case 10:
        return get_required_env_var("ETHSCANAPI_OPTIMISTIC_HTTPS_URL_MAINNET");
      /*
      case 100:
        return 'https://api.gnosisscan.io';
      case 137:
        return 'https://api.polygonscan.com';
      */
      case 42161:
        return get_required_env_var("ETHSCANAPI_ARBITRUM_HTTPS_URL_MAINNET");
      case 11155111:
        return get_required_env_var("ETHSCANAPI_SEPOLIA_HTTPS_URL_TESTNET");
      case 56:
        return get_required_env_var("ETHSCANAPI_BSC_HTTPS_URL_MAINNET");
    }

    throw new Error(`Unsupported network ${JSON.stringify(this.network.chainId)}`);
  }

  isCommunityResource(): boolean {
    return _isCommunityResource;
  }
}
