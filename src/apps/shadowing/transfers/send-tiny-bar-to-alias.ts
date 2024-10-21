import { AccountId, Client, Hbar, TransactionId, TransferTransaction } from '@hashgraph/sdk';
import { writeLogFile } from '@/utils/helpers/write-log-file';
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
		const response = await transaction.execute(client);

		// Get the receipt to confirm the transaction
		// const receipt = await response.getReceipt(client);
		// console.log('Transaction status:', receipt.status.toString());
	} catch (error) {
		console.error('Error sending tinyBar to alias:', error);
	}
}
