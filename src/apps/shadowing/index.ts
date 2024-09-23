import {
	getAllFrontierData,
	getAllGenesisData,
} from '@/apps/shadowing/get-all-frontier-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { createEthereumTransaction } from '@/apps/shadowing/create-ethereum-transaction';
import { iterateThoughGenesisTransactions } from './iterate-through-genesis-transactions';
import { getBlockByNumber } from '@/api/get-block-by-number';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/get-miner-and-uncles-balance';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;
const accountsMapping = getAllFrontierData();

const node = { '127.0.0.1:50211': new AccountId(3) };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {
	// iterateThoughGenesisTransactions(accountId, genesisTransactions, client);

	const minerAndUncles = await getMinerAndUnclesBalance('66E7C4');

	console.log(minerAndUncles)

	// createEthereumTransaction(
	// 	{
	// 		txHash:
	// 			'0xda17f66e764bbe84f2d71b5544c9733f3b4a48d49e3226a98e955747ba0b7060',
	// 		hbar: 200,
	// 		gas: 100,
	// 	},
	// 	accountId,
	// 	client
	// );
})();
