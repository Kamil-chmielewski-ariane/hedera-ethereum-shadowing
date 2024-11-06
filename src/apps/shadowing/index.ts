import { getAllGenesisData } from '@/apps/shadowing/frontier/get-all-genesis-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { startNetworkReplicationProcess } from '@/apps/shadowing/blockchain-utils/start-network-replication-process';
import {
	websocketConnection,
	websocketEvents,
} from '@/api/websocket/websocket-connection';
import { ContractType, TransactionStatusResponse } from '@/utils/types';
import { compareSmartContractRootState } from '@/apps/shadowing/blockchain-utils/compare-smart-contract-root-state';
import axios from 'axios';
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
	await new Promise((resolve) => setTimeout(resolve, 2000));

	websocketEvents.on('websocket', (contractData: TransactionStatusResponse) => {
		compareSmartContractRootState(contractData.transactionPayload);
	});

	await startNetworkReplicationProcess(
		accountId,
		genesisTransactions,
		client,
		nodeAccountId
	);
})();
