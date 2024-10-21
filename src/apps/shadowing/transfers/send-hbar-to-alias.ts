import { AccountId, Client, Hbar, TransactionId, TransferTransaction } from '@hashgraph/sdk';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function sendHbarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number | Hbar,
	client: Client,
	currentBlock: number,
	nodeAccountId: AccountId
) {
	try {
		console.log(`Running transaction ${accountId}, ${evmAddress}`);
		const txId = TransactionId.generate(accountId);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(amountHBar).negated())
			.addHbarTransfer(evmAddress, new Hbar(amountHBar))
			.setTransactionId(txId)
			.setNodeAccountIds([nodeAccountId])
			.freeze();

		// Execute the transaction
		const response = await transaction.execute(client);

		// Get the receipt to confirm the transaction
		// const receipt = await response.getReceipt(client);

		// console.log('Transaction status:', receipt.status.toString());
	} catch (error) {
		console.error('Error sending HBAR to alias:', error);
	}
}
