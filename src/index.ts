import { getAllFrontierData, getAllGenesisData } from '@/get-all-frontier-data';
import { Client, Hbar, AccountId, TransferTransaction } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { Account } from '@/utils/types';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { getTransactionByBlockNumber } from '@/api/get-transaction-by-block-number';
import {iterateThoughGenesisTransactions} from '@/iterate-through-genesis-transactions';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;
type accountType = Account;
const accountsMapping = getAllFrontierData();

const node = { '127.0.0.1:50211': new AccountId(3) };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

async function sendHbarToAlias(evmAddress: string, amountHBar: number) {
	try {
		console.log(`Running transaction ${accountId}, ${evmAddress}`);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(-amountHBar))
			.addHbarTransfer(evmAddress, new Hbar(amountHBar));

		// Execute the transaction
		const response = await transaction.execute(client);

		// Get the receipt to confirm the transaction
		const receipt = await response.getReceipt(client);

		console.log('Transaction status:', receipt.status.toString());
	} catch (error) {
		console.error('Error sending HBAR to alias:', error);
	}
}

async function sandbox(blockNumber: number) {
	let result = await getTransactionByBlockNumber(blockNumber.toString(16));
	const transactions: string[] = result.transactions;
	const transactionRawBody = await getRawTransaction(transactions[0]);
	const rawTransaction = await getRawTransaction(transactionRawBody);
	console.log('rawTransaction', rawTransaction);
}

(() => {
	iterateThoughGenesisTransactions(genesisTransactions);
})();
