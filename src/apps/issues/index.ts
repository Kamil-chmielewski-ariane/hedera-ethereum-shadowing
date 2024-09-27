import { transactionNoGas } from '@/apps/issues/transaction-no-gas';
import { AccountId, Client } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { sendTransactionAsEthereum } from '@/apps/issues/send-transaction-as-ethereum';
import { getBlockByNumber } from '@/api/erigon/get-block-by-number';
import { findAndSendBlockReward } from '@/apps/issues/find-and-send-block-reward';
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
	// 			'0x3f0f37e1efe4f78d898fbf796f1fb7cebf27e33e9ed977eab28a527b75225005',
	// 		evmAddress: '0xa9DE2a4904DDcEc6f969784FbAd36a0b7fe0f2Cd',
	// 		hbar: 200,
	// 		gas: 100,
	// 	},
	// 	accountId,
	// 	client,
	// 	OPERATOR_PRIVATE || ''
	// );

	// GET BLOCK REWARD
	// findAndSendBlockReward(accountId, client, 6714960);

	// INVALID_ETHEREUM_TRANSACTION issue
	// sendTransactionAsEthereum(
	// 	{
	// 		txHash:
	// 			'0x605480662cca049fde57c626f5cb2315df834f75e5602d53b765ecb45f6a320a',
	// 		evmAddress: '0x3Cd868E221A3be64B161D596A7482257a99D857f',
	// 		hbar: 10,
	// 		gas: 10,
	// 	},
	// 	accountId,
	// 	client,
	// 	OPERATOR_PRIVATE || ''
	// );
})();
