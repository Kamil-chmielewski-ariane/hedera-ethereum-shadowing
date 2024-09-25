import { getRawTransaction } from '@/api/get-raw-transaction';
import {
	AccountId,
	Client,
	EthereumTransaction,
	Hbar,
	PrivateKey,
	TransactionId,
} from '@hashgraph/sdk';
// import { sendHbarToAlias } from '@/apps/shadowing/send-hbar-to-alias';
import dotenv from 'dotenv';
import { sendHbarToAlias } from './send-hbar-to-alias';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

export async function createEthereumTransaction(transactionData: {txHash: string, evmAddress: string, hbar: number, gas: number}, accountId: AccountId, client: Client) {
	const rawBody = await getRawTransaction(
		transactionData.txHash
	);
	await sendHbarToAlias(accountId, transactionData.evmAddress, transactionData.hbar, client);
	const txId = TransactionId.generate(accountId);
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
		.freezeWith(client)
		.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)));

	const txResponse = await transaction.execute(client);

	console.log('txResponse', txResponse.toJSON());
}
