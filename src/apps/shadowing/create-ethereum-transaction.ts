import { getRawTransaction } from '@/api/get-raw-transaction';
import {
	AccountId,
	Client,
	EthereumTransaction,
	Hbar,
	PrivateKey,
	TransactionId,
} from '@hashgraph/sdk';
import { sendHbarToAlias } from '@/apps/shadowing/send-hbar-to-alias';
import dotenv from 'dotenv';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

export async function createEthereumTransaction(transactionData: {txHash: string, hbar: number, gas: number}, accountId: AccountId, client: Client) {
	const rawBody = await getRawTransaction(
		transactionData.txHash
	);
	await sendHbarToAlias(accountId, '0xa9DE2a4904DDcEc6f969784FbAd36a0b7fe0f2Cd', transactionData.hbar, client);
	const txId = TransactionId.generate(accountId);
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
		.freezeWith(client)
		.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)));

	const txResponse = await transaction.execute(client);

	console.log('txResponse', JSON.stringify(txResponse));
}
