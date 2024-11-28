[//]: # (## Setup tunnel to the Node VM)

[//]: # ()
[//]: # (1. Set env variable with remote host)

[//]: # (```bash)

[//]: # (export TUNNEL_HOST=user@IP_ADDR)

[//]: # (```)

[//]: # ()
[//]: # (2. Setup SSH tunnel)

[//]: # (```bash)

[//]: # (ssh -L  8080:localhost:8080 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  9545:localhost:9545 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  5600:localhost:5600 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  5551:localhost:5551 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  7546:localhost:7546 -fN $TUNNEL_HOST && \)

[//]: # (ssh -L  50211:localhost:50211 -fN $TUNNEL_HOST)

[//]: # (```)

# Hedera Shadowing

Goal of Hedera shadowing is research the Hedera EVM and Ethereum EVM equivalence.
Script achieve this re-executing all Ethereum transaction on by one on local Hedera network. Each transaction is verified by states match 

## How does it work?
I will describe process of out script execution below:

1. Firstly it populates empty hedera local node with Sepolia genesis block accounts and gives them proper balance by transfering funds to it from treasury account in Hedera - Account Id 0.0.2 . Genesis state is provided from [genesis_block_transactions.json](./src/genesis_block_transactions.json).
2. After this we read last block from Sepolia and starting from first block we iterate to the last in the loop.
3. For current block firstly we read its miners and uncles and after calculating the block reward we send this reward to account in Hedera with method TransferTransaction from Hashgraph SDK.
4. After sending reward for block mining is finished for each transaction present in block, first we send transfer to tranasction recipient evm address that does not exist in Hedera node. After this we read transaction raw body from Sepolia by using RPC API provided by Erigon and send it with EthereumTransaction method from Hedera SDK to Hedera Consensus Node.
5. If no error was present all transactions that we put to Hedera in step 4. are asynchronously send to [Receipt API](#receipt-api) that will check if transactions were successful. 
6. In the background we listen to out connection from Receipt API and wait for response. After it comes we compare state root of contract if there were present in current block. This step is done by making API call to `GET /api/v1/contracts/${contractAddress}/state?timestamp=${timestamp}` in Hedera Mirror Node REST API where contractAddress is tranasction to address and timestamp is Hedera transaction timestamp. If states on this address were present, for each state we check with RPC API call to `eth_getStorageAt` method provided from Erigon and compare if values on the same address were equal. If they weren't we log this occurence to separate file.
7. We repeat steps 2-5, as mentioned above step 6 is run in the background.

## Recommend tools
* [Hedera local node](https://github.com/hashgraph/hedera-local-node)
* [Etheruem Client i.e. Erigon](https://erigon.gitbook.io/erigon/basic-usage/getting-started)

## Requirements
* [Node.js](https://nodejs.org/en) >= 22.x
* [PNPM](https://pnpm.io/) >= 9.x
* [Docker](https://www.docker.com/) > 24.x
* [Docker Compose](https://docs.docker.com/compose/) > 2.22.0
* [PM2](https://pm2.keymetrics.io/) - Optional
* Minimum 16GB RAM

## Usage

Create a ```.env``` file in the root of project and add all variables as in ```.env.example```. Api key for ```OPERATOR_PRIVATE``` is in this article
[@hashgraph/sdk - client](https://docs.hedera.com/hedera/sdks-and-apis/sdks/client)

Add ```logs``` directory in the root of the project for logs

````
OPERATOR_PRIVATE="OPERATOR_PRIVATE"
````

## Instalation

To run this project you have to firstly download and install all required packages and start hedera local node environment. Also you need to be connected to RPC API that enables all required methods that are used in the process. For this we used Erigon client with blocks acquired and indexed from Sepolia network.

# !!! IMPORTANT !!!

Hedera local node have problems with the stability of the consensus node. To prevent this we created a solution which resets all hedera services without losing data. How to do this:
1. Go into directory with the hedera local node. On linux with the Node Version Manager (NVM) should be here ```.nvm/versions/node/<node version>/lib/node_modules/\@hashgraph/hedera-local/``` 
2. Get into docker-compose.yml and add new volume for network node service
   - Line 61: ```"network-node-data:/opt/hgcapp/services-hedera/HapiApp2.0/data/saved"```
   - Line 533-533: ```network-node-data: name: network-node-data```
3. In the same catalog go into ```build/services/DockerService.js```
   - In line 398 remove ```-v``` flag in the ```docker compose down``` cli command
4. Go into ```build/state/StopState.js```
   - In line 80 remove ```-v``` flag in the ```docker compose down``` cli command
5. Now you can start hedera with ```hedera start``` command. The shadowing will automatically reset hedera without losing all data

## External APIs

For reading and pushing transactions and reading smart contract states we used APIs that we list below. All this connections and methods are present in src/api/ package.

### Ethereum RPC API

As mentioned above in section [Installation](#installation) to use this script you need to have Ethereum client (we recommend Erigon) which implements these methods:

- [eth_getBalance](https://www.quicknode.com/docs/ethereum/eth_getBalance)

- [eth_getBlockByHash](https://www.quicknode.com/docs/ethereum/eth_getBlockByHash)

- [eth_getBlockByNumber](https://www.quicknode.com/docs/ethereum/eth_getBlockByNumber)

- [eth_blockNumber](https://www.quicknode.com/docs/ethereum/eth_blockNumber)

- [eth_getRawTransactionByHash](https://www.quicknode.com/docs/ethereum/eth_getRawTransactionByHash)

- [eth_getStorageAt](https://www.quicknode.com/docs/ethereum/eth_getStorageAt)

- [eth_getTransactionByHash](https://www.quicknode.com/docs/ethereum/eth_getTransactionByHash)

- [eth_getTransactionReceipt](https://www.quicknode.com/docs/ethereum/eth_getTransactionReceipt)

- [eth_getUncleByBlockNumberAndIndex](https://docs.alchemy.com/reference/eth-getunclebyblocknumberandindex)

The script will not work if it does not provide all of this methods.

### Hedera Mirror Node REST API

In this script we use Hedera Mirror Node API like for example, acuiring slots and values on smart contracts in hedera local node. All REST API methods which we use are listed below:

- [GET /api/v1/accounts/${evmAddress}](https://mainnet.mirrornode.hedera.com/api/v1/docs/#/accounts/getAccount)

- [GET /api/v1/contracts/${contractAddress}/state?timestamp=${timestamp}](https://mainnet.mirrornode.hedera.com/api/v1/docs/#/contracts/getContractState)

The script will not work if your hedera local node on which you operate does not provide it.

### Hedera RPC API

For test purpose we also use Hedera RPC API provided with Hedera node and these RPC methods are:

- [eth_getTransactionByHash](https://www.quicknode.com/docs/ethereum/eth_getTransactionByHash)

- [eth_getBlockByHash](https://www.quicknode.com/docs/ethereum/eth_getBlockByHash)

- [eth_sendRawTransaction](https://www.quicknode.com/docs/ethereum/eth_sendRawTransaction)

### Receipt API

Receipt API (as we call it in this project) is an REST app implemented by our team (//TODO out the link here) that we use to send transaction information for asynchronous check for the transaction status that we are pushing to Hedera consensus node via transfer transaction or EthereumTransaction method. Also after the check is completed in there a response is send to our application to check smart contract states between Hedera and Sepolia.

##### PNPM

```
pnpm install
```

```pnpm run dev``` to start shadowing app

##### PM2 - Optional

You can also run this app using pm2 tool. The config file is a ```ecosystem.config.js```

```
pm2 start ecosystem.config.js
```

#### Creating logs

The hedera shadowing app is always creating logs for
   - Errors
   - Blocks with transactions
