import { AccountId, Client } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/ethereum/balances/get-miner-and-uncles-balance';
import { ethers } from 'ethers';
import { sendTinyBarToAlias } from '@/apps/shadowing/transfers/send-tiny-bar-to-alias';
import { calculateFee } from '@/utils/helpers/calculate-fee';
import { BigNumber } from '@ethersproject/bignumber';
import { getAccount } from '@/api/hedera-mirror-node/get-account';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';

//TODO To type transaction array
export async function sendBlockReward(
	accountId: AccountId,
	client: Client,
	currentBlock: string,
	transactions: any[]
) {
	const minerAndUncles = await getMinerAndUnclesBalance(currentBlock);
	let minerBalanceDifference = BigNumber.from(0);
	const minerBlockReward = BigNumber.from(String(minerAndUncles.miner.balanceAfter)).sub(String(minerAndUncles.miner.balanceBefore))

	if (transactions.length > 0) {
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

			if (transaction.to === minerAndUncles.miner.id) {
				console.log(
					`Miner "TO" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(
					`Removing ${BigNumber.from(String(transaction.value)).toString()} from the miner account balance`
				);
				console.log('amount', transaction.value);
				minerBalanceDifference = minerBalanceDifference.sub(BigNumber.from(String(transaction.value)))
			}

			if (transaction.from === minerAndUncles.miner.id) {
				console.log(
					`Miner "FROM" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(`Adding money ${transaction.value} to the minter balance`);
				console.log('amount', BigNumber.from(String(transaction.value)).toString());

				const fee = calculateFee(transaction.gas, transaction.gasPrice)
				minerBalanceDifference = BigNumber.from(String(transaction.value)).add(BigNumber.from(String(fee)))
			}

			if (minerAndUncles.uncles) {
				for (const uncle of minerAndUncles.uncles) {
					let uncleAccountDifference = BigNumber.from(0);

					if (transaction.to === uncle.id) {
						console.log(
							`Uncle "TO" found in transaction ${transaction.hash} for account ${uncle.id}`
						);
						console.log(
							`Removing money ${transaction.value} to the uncle's balance`
						);
						console.log('amount', BigNumber.from(String(transaction.value)).toString());
						uncleAccountDifference = BigNumber.from(String(uncleAccountDifference)).sub(BigNumber.from(String(transaction.value)));
					}

					if (transaction.from === uncle.id) {
						console.log(
							`Uncle "FROM" found in transaction ${transaction.hash} for account ${uncle.id}`
						);
						console.log(
							`Adding money ${transaction.value} from the uncle's balance`
						);
						console.log('amount', BigNumber.from(String(transaction.value)).toString());

						const fee = calculateFee(transaction.gas, transaction.gasPrice)
						uncleAccountDifference = BigNumber.from(String(transaction.value)).add(BigNumber.from(String(fee)))
					}

					const uncleReward = BigNumber.from(String(uncle.balanceAfter)).sub(BigNumber.from(String(uncle.balanceBefore)));
					const uncleRewardPrice = uncleReward.add(uncleAccountDifference)
					const uncleRewardPriceEth = ethers.formatEther(uncleRewardPrice.toString())

					const uncleRewardTinyBar = Math.floor(
						Number(uncleRewardPriceEth) * 10 ** 8
					);

					console.log(`sending to uncle ${uncle.id} money reward: ${uncleRewardPriceEth}`);

					await sendTinyBarToAlias(
						accountId,
						uncle.id,
						uncleRewardTinyBar,
						client
					);
				}
			}
		}
		const minerRewardPriceWei = minerBlockReward.add(BigNumber.from(minerBalanceDifference));
		const minerRewardEth = ethers.formatEther(minerRewardPriceWei.toString())

		const minerRewardTinyBar = Math.floor(
			Number(minerRewardEth) * 10 ** 8
		);

		console.log(`sending to miner ${minerAndUncles.miner.id} money reward: ${minerRewardEth}`);

		await sendTinyBarToAlias(accountId, minerAndUncles.miner.id, minerRewardTinyBar, client)
	}
}
