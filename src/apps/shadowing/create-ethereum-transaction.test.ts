import { describe, it, expect } from '@jest/globals';
import { getRawTransaction } from '@/api/get-raw-transaction';
import { sendRawTransaction } from '@/api/send-raw-transaction';
import { sendHbarToAlias } from '@/apps/shadowing/send-hbar-to-alias';
import { AccountId, Client } from '@hashgraph/sdk';
import { getAllGenesisData } from '@/apps/shadowing/get-all-frontier-data';
import dotenv from 'dotenv';

dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;
const node = { '127.0.0.1:50211': new AccountId(3) };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

describe('Create ethereum transaction', () => {
	it(
		'should describe gas amount error',
		async () => {
			let rawBody = await getRawTransaction(
				'0xa02a056a0899d63073f82e7f6ca75cf36f3a6582b940f4e801bb049b634072a8'
			);
			await sendHbarToAlias(
				accountId,
				'0x731B8DbC498d3db06a64037DDeA7685490Af4ee5',
				20,
				client
			);

			const data = await sendRawTransaction(rawBody);
			const gasErrorMessage = data.error.message;

			expect(
				gasErrorMessage.includes(
					"Gas price '200000000000' is below configured minimum gas price '710000000000'"
				)
			).toBeTruthy();
		},
		70 * 1000
	);
});
