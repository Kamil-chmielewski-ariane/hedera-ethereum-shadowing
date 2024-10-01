import {
	getAllFrontierData,
	getAllGenesisData,
} from '@/apps/shadowing/frontier/get-all-frontier-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { iterateThoughGenesisTransactions } from '@/apps/shadowing/blockchain-utils/iterate-through-genesis-transactions';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;

const node = { '127.0.0.1:50211': new AccountId(3) };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {
	await iterateThoughGenesisTransactions(accountId, genesisTransactions, client);
})();
