import { getRawTransaction } from '@/api/erigon/get-raw-transaction';
import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
import {
	AccountId,
	Client,
	EthereumTransaction,
	Hbar,
	PrivateKey,
	TransactionId,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

export async function createEthereumTransaction(
	transactionData: { txHash: string; gas: number },
	accountId: AccountId,
	client: Client,
	nodeAccountId: AccountId,
	accountTo: string,
	currentBlock: number
) {
	const rawBody = await getRawTransaction(transactionData.txHash);
	const txId = TransactionId.generate(accountId);
	const transaction = await new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
		.setNodeAccountIds([nodeAccountId])
		.freeze()
		.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)));

	const txResponse = await transaction.execute(client);

	console.log('txResponse', txResponse.toJSON());
	// TODO: uncomment when receipt API is ready
	// sendTransactionInfoToReceiptApi(txId, accountTo, currentBlock, "ETHEREUM_TRANSACTION");
}
