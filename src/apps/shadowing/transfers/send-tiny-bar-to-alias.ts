import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
import { AccountId, Client, Hbar, TransactionId, TransferTransaction } from '@hashgraph/sdk';
export async function sendTinyBarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number,
	client: Client,
	currentBlock: number,
	nodeAccountId: AccountId
) {
	try {
		console.log(`Running tinybar transaction ${accountId}, ${evmAddress}`);
		const txId = TransactionId.generate(accountId);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, Hbar.fromTinybars(amountHBar).negated())
			.addHbarTransfer(evmAddress, Hbar.fromTinybars(amountHBar))
			.setTransactionId(txId)
			.setNodeAccountIds([nodeAccountId])
			.freeze();

		// Execute the transaction
		await transaction.execute(client);
		const txTimestamp = new Date().toISOString();
		// TODO: uncomment when receipt API is ready
		// sendTransactionInfoToReceiptApi(txId, evmAddress, currentBlock, "TRANSFER", txTimestamp);
	} catch (error) {
		console.error('Error sending tinyBar to alias:', error);
	}
}
