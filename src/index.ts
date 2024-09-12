import { getAllFrontierData, getAllGenesisData } from '@/get-all-frontier-data';
import {
	Client,
	Hbar,
	AccountId,
	TransferTransaction,
	EthereumTransaction, TransactionId, PrivateKey, AccountCreateTransaction, PublicKey,
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
	// iterateThoughGenesisTransactions(genesisTransactions);
	const rawBody = await getRawTransaction(
		'0xa02a056a0899d63073f82e7f6ca75cf36f3a6582b940f4e801bb049b634072a8'
	);
	await sendHbarToAlias('0x731B8DbC498d3db06a64037DDeA7685490Af4ee5', 5);
	const txId = TransactionId.generate(new AccountId(2));
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(100))
		.freezeWith(client)
		.sign(PrivateKey.fromStringECDSA('302e020100300506032b65700422042012a4a4add3d885bd61d7ce5cff88c5ef2d510651add00a7f64cb90de3359bc5c'))

	//Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
	const txResponse = await transaction.execute(client);

	console.log('txResponse', JSON.stringify(txResponse));

	// await sendRawTransaction(rawBody);
})();
