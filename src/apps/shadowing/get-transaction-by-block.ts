import { getBlockByNumber } from '@/api/get-block-by-number';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
import { sendBlockReward } from '@/apps/shadowing/send-block-reward';
import { AccountId, Client } from '@hashgraph/sdk';
import { compareStateForContractsInBlock } from '@/apps/shadowing/compare-state-for-contracts-in-block';
import { createEthereumTransaction } from '@/apps/shadowing/create-ethereum-transaction';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client
) {
	// try {
	// 	await createEthereumTransaction({
	// 		txHash: "0x1009199f804a4c75d266627548dc154989eec8385c7b3a67e2bd50a5db5063c9",
	// 		evmAddress: "0xa701afD383E5c9f85a07A228a4837B2E31aDaC9a",
	// 		hbar: 200,
	// 		gas: 100
	// 	}, accountId, client);
	// } catch (error) {
	// 	console.log(error);
	// }
	
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			console.log('currentBlockNumber', startFromBlock);
			let block = await getBlockByNumber(
				startFromBlock.toString(16)
			);
			// await sendBlockReward(accountId, client, block);
			const transactions = block.transactions;

			if (transactions.length > 1) {
				for (const transaction of transactions) {
					if (transaction && transaction.hash) {
						await createEthereumTransaction(
							{
								txHash: transaction.hash,
								evmAddress: "0xeA1B261FB7Ec1C4F2BEeA2476f17017537b4B507",
								hbar: 200,
								gas: 100,
							},
							accountId,
							client
						);
					}
				}
				compareStateForContractsInBlock(block.number, transactions);
			}
		}
	} catch (error) {
		console.log(error);
	}
}
