import {getBlockByNumber} from '@/api/get-block-by-number';
import {getAccountBalance} from '@/api/get-account-balance';
import {convertIntoPrevBlockNumber} from '@/utils/helpers/convert-into-prev-block-number';

interface Uncle {
	id: string,
	balanceBefore : string,
	balanceAfter : string,
}

export async function getMinerAndUnclesBalance(blockNumber: string) {
	const result = await getBlockByNumber(blockNumber);
	const miner = result.miner;
	const uncles: Uncle[] = []

	const prevBlockNumber = convertIntoPrevBlockNumber(blockNumber);

	const minerBalanceBefore = await getAccountBalance(miner, prevBlockNumber);
	const minerBalanceAfter = await getAccountBalance(miner, blockNumber);

	if (result.uncles.length > 0) {
		result.uncles.map(async (address: string) => {
			const uncleBalanceBefore = await getAccountBalance(address, prevBlockNumber);
			const uncleBalanceAfter = await getAccountBalance(address, blockNumber);

			uncles.push({
				id: address,
				balanceBefore: uncleBalanceBefore,
				balanceAfter: uncleBalanceAfter
			});
		})
	}

	return {
		miner: {
			balanceBefore: minerBalanceBefore,
			balanceAfter: minerBalanceAfter,
		},
        uncles: uncles
	};
}
