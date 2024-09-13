import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
import { sendHbarToAlias } from '@/apps/shadowing/send-hbar-to-alias';
import { AccountId, Client } from '@hashgraph/sdk';

//This function create a transaction and send the rawBody to the erigon eth_sendRawTransaction endpoint. Should return gas minimum price error
export async function transactionNoGas(accountId: AccountId, client: Client) {
	const rawBody = await getRawTransaction(
		'0xa02a056a0899d63073f82e7f6ca75cf36f3a6582b940f4e801bb049b634072a8'
	);
	await sendHbarToAlias(
		accountId,
		'0x731B8DbC498d3db06a64037DDeA7685490Af4ee5',
		20,
		client
	);
	await sendRawTransaction(rawBody);
}
