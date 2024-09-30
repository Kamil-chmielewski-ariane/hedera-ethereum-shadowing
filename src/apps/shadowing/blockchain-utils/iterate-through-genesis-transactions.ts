import { Genesis } from '@/utils/types';
import { getLastBlockNumber } from '@/api/erigon/get-last-block-number';
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { getTransactionByBlock } from '@/apps/shadowing/ethereum/get-transaction-by-block';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { AccountId, Client } from '@hashgraph/sdk';
import { getOperatorAccountBalance } from '@/apps/shadowing/hedera/get-operator-account-balance';
import { calculateCreateAccountFee } from '@/apps/shadowing/hedera/calculate-create-account-fee';

export async function iterateThoughGenesisTransactions(
	accountId: AccountId,
	genesisTransactions: Genesis[],
	client: Client
) {
	for (const transaction of genesisTransactions) {
		console.log('iterateThoughGenesisTransactions', transaction);

		const accountBalanceBefore = await getOperatorAccountBalance(accountId, client);

		await sendHbarToAlias(
			accountId,
			transaction.toAccount,
			transaction.amount,
			client
		);

		const accountCreateFee = await calculateCreateAccountFee(accountId, client, accountBalanceBefore, transaction.amount)
		console.log(`fee for account create: ${accountCreateFee}`)
	}
	const lastBlockNumber = await getLastBlockNumber();
	const convertedBlockNumber = convertHexIntoDecimal(lastBlockNumber);

	getTransactionByBlock(1, convertedBlockNumber, accountId, client);
}
