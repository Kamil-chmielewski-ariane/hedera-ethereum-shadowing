import { Genesis } from '@/utils/types';
import { getLastBlockNumber } from '@/api/erigon/get-last-block-number';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { getTransactionByBlock } from '@/apps/shadowing/ethereum/get-transaction-by-block';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { AccountId, Client } from '@hashgraph/sdk';

export async function startNetworkReplicationProcess(
	accountId: AccountId,
	genesisTransactions: Genesis[],
	client: Client
) {
	for (const transaction of genesisTransactions) {
		console.log('iterateThoughGenesisTransactions', transaction);
		await sendHbarToAlias(
			accountId,
			transaction.toAccount,
			transaction.amount,
			client
		);
	}
	const lastBlockNumber = await getLastBlockNumber();
	const convertedBlockNumber = convertHexIntoDecimal(lastBlockNumber);

	getTransactionByBlock(1, convertedBlockNumber, accountId, client);
}
