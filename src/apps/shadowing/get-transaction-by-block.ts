import { getBlockByNumber } from '@/api/get-block-by-number';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
import { sendBlockReward } from '@/apps/shadowing/send-block-reward';
import { AccountId, Client } from '@hashgraph/sdk';
import { compareStateForContractsInBlock } from '@/apps/shadowing/compare-state-for-contracts-in-block';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client
) {
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			console.log('currentBlockNumber', startFromBlock);
			let block = await getBlockByNumber(
				startFromBlock.toString(16)
			);
			await sendBlockReward(accountId, client, block);
			const transactions = block.transactions;

			if (transactions.length > 1) {
				for (const transaction of transactions) {
					if (transaction && transaction.hash) {
						const transactionRawBody = await getRawTransaction(transaction.hash);
						await sendRawTransaction(transactionRawBody);
					}
				}
				compareStateForContractsInBlock(block.number, transactions);
			}
		}
	} catch (error) {
		console.log(error);
	}
}
