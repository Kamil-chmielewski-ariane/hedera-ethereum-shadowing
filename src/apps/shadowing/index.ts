import { getAllGenesisData } from '@/apps/shadowing/frontier/get-all-frontier-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { startNetworkReplicationProcess } from '@/apps/shadowing/blockchain-utils/start-network-replication-process';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { getTransactionByBlock } from '@/apps/shadowing/ethereum/get-transaction-by-block';
import { getMirrorNodeTransaction } from '@/api/hedera-mirror-node/get-mirror-node-transaction';
import { getHederaContractStatesByTimestamp } from '@/apps/shadowing/hedera/get-hedera-contract-states-by-timestamp';
import { websocketConnection, websocketEvents } from '@/api/websocket/websocket-connection';
import { eip712WalletActions } from 'viem/zksync';
import { ContractType } from '@/utils/types';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;

const nodeAccountId = new AccountId(3);
const node = { '127.0.0.1:50211': nodeAccountId };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {
	websocketConnection();

	websocketEvents.on('websocket', (data: ContractType) => {
		console.log('Websocket data recieved', data.blockNumber);
	});

	await startNetworkReplicationProcess(accountId, genesisTransactions, client, nodeAccountId);
})();
