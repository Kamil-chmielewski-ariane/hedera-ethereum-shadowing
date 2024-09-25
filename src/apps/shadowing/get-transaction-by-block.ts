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
						await createEthereumTransaction(
							{
								txHash: transaction.hash,
								evmAddress: "0xe64FAC7f3DF5aB44333ad3D3Eb3fB68Be43F2E8C",
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
