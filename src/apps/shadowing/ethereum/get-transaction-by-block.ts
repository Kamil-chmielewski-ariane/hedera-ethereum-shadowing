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
	await writeLogFile(
		`logs/blocks-with-transactions.csv`,
		'BlockNumber,EthereumTransactioHash,HederaTransactionHash \r\n'
	);
	try {
		for (; startFromBlock < numberOfBlocks; startFromBlock++) {
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
				console.log(`transaction in block ${startFromBlock} found...`);
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

						await writeLogFile(
							`logs/blocks-with-transactions.csv`,
							`${startFromBlock},${transaction.hash},${
								hederaTransaction
									? hederaTransaction.transactionHash
									: 'SOLIDITY 0 ADDRESS'
							} \r\n`
						);
					}
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
