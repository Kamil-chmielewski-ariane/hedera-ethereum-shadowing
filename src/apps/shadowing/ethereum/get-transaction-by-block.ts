import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { AccountId, Client } from '@hashgraph/sdk';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { getAccount } from '@/api/hedera-mirror-node/get-account';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client,
	nodeAccountId: AccountId
) {
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
			const transactionsInBlock = [];
			console.log('currentBlockNumber', startFromBlock);
			let block = await getBlockByNumber(startFromBlock.toString(16));
			const transactions = block.transactions;
			// Sends block reward for the current miner, and uncles.
			await sendBlockReward(
				accountId,
				client,
				startFromBlock.toString(16),
				transactions,
				nodeAccountId
			);

			if (transactions.length > 0) {
				console.log(`transacion in block ${startFromBlock} found...`);
				console.log('preceding iterate through transfers...');
				for (const transaction of transactions) {
					const isAccountCreated = await getAccount(transaction.to);

					//Checks if transaction.to is not a smart contract creation and is account exist in hedera mirror node
					if (!isAccountCreated && transaction.to !== null) {
						console.log(
							'account not found, created new account and sending 1 hbar...'
						);

						// Create a hedera account.
						await sendHbarToAlias(
							accountId,
							transaction.to,
							1,
							client,
							startFromBlock,
							nodeAccountId
						);
					}

					if (transaction && transaction.hash) {
						console.log(`transaction found ${transaction.hash}`);
						//Create hedera transaction from ethereum transaction
						const hederaTransaction = await createEthereumTransaction(
							{
								txHash: transaction.hash,
								gas: 21000,
							},
							accountId,
							client,
							nodeAccountId,
							transaction.to,
							startFromBlock
						);
						transactionsInBlock.push({
							ethereumTransactionHash: transaction.hash,
							hederaTransactionHash: hederaTransaction.transactionHash,
						});
					}
				}

				const blockWithTransactions = {
					[startFromBlock]: {
						transactions: transactionsInBlock,
					},
				};

				// Add new block with transactions if there is more than 0
				if (blockWithTransactions[startFromBlock].transactions.length > 0) {
					await writeLogFile(
						`logs/blocks-with-transactions.json`,
						JSON.stringify(blockWithTransactions)
					);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
