import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { getRawTransaction } from '@/api/erigon/get-raw-transaction';
import { sendRawTransaction } from '@/api/hedera/send-raw-transaction';
import { AccountId, Client } from '@hashgraph/sdk';
import { compareStateRootOfBlocks } from '@/apps/shadowing/blockchain-utils/compare-state-root-of-blocks';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';

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
			const transactions = block.transactions;
			await sendBlockReward(accountId, client, startFromBlock.toString(16), transactions);

			if (transactions.length > 1) {
				console.log(`transacion in block ${startFromBlock} found...`);
				console.log('preceding iterate through transfers...');
				for (const transaction of transactions) {
					if (transaction && transaction.hash) {
						console.log(`current element ${transaction.hash}`);
						const transactionRawBody = await getRawTransaction(transaction.hash);
						console.log('transactionRawBody', transactionRawBody);
						await sendRawTransaction(transactionRawBody);
					}
				}
				if (transactions[-1] && transactions[-1].hash) {
					compareStateRootOfBlocks(block, transactions[-1]);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
