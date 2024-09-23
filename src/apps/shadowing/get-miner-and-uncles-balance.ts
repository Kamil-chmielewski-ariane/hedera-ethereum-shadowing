import { getBlockByNumber } from '@/api/get-block-by-number';
import { getAccountBalance } from '@/api/get-account-balance';
import {
	convertIntoAfterBlockNumber,
} from '@/utils/helpers/convert-into-prev-block-number';

interface Uncle {
	id: string;
	balanceBefore: string;
	balanceAfter: string;
}

export async function getMinerAndUnclesBalance(blockNumber: string) {
	const result = await getBlockByNumber(blockNumber);
	const miner = result.miner;
	const uncles: Uncle[] = [];

	const afterBlockNumber = convertIntoAfterBlockNumber(blockNumber);

	const minerBalanceBefore = await getAccountBalance(miner, blockNumber);
	const minerBalanceAfter = await getAccountBalance(miner, afterBlockNumber);

	if (result.uncles.length > 0) {
		result.uncles.map(async (address: string) => {
			const uncleBalanceBefore = await getAccountBalance(
				address,
				blockNumber
			);
			const uncleBalanceAfter = await getAccountBalance(address, afterBlockNumber);

			uncles.push({
				id: address,
				balanceBefore: uncleBalanceBefore,
				balanceAfter: uncleBalanceAfter,
			});
		});
	}

	return {
		miner: {
			id: miner,
			balanceBefore: minerBalanceBefore,
			balanceAfter: minerBalanceAfter,
		},
		uncles: uncles,
	};
}
