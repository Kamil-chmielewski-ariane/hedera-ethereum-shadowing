import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendHbarToAlias } from '@/apps/shadowing';
import { sendRawTransaction } from '@/api/send-raw-transaction';

export async function transactionNoGas() {
	let rawBody = await getRawTransaction('0xa02a056a0899d63073f82e7f6ca75cf36f3a6582b940f4e801bb049b634072a8');
	await sendHbarToAlias('0x731B8DbC498d3db06a64037DDeA7685490Af4ee5', 20)
	await sendRawTransaction(rawBody);
}
