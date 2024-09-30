import { AccountId, AccountInfoQuery, Client } from '@hashgraph/sdk';

export async function getOperatorAccountBalance(accountId: AccountId, client: Client) {
	const query = new AccountInfoQuery()
		.setAccountId(accountId);

	const accountInfo = await query.execute(client);

	return Number(accountInfo.balance.toTinybars());
}
