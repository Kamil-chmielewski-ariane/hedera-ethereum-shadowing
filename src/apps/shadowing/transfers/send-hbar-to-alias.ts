import {
	AccountId,
	Client,
	Hbar,
	TransactionId,
	TransferTransaction,
} from '@hashgraph/sdk';
import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import axios from 'axios';

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
		const transactionId = TransactionId.generate(accountId);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(amountHBar).negated())
			.addHbarTransfer(evmAddress, new Hbar(amountHBar))
			.setTransactionId(transactionId)
			.setNodeAccountIds([nodeAccountId])
			.freeze();

		// Execute the transaction
		await new Promise((resolve) => setTimeout(resolve, 1));
		const txResponse = await transaction.execute(client);
		const txTimestamp = new Date().toISOString();
		await sendTransactionInfoToReceiptApi({
			ethereumTransactionHash: null,
			hederaTransactionHash: txResponse.transactionHash,
			currentBlock: currentBlock,
			evmAddress: evmAddress,
			txTimestamp: txTimestamp,
			transactionType: 'TRANSFER_TRANSACTION',
			transactionId: transactionId,
		});
	} catch (error: any) {
		if (error.status && error.status === 'DUPLICATE_TRANSACTION') {
			console.error('Error sending tinyBar to alias:', error);
			await writeLogFile(
				`logs/send-tiny-bar-to-alias-error.txt`,
				`I am rerunning transaction. Found error in block ${currentBlock} Transaction Type: TransferTransaction  \n ${JSON.stringify(error)} \n`
			);
			await sendHbarToAlias(
				accountId,
				evmAddress,
				amountHBar,
				client,
				currentBlock,
				nodeAccountId
			);
		} else {
			console.error('Error sending tinyBar to alias:', error);
			await writeLogFile(
				`logs/send-tiny-bar-to-alias-error.txt`,
				`Found error in block ${currentBlock} Transaction Type: TransferTransaction  \n ${JSON.stringify(error)} \n`
			);
		}
	}
}
