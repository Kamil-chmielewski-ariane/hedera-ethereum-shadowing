import { transactionNoGas } from '@/apps/issues/transaction-no-gas';
import { AccountId, Client } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { sendTransactionAsEthereum } from '@/apps/issues/send-transaction-as-ethereum';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;
const node = { '127.0.0.1:50211': new AccountId(3) };
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(() => {
	// No gass error issue
	// transactionNoGas(accountId, client);

	// WRONG_CHAIN_ID issue
	// sendTransactionAsEthereum(
	// 	{
	// 		txHash:
	// 			'0xda17f66e764bbe84f2d71b5544c9733f3b4a48d49e3226a98e955747ba0b7060',
	// 		evmAddress: '0xa9DE2a4904DDcEc6f969784FbAd36a0b7fe0f2Cd',
	// 		hbar: 200,
	// 		gas: 100,
	// 	},
	// 	accountId,
	// 	client,
	// 	OPERATOR_PRIVATE || ''
	// );

	// INVALID_ETHEREUM_TRANSACTION issue
	sendTransactionAsEthereum(
		{
			txHash:
				'0x605480662cca049fde57c626f5cb2315df834f75e5602d53b765ecb45f6a320a',
			evmAddress: '0x3Cd868E221A3be64B161D596A7482257a99D857f',
			hbar: 10,
			gas: 10,
		},
		accountId,
		client,
		OPERATOR_PRIVATE || ''
	);
})();
