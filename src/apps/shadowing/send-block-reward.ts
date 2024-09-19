import { sendHbarToAlias } from "@/apps/shadowing/send-hbar-to-alias";
import {
	AccountId,
	Client
} from '@hashgraph/sdk';
import { getMinersForBlock } from "@/apps/shadowing/get-miners-for-block";

export async function sendBlockReward(accountId: AccountId, client: Client, block: any) {
	const miners = await getMinersForBlock(block);
	for (const miner of miners) {
		await sendHbarToAlias(accountId, miner, 6, client);
	}
}