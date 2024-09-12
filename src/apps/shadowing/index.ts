import { getAllFrontierData, getAllGenesisData } from '@/apps/shadowing/get-all-frontier-data';
import {
	Client,
	Hbar,
	AccountId,
	TransferTransaction,
	EthereumTransaction, TransactionId, PrivateKey, AccountCreateTransaction, PublicKey,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { iterateThoughGenesisTransactions } from '@/apps/shadowing/iterate-through-genesis-transactions';
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
			.addHbarTransfer(evmAddress, new Hbar(amountHBar))

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

	console.log('shadowing app')

	// iterateThoughGenesisTransactions(genesisTransactions);
	const rawBody = await getRawTransaction(
		'0xda17f66e764bbe84f2d71b5544c9733f3b4a48d49e3226a98e955747ba0b7060'
	);
	console.log(rawBody);
	await sendHbarToAlias('0xa9DE2a4904DDcEc6f969784FbAd36a0b7fe0f2Cd', 2000);
	// await sendRawTransaction(rawBody);
	const txId = TransactionId.generate(new AccountId(2));
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(100))
		.freezeWith(client)
		.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)))

	const txResponse = await transaction.execute(client);

	console.log('txResponse', JSON.stringify(txResponse));
})();
