/**
 * @notice Umbra Deployment script
 * Deploys the core Umbra contract, along with the Umbra Stealth Key Registry, checkilng for the correct
 * nonces at each step to ensure we get the same contract addresses across networks.
 * @dev To get history:
 *   `yarn check-history --network <network>`   (where network specifies a network found in the hardhat.config.ts file)
 * If deploying to a local node (--network localhost), first start Hardhat using `yarn hardhat node`
 */

const fs = require('fs');
const hre = require('hardhat');
const { ethers } = hre;

const network = process.env.HARDHAT_NETWORK || '';

// Initialize object that will hold transaction history item. We'll continually update this and save it to
// a file using the save() method below
const parameters = {
  "transactions": [],
  "actions": {},
  "deployer": null
};

// Setup for saving off deploy info to JSON files
const now = new Date().toISOString();
const folderName = './history-check-logs';
const fileName = `${folderName}/${network}-${now}.json`;
const latestFileName = `${folderName}/${network}-latest.json`;
fs.mkdir(folderName, (err) => {
  if (err && err.code !== 'EEXIST') throw err;
});

//  save the deploy info to 2 JSON files:
//  first one named with network and timestamp, contains all relevant deployment info
//  second one name with network and "latest", contains only contract addresses deployed
const save = (value, field, subfield = undefined) => {
  //console.log(`param ${parameters} value ${value} field ${field} sf ${subfield}`);
  if (typeof subfield !== 'undefined') {
    parameters[field][subfield] = value;
  } else {
    parameters[field] = value;
  }
  fs.writeFileSync(fileName, JSON.stringify(parameters));
};

// IIFE async function so "await"s can be performed for each operation
(async function () {
  try {
    const getHistoryParams = require('./getHistoryParams.json');
    const getHistoryParamsForNetwork = getHistoryParams[network];

    // When testing deployment locally, the expected deployer is 0xBC425Bde78FD15fC6E35723887db8bC289E765dB, which
    // corresponds to address[0] of the mnemonic "test test test test test test test test test silent silent junk".
    // We could not use the default hardhat mnemonic because the nonce for that address on a forked Sepolia would
    // be unpredictable (since lots of people execute txs with that account).
    const { 
        MainnetDeployer,
        MainnetUmbraContract,
        MainnetUmbraContractDeployTxBlockNumber,
        MainnetUmbraContractDeployTxHash,
        txCountToFetch
    } = getHistoryParamsForNetwork;
    
    console.log(`Getting ${txCountToFetch} txs from: ${network}`);
    save(network, 'actions', `Getting ${txCountToFetch} txs from: ${network}`);
    
    const provider = new ethers.providers.JsonRpcProvider();
    
    /*
    const [deployerWallet] = await ethers.getSigners();
    save(deployerWallet.address, 'deployer');
    if (deployerWallet.address !== ethers.utils.getAddress(expectedDeployer)) {
      throw new Error(`Unexpected deployer address. Found ${deployerWallet.address}, expected ${expectedDeployer}.`);
    }
    */

    
    var transactionNumberInArray;
    var lastBlock=[undefined];
    const extractOneMoreTransaction = async (lastBlock) => {
        const sync = async () => {
            //get block with transactions
            //Get the block from the network, where the result.transactions is an Array of TransactionResponse objects.
            console.log(`fetching block ${lastBlock[0].blockNumber}...`);
            lastBlock[0].blockValueWithTransactions = await provider.getBlockWithTransactions(lastBlock[0].blockNumber);
            console.log(`fetched block ${lastBlock[0].blockValueWithTransactions}.`);
            if (!(lastBlock[0].blockValueWithTransactions)) throw new Error(`Unexpected ethers API response for provider.getBlockWithTransactions(${lastBlock[0].blockNumber}): ${lastBlock[0].blockValueWithTransactions}.`);
            //console.log(`lastBlock[0].blockValueWithTransactions.transactions ${JSON.stringify(lastBlock[0].blockValueWithTransactions.transactions)}.`);
            if (!(lastBlock[0].blockValueWithTransactions.transactions)) throw new Error(`Unexpected ethers API response field '.transactions' for provider.getBlockWithTransactions(${lastBlock[0].blockNumber}).transactions: '${lastBlock[0].blockValueWithTransactions.transactions}'.`);
            if (lastBlock[0].blockValueWithTransactions.transactions.length<=0) throw new Error(`Unexpected ethers API response field '.transactions.length' for provider.getBlockWithTransactions(${lastBlock[0].blockNumber}).transactions.length: '${lastBlock[0].blockValueWithTransactions.transactions.length}, expected >0'.`);
            lastBlock[0].txsChecked = 0;
        };
        if (!(lastBlock[0])) {
            lastBlock[0]={}
            console.log(`getting latest block number (height)...`);
            lastBlock[0].blockNumber = await provider.getBlockNumber();
            sync();
        }else if (lastBlock[0].blockValueWithTransactions && lastBlock[0].txsChecked >= lastBlock[0].blockValueWithTransactions.transactions.length) {
            lastBlock[0].blockNumber = lastBlock[0].blockNumber - 1;
            sync();
        }
        const retValue = lastBlock[0].blockValueWithTransactions && lastBlock[0].blockValueWithTransactions.transactions[lastBlock[0].txsChecked];
        lastBlock[0].txsChecked = lastBlock[0].txsChecked + 1;
        return retValue;
    };
    
    const timeStart = new Date();
    console.log(`Start time: ${timeStart.toISOString()}`);
    
    for (transactionNumberInArray = 0; transactionNumberInArray < txCountToFetch; ++transactionNumberInArray) {
        console.log(`Getting tx number ${transactionNumberInArray} of ${txCountToFetch} from: ${network}...`);
        const transactionValue = await extractOneMoreTransaction(lastBlock);
        save (transactionValue, "transactions", transactionNumberInArray);
    }

    const timeEnd = new Date();
    console.log(`End time: ${timeEnd.toISOString()}`);
    
    console.log(`Time spent: ${timeEnd-timeStart}`);

    // everything went well, save the deployment info in the 'latest' JSON file
    fs.writeFileSync(latestFileName, JSON.stringify(parameters));

    // catch any error from operations above, log it and save it to deploy history file
  } catch (error) {
    save(error.toString(), 'actions', 'Error');
    console.log('Deployment Error: ', error.toString());
  }
})();
