import { getTransactionByBlockNumber } from '@/api/get-transaction-by-block-number';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number
) {
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			console.log('currentBlockNumber', startFromBlock);
			let result = await getTransactionByBlockNumber(
				startFromBlock.toString(16)
			);
			const transactions: string[] = result.transactions;

			if (transactions.length > 1) {
				console.log(`transacion in block ${startFromBlock} found...`);
				console.log('preceding iterate through transactions...');
				for (const transactionId of transactions) {
					console.log(`current element ${transactionId}`);
					const transactionRawBody = await getRawTransaction(transactionId);
					console.log('transactionRawBody', transactionRawBody);
					await sendRawTransaction(transactionRawBody);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
