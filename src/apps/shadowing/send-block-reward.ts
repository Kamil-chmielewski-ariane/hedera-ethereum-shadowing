import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/get-miner-and-uncles-balance';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { formatEther } from 'ethers';

//TODO To type transaction array
export async function sendBlockReward(
	accountId: AccountId,
	client: Client,
	currentBlock: string,
	transactions: any[]
) {
	const minerAndUncles = await getMinerAndUnclesBalance(currentBlock);
	const minerBlockReward = BigInt(minerAndUncles.miner.balanceAfter) - BigInt(minerAndUncles.miner.balanceBefore);
	let minerBalanceDifference = 0;
	let uncleAccountDifference = 0;

	if (transactions.length > 0) {
		for (const transaction of transactions) {
			if (transaction.to === minerAndUncles.miner.id) {
				console.log(
					`Miner "TO" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(
					`Removing ${convertHexIntoDecimal(transaction.value)} from the minter account balance`
				);
				minerBalanceDifference = minerBalanceDifference - convertHexIntoDecimal(transaction.value);
			}

			if (transaction.from === minerAndUncles.miner.id) {
				console.log(
					`Miner "FROM" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
				);
				console.log(`Adding money ${transaction.value} to the minter balance`);
				console.log('amount', convertHexIntoDecimal(transaction.value));
				minerBalanceDifference = minerBalanceDifference + convertHexIntoDecimal(transaction.value);
			}

			for (const uncle of minerAndUncles.uncles) {
				if (transaction.to === uncle.id) {
					console.log(`Uncle "TO" found in transaction ${transaction.hash} for account ${uncle.id}`);
					console.log(`Adding money ${transaction.value} to the uncle's balance`);
					uncleAccountDifference = uncleAccountDifference + transaction.value
				}

				if (transaction.from === uncle.id) {
					console.log(`Uncle "FROM" found in transaction ${transaction.hash} for account ${uncle.id}`);
					console.log(`Removing money ${transaction.value} from the uncle's balance`);
					uncleAccountDifference = uncleAccountDifference - transaction.value
				}
			}
		}

		const minerRewardPrice = minerBlockReward + BigInt(minerBalanceDifference)

		const minerReward = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(formatEther(-minerRewardPrice)))
			.addHbarTransfer(minerAndUncles.miner.id, new Hbar(formatEther(minerRewardPrice)));

		await minerReward.execute(client);

		if (minerAndUncles.uncles.length > 0) {
			minerAndUncles.uncles.map(async (elem) => {
				const uncleReward = convertHexIntoDecimal(elem.balanceAfter) - convertHexIntoDecimal(elem.balanceBefore);
				const uncleRewardPrice = uncleReward + uncleAccountDifference
				const uncleBlockReward = new TransferTransaction()
					.addHbarTransfer(accountId, new Hbar(formatEther(-uncleRewardPrice)))
					.addHbarTransfer(minerAndUncles.miner.id, new Hbar(formatEther(uncleRewardPrice)));

				await uncleBlockReward.execute(client);
			});
		}
	}
}