import { getAllGenesisData } from '@/apps/shadowing/frontier/get-all-genesis-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { startNetworkReplicationProcess } from '@/apps/shadowing/blockchain-utils/start-network-replication-process';
dotenv.config();

// Defining operator account with private key. More info here https://docs.hedera.com/hedera/sdks-and-apis/sdks/client

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;
const NETWORK_NODE_API_URL = process.env.NETWORK_NODE_API_URL;
const MIRROR_NODE_API_URL = process.env.MIRROR_NODE_API_URL;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;

const nodeAccountId = new AccountId(3);
const node = { [NETWORK_NODE_API_URL ?? '127.0.0.1:50211']: nodeAccountId };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork(
	MIRROR_NODE_API_URL ?? '127.0.0.1:5600'
);
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {
	await startNetworkReplicationProcess(
		accountId,
		genesisTransactions,
		client,
		nodeAccountId
	);
})();
