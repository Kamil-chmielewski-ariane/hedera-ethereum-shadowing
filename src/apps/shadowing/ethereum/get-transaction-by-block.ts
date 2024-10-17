import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { AccountId, Client } from '@hashgraph/sdk';
import { compareStateForContractsInBlock } from '@/apps/shadowing/blockchain-utils/compare-state-root-of-blocks';
import { sendBlockReward } from '@/apps/shadowing/transfers/send-block-reward';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import {writeLogFile} from "@/utils/helpers/write-log-file";
import {getAccount} from "@/api/hedera-mirror-node/get-account";
import {sendHbarToAlias} from "@/apps/shadowing/transfers/send-hbar-to-alias";

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

			if (transactions.length > 0) {
				console.log(`transacion in block ${startFromBlock} found...`);
				const transactionJson = JSON.stringify({
					[startFromBlock]: {
						transactions: transactions.map((transaction: any) => transaction.hash)
					}
				})

				await writeLogFile('logs/blocks-with-transactions.json', transactionJson )

				console.log('preceding iterate through transfers...');
				for (const transaction of transactions) {
					const isAccountCreated = await getAccount(transaction.to)

					if (!isAccountCreated && transaction.to !== null) {
						console.log('account not found, created new account and sending 1 hbar...')
						await sendHbarToAlias(
							accountId,
							transaction.to,
							1,
							client,
							startFromBlock
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

