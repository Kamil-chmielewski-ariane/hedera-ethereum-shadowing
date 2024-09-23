import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/get-miner-and-uncles-balance';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { formatEther } from 'ethers';

//TODO To type transaction array
export async function sendBlockReward(accountId: AccountId, client: Client, currentBlock: string, transactions: any[] ) {

	const minerAndUncles = await getMinerAndUnclesBalance(currentBlock);
	const minerBlockReward = convertHexIntoDecimal(minerAndUncles.miner.balanceAfter) - convertHexIntoDecimal(minerAndUncles.miner.balanceBefore);

	if (transactions.length > 0) {
		for (const transaction of transactions) {

			if (transaction.to === minerAndUncles.miner.id) {
				console.log(`Miner "TO" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`);
				console.log(`Removing ${convertHexIntoDecimal(transaction.value)} from the minter account balance`)
			}

			if (transaction.from === minerAndUncles.miner.id) {
				console.log(`Miner "FROM" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`);
				console.log(`Adding money ${transaction.value} to the minter balance`)

				const t = new TransferTransaction()
					.addHbarTransfer(accountId, new Hbar(convertHexIntoDecimal(transaction.value)))
					.addHbarTransfer(minerAndUncles.miner.id, new Hbar(convertHexIntoDecimal(transaction.value)))
				await t.execute(client);

			}

			if (minerAndUncles.uncles.map((elem) => elem.id === transaction.to)) {
				console.log(`Uncle "TO" found in transaction ${transaction.hash} for account ${transaction.to}`);
				console.log(`Adding money ${transaction.value} to the uncle balance`)

			}

			if (minerAndUncles.uncles.map((elem) => elem.id === transaction.from)) {
				console.log(`Uncle "FROM" found in transaction ${transaction.hash} for account ${transaction.from}`);
				console.log(`Removing money ${transaction.value} from the uncle account balance`)

				const t = new TransferTransaction()
					.addHbarTransfer(accountId, new Hbar(formatEther(convertHexIntoDecimal(transaction.value))))
					.addHbarTransfer(minerAndUncles.miner.id, new Hbar(formatEther(convertHexIntoDecimal(transaction.value))))
				await t.execute(client);
			}
		}

		const minedBlockReward = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(formatEther(-minerBlockReward)))
			.addHbarTransfer(minerAndUncles.miner.id, new Hbar(formatEther(minerBlockReward)));

		await minedBlockReward.execute(client);
	}

}
