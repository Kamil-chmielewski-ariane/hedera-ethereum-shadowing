import { AccountId, Client, Hbar, TransactionId, TransferTransaction } from '@hashgraph/sdk';
import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
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
		await new Promise(resolve => setTimeout(resolve, 1));
		await transaction.execute(client);
		const txTimestamp = new Date().toISOString();
		// TODO: uncomment when receipt API is ready
		// sendTransactionInfoToReceiptApi(txId, evmAddress, currentBlock, "TRANSFER_TRANSACTION", txTimestamp);
	} catch (error) {
		console.error('Error sending HBAR to alias:', error);
		await writeLogFile(`logs/send-hbar-to-alias-error.txt`, `Found error in block ${currentBlock} Transaction Type: TransferTransaction  \n ${JSON.stringify(error)} \n`);
	}
}
