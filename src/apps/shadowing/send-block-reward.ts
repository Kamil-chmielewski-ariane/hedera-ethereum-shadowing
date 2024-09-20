import { sendHbarToAlias } from "@/apps/shadowing/send-hbar-to-alias";
import {
	AccountId,
	Client,
	Hbar,
	TransferTransaction
} from '@hashgraph/sdk';
import { getMinersForBlock } from "@/apps/shadowing/get-miners-for-block";

export async function sendBlockReward(accountId: AccountId, client: Client, block: any) {
	const miners = await getMinersForBlock(block);
	console.log("Sending reward to miners");
	for (const miner of miners) {
		await sendHbarTransfer(miner, accountId, client, 0);
	}
}

async function sendHbarTransfer(miner: any, accountId: AccountId, client: Client, iterator: number) {
	try {
		if (iterator < 30) {
			const transaction = new TransferTransaction()
				.addHbarTransfer(accountId, new Hbar(-6))
				.addHbarTransfer(miner, new Hbar(6));

			// Execute the transaction
			await transaction.execute(client);
		}
	}
	catch (error) {
		iterator++;
		sendHbarTransfer(miner, accountId, client, iterator);
	}
}