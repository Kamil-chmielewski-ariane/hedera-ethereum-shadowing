import { AccountId, Client, EthereumTransaction } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/get-miner-and-uncles-balance';
import { formatEther } from 'ethers';
import { sendTinyBarToAlias } from '@/apps/shadowing/send-tiny-bar-to-alias';
import { calculateFee } from '@/apps/shadowing/calculate-fee';

//TODO To type transaction array
export async function sendBlockReward(
	accountId: AccountId,
	client: Client,
	currentBlock: string,
	transactions: any[]
) {
	const minerAndUncles = await getMinerAndUnclesBalance(currentBlock);
	const minerBlockReward =
		BigInt(minerAndUncles.miner.balanceAfter) -
		BigInt(minerAndUncles.miner.balanceBefore);
	let minerBalanceDifference = BigInt(0);

	if (transactions.length > 0) {
		for (const transaction of transactions) {
			if (transaction.to === minerAndUncles.miner.id) {
				console.log(
					`Miner "TO" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(
					`Removing ${BigInt(transaction.value)} from the minter account balance`
				);
			}

			if (transaction.from === minerAndUncles.miner.id) {
				console.log(
					`Miner "FROM" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(`Adding money ${transaction.value} to the minter balance`);
				console.log('amount', BigInt(transaction.value));

				const fee = calculateFee(transaction.gas, transaction.gasPrice);
				minerBalanceDifference =
					minerBalanceDifference + BigInt(transaction.value) + BigInt(fee);
			}

			if (minerAndUncles.uncles) {
				for (const uncle of minerAndUncles.uncles) {
					let uncleAccountDifference = BigInt(0);
					if (transaction.to === uncle.id) {
						console.log(
							`Uncle "TO" found in transaction ${transaction.hash} for account ${uncle.id}`
						);
						console.log(
							`Adding money ${transaction.value} to the uncle's balance`
						);
						uncleAccountDifference =
							uncleAccountDifference + BigInt(transaction.value);
					}

					if (transaction.from === uncle.id) {
						console.log(
							`Uncle "FROM" found in transaction ${transaction.hash} for account ${uncle.id}`
						);
						console.log(
							`Removing money ${transaction.value} from the uncle's balance`
						);
						const fee = calculateFee(transaction.gas, transaction.gasPrice);
						uncleAccountDifference =
							uncleAccountDifference - BigInt(transaction.value) + BigInt(fee);
					}

					const uncleReward =
						BigInt(uncle.balanceAfter) - BigInt(uncle.balanceBefore);
					const uncleRewardPrice = uncleReward + uncleAccountDifference;
					const uncleRewardPriceEth = formatEther(uncleRewardPrice);
					const uncleRewardTinyBar = Math.floor(
						Number(uncleRewardPriceEth) * 10 ** 8
					);
					await sendTinyBarToAlias(
						accountId,
						uncle.id,
						uncleRewardTinyBar,
						client
					);
				}
			}
		}

		const minerRewardPriceWei =
			minerBlockReward + BigInt(minerBalanceDifference);
		const minerRewardPriceEth = formatEther(minerRewardPriceWei);

		console.log('minerRewardPriceEth', minerRewardPriceEth);

		const minerRewardTinyBar = Math.floor(
			Number(minerRewardPriceEth) * 10 ** 8
		);
		// await sendTinyBarToAlias(accountId, minerAndUncles.miner.id, minerRewardTinyBar, client)
	}
}
