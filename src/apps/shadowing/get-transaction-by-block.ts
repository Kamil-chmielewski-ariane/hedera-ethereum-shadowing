import { getBlockByNumber } from '@/api/get-block-by-number';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
import { sendBlockReward } from '@/apps/shadowing/send-block-reward';
import { AccountId, Client } from '@hashgraph/sdk';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client
) {
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			console.log('currentBlockNumber', startFromBlock);
			let result = await getBlockByNumber(
				startFromBlock.toString(16)
			);
			await sendBlockReward(accountId, client, result);
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
