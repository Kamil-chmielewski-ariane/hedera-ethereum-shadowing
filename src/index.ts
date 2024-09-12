import { getAllFrontierData, getAllGenesisData } from '@/get-all-frontier-data';
import {
	Client,
	Hbar,
	AccountId,
	TransferTransaction,
	EthereumTransaction, TransactionId,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { iterateThoughGenesisTransactions } from '@/iterate-through-genesis-transactions';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
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

export async function sendHbarToAlias(evmAddress: string, amountHBar: number) {
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

(async () => {
	// iterateThoughGenesisTransactions(genesisTransactions);
	const rawBody = await getRawTransaction(
		'0xa02a056a0899d63073f82e7f6ca75cf36f3a6582b940f4e801bb049b634072a8'
	);
	// await sendHbarToAlias('0x731B8DbC498d3db06a64037DDeA7685490Af4ee5', 5);


	console.log(rawBody);
	const txId = TransactionId.generate('0.0.1001');
	const rawBodyString = rawBody + '';
	console.log(Uint8Array.from(Buffer.from(rawBodyString.substring(2), 'hex')));
	// const txId = TransactionId.generate(new AccountId(2));
	const transaction = new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBodyString.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(100));
	console.log(transaction);

	//Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
	const txResponse = await transaction.execute(client);

	// await sendRawTransaction(rawBody);
})();
