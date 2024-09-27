import {
	getAllFrontierData,
	getAllGenesisData,
} from '@/apps/shadowing/frontier/get-all-frontier-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { iterateThoughGenesisTransactions } from '@/apps/shadowing/blockchain-utils/iterate-through-genesis-transactions';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';
import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import {sendHbarToAlias} from "@/apps/shadowing/transfers/send-hbar-to-alias";
import { getAccountBalance } from '@/api/erigon/get-account-balance';
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
	await iterateThoughGenesisTransactions(accountId, genesisTransactions, client);

	// let block = await getBlockByNumber('65CEB0');
	// const transactions = block.transactions;
	//
	// await sendBlockReward(accountId, client, '65CEB0', transactions,)

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
