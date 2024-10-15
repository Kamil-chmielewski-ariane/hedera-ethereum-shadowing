import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { AccountId, Client } from '@hashgraph/sdk';
import { compareStateForContractsInBlock } from '@/apps/shadowing/blockchain-utils/compare-state-root-of-blocks';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { getAccount } from '@/api/hedera-mirror-node/get-account';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client
) {
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			console.log('currentBlockNumber', startFromBlock);
			let block = await getBlockByNumber(startFromBlock.toString(16));
			const transactions = block.transactions;
			await sendBlockReward(
				accountId,
				client,
				startFromBlock.toString(16),
				transactions
			);

			if (transactions.length > 1) {
				console.log(`transacion in block ${startFromBlock} found...`);
				console.log('preceding iterate through transfers...');
				for (const transaction of transactions) {
					const isAccountCreated = await getAccount(transaction.toAccount)

					if (!isAccountCreated) {
						console.log('account not found, created new account and sending 1 hbar...')
						await sendHbarToAlias(
							accountId,
							transaction.toAccount,
							1,
							client
						);
					}

					if (transaction && transaction.hash) {
						await createEthereumTransaction(
							{
								txHash: transaction.hash,
								gas: 21000,
							},
							accountId,
							client
						);
					}
				}
				if (transactions[-1] && transactions[-1].hash) {
					await compareStateForContractsInBlock(block, transactions[-1]);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
