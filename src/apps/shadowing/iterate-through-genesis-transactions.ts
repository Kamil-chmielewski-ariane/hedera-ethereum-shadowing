import { Genesis } from '@/utils/types';
import { getLastBlockNumber } from '@/api/get-last-block-number';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { getTransactionByBlock } from '@/apps/shadowing/get-transaction-by-block';
import { sendHbarToAlias } from '@/apps/shadowing/index';

export async function iterateThoughGenesisTransactions(
	genesisTransactions: Genesis[]
) {
	for (const transaction of genesisTransactions) {
        console.log('iterateThoughGenesisTransactions', transaction);
		await sendHbarToAlias(transaction.toAccount, transaction.amount);
	}
	const lastBlockNumber = await getLastBlockNumber();
	const convertedBlockNumber = convertHexIntoDecimal(lastBlockNumber);

	getTransactionByBlock(5966638, convertedBlockNumber);
}
