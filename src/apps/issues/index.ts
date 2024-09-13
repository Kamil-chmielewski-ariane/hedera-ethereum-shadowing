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
	// 		evmAddress: '0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9',
	// 		hbar: 200,
	// 		gas: 100,
	// 	},
	// 	accountId,
	// 	client,
	// 	OPERATOR_PRIVATE || ''
	// );

	// INVALID_ETHEREUM_TRANSACTION issue
	// sendTransactionAsEthereum(
	// 	{
	// 		txHash:
	// 			'0x80dfd758cbb77cb0c6e703da9f8b02d8094e02d7d68573237e3097c7fefa5554',
	// 		evmAddress: '0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9',
	// 		hbar: 200,
	// 		gas: 100,
	// 	},
	// 	accountId,
	// 	client,
	// 	OPERATOR_PRIVATE || ''
	// );
})();
