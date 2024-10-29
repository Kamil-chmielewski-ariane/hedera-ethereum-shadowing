import { AccountId, Client } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/ethereum/balances/get-miner-and-uncles-balance';
import { ethers } from 'ethers';
import { sendTinyBarToAlias } from '@/apps/shadowing/transfers/send-tiny-bar-to-alias';
import { calculateFee } from '@/utils/helpers/calculate-fee';
import { BigNumber } from '@ethersproject/bignumber';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';

//TODO To type transaction array
export async function sendBlockReward(
	accountId: AccountId,
	client: Client,
	currentBlock: string,
	transactions: any[],
	nodeAccountId: AccountId
) {
	const convertedCurrentBlock = convertHexIntoDecimal(currentBlock)
	const miners = await getMinerAndUnclesBalance(currentBlock);
	for (const miner of miners) {
		if (miner.id && miner.balanceBefore && miner.balanceAfter) {
			let minerBalanceDifference = BigNumber.from(0);
			const minerBlockReward = BigNumber.from(String(miner.balanceAfter)).sub(String(miner.balanceBefore));
			for (const transaction of transactions) {

				if (transaction.to === miner.id) {
					console.log(
						`Miner "TO" found in transaction ${transaction.hash} for account ${miner.id}`
					);
					console.log(
						`Removing ${BigNumber.from(String(transaction.value)).toString()} from the miner account balance`
					);
					console.log('amount', transaction.value);
					minerBalanceDifference = minerBalanceDifference.sub(BigNumber.from(String(transaction.value)))
				}
		
				if (transaction.from === miner.id) {
					console.log(
						`Miner "FROM" found in transaction ${transaction.hash} for account ${miner.id}`
					);
					console.log(`Adding money ${transaction.value} to the minter balance`);
					console.log('amount', BigNumber.from(String(transaction.value)).toString());
		
					const fee = calculateFee(transaction.gas, transaction.gasPrice)
					minerBalanceDifference = BigNumber.from(String(transaction.value)).add(BigNumber.from(String(fee)))
				}
			}
			const minerRewardPriceWei = minerBlockReward.add(BigNumber.from(minerBalanceDifference));
			const minerRewardEth = ethers.formatEther(minerRewardPriceWei.toString())
		
			const minerRewardTinyBar = Math.floor(
				Number(minerRewardEth) * 10 ** 8
			);
		
			console.log(`sending to miner ${miner.id} money reward: ${minerRewardEth}`);
		
			await sendTinyBarToAlias(accountId, miner.id, minerRewardTinyBar, client, convertedCurrentBlock, nodeAccountId);
		}
	}
}
