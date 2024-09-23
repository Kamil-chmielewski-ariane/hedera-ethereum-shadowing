import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { getMinerAndUnclesBalance } from '@/apps/shadowing/get-miner-and-uncles-balance';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { formatEther } from 'ethers';


async function processTransaction(accountId: AccountId, transaction: any, minerAndUncles: any, client: Client ) {
	const minerId = minerAndUncles.miner.id;

	if (transaction.to === minerAndUncles.miner.id) {
		console.log(
			`Miner "TO" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
		);
		console.log(
			`Removing ${convertHexIntoDecimal(transaction.value)} from the minter account balance`
		);
	}

	if (transaction.from === minerAndUncles.miner.id) {
		console.log(
			`Miner "FROM" found in transaction ${transaction.hash} for account ${minerAndUncles.miner.id}`
		);
		console.log(`Adding money ${transaction.value} to the minter balance`);

		const t = new TransferTransaction()
			.addHbarTransfer(
				accountId,
				new Hbar(convertHexIntoDecimal(transaction.value))
			)
			.addHbarTransfer(
				minerAndUncles.miner.id,
				new Hbar(convertHexIntoDecimal(transaction.value))
			);
		await t.execute(client);
	}

	for (const uncle of minerAndUncles.uncles) {
		if (transaction.to === uncle.id) {
			console.log(`Uncle "TO" found in transaction ${transaction.hash} for account ${uncle.id}`);
			console.log(`Adding money ${transaction.value} to the uncle's balance`);
		}

		if (transaction.from === uncle.id) {
			console.log(`Uncle "FROM" found in transaction ${transaction.hash} for account ${uncle.id}`);
			console.log(`Removing money ${transaction.value} from the uncle's balance`);

			const t = new TransferTransaction()
				.addHbarTransfer(accountId, new Hbar(convertHexIntoDecimal(transaction.value)))
				.addHbarTransfer(minerId, new Hbar(convertHexIntoDecimal(transaction.value)));

			await t.execute(client);
		}
	}

}

//TODO To type transaction array
export async function sendBlockReward(
	accountId: AccountId,
	client: Client,
	currentBlock: string,
	transactions: any[]
) {
	const minerAndUncles = await getMinerAndUnclesBalance(currentBlock);
	const minerBlockReward =
		convertHexIntoDecimal(minerAndUncles.miner.balanceAfter) -
		convertHexIntoDecimal(minerAndUncles.miner.balanceBefore);

	if (transactions.length > 0) {
		for (const transaction of transactions) {
			await processTransaction(accountId, transaction, minerAndUncles, client);
		}

		const minerReward = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(formatEther(-minerBlockReward)))
			.addHbarTransfer(
				minerAndUncles.miner.id,
				new Hbar(formatEther(minerBlockReward))
			);

		await minerReward.execute(client);

		if (minerAndUncles.uncles.length > 1) {
			minerAndUncles.uncles.map(async (elem) => {
				const unclePrice =
					convertHexIntoDecimal(elem.balanceAfter) -
					convertHexIntoDecimal(elem.balanceAfter);
				const uncleReward = new TransferTransaction()
					.addHbarTransfer(accountId, new Hbar(formatEther(-unclePrice)))
					.addHbarTransfer(
						minerAndUncles.miner.id,
						new Hbar(formatEther(unclePrice))
					);

				await uncleReward.execute(client);
			});
		}
	}
}
