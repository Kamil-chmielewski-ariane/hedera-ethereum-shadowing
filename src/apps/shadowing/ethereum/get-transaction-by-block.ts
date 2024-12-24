import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { AccountId, Client } from '@hashgraph/sdk';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { getAccount } from '@/api/hedera-mirror-node/get-account';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { ethers } from 'ethers';

export async function getTransactionByBlock(
	startFromBlock: number,
	numberOfBlocks: number,
	accountId: AccountId,
	client: Client,
	nodeAccountId: AccountId
) {
	await writeLogFile(
		`logs/blocks-with-transactions.csv`,
		'BlockNumber,EthereumTransactionHash,HederaTransactionHash \r\n',
		false
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
					if (!isAccountCreated && transaction.to !== null && transaction.to !== '0x0000000000000000000000000000000000000000') {
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

					//When address 0 appear in transactions, send amount to the wallet hedera account
					if (transaction.to === '0x0000000000000000000000000000000000000000') {
						const weiValue = ethers.formatEther(transaction.value);

						await sendHbarToAlias(
							accountId,
							'1002',
							Number(weiValue),
							client,
							startFromBlock,
							nodeAccountId
						);

						await writeLogFile(
							`logs/blocks-with-transactions.csv`,
							`${startFromBlock},${transaction.hash},${'ADDRESS 0 TRANSACTION'
							} \r\n`,
							false
						);
						continue
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
									: 'TRANSACTION NOT CREATED'
							} \r\n`,
							false
						);
					}
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
