import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { getAccountBalance } from '@/api/erigon/get-account-balance';
import { convertIntoPrevBlockNumber } from '@/utils/helpers/convert-into-prev-block-number';
import { getUncleByBlockNumberAndIndex } from '@/api/erigon/get-uncle-by-block-number-and-index';

export interface Miner {
	id: string;
	balanceBefore: string;
	balanceAfter: string;
}

export async function getMinerAndUnclesBalance(
	blockNumber: string
): Promise<Miner[]> {
	const result = await getBlockByNumber(blockNumber);
	const prevBlockNumber = convertIntoPrevBlockNumber(blockNumber);
	const miners = [];
	const minersWithBalance: Miner[] = [];

	if (result.miner) {
		const miner = result.miner;
		miners.push(miner);

		if (result.uncles && result.uncles.length > 0) {
			const uncles = result.uncles;
			for (let i = 0; i < uncles.length; i++) {
				const uncleResult = await getUncleByBlockNumberAndIndex(
					blockNumber,
					i.toString(16)
				);
				if (
					uncleResult &&
					uncleResult.miner &&
					!miners.includes(uncleResult.miner)
				) {
					miners.push(uncleResult.miner);
				}
			}
		}

		for (const minerForBalance of miners) {
			const minerBalanceBefore = await getAccountBalance(
				minerForBalance,
				prevBlockNumber
			);
			const minerBalanceAfter = await getAccountBalance(
				minerForBalance,
				blockNumber
			);
			minersWithBalance.push({
				id: minerForBalance,
				balanceBefore: minerBalanceBefore,
				balanceAfter: minerBalanceAfter,
			});
		}
	}
	return minersWithBalance;
}
