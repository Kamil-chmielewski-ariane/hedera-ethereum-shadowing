import { transactionNoGas } from '@/apps/issues/transaction-no-gas';
import { AccountId, Client } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { sendTransactionAsEthereum } from '@/apps/issues/send-transaction-as-ethereum';
import { getBlockByNumber } from '@/api/get-block-by-number';
import { findAndSendBlockReward } from '@/apps/issues/find-and-send-block-reward';
import { compareStateForSameContracts } from './compare-state-for-same-contracts';
import { sendTransactionFromSepoliaToHedera, sendTransactionHederaTestnet, sendTransactionHedera, sendTransactionSepolia, prepareAndSendTransactionFromSepoliaToHedera } from './compare-sending-transactions-sepolia';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const HEDERA_PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY
const HEDERA_RPC_URL = process.env.HEDERA_RPC_URL;
const HEDERA_TESTNET_PRIVATE_KEY = process.env.HEDERA_TESTNET_PRIVATE_KEY || '';
const HEDERA_TESTNET_RPC_URL = process.env.HEDERA_TESTNET_RPC_URL;
const node = { '127.0.0.1:50211': new AccountId(3) };
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

// (async () => {
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

	//CHECK FOR TRANSACTION FOR PROPER PARSING CHAIN ID
	// if (METAMASK_PRIVATE_KEY && HEDERA_TESTNET_PRIVATE_KEY && SEPOLIA_RPC_URL && HEDERA_TESTNET_RPC_URL) {
		// const txHash1 = await sendTransactionSepolia("0x000AA36A7", METAMASK_PRIVATE_KEY, SEPOLIA_RPC_URL, 0);
		// const txHash2 = await sendTransactionSepolia("0x000AA36A7", METAMASK_PRIVATE_KEY, SEPOLIA_RPC_URL, 2);
		// const txHash3 = await sendTransactionSepolia("0xAA36A7", METAMASK_PRIVATE_KEY, SEPOLIA_RPC_URL, 0);
		// // const txHash4 = await sendTransactionSepolia("0xAA36A7", METAMASK_PRIVATE_KEY, SEPOLIA_RPC_URL, 2);
		// await sendTransactionHederaTestnet("0x000128", HEDERA_TESTNET_PRIVATE_KEY, HEDERA_TESTNET_RPC_URL, 0);
		// await sendTransactionHederaTestnet("0x000128", HEDERA_TESTNET_PRIVATE_KEY, HEDERA_TESTNET_RPC_URL, 2);
		// await sendTransactionHederaTestnet("0x128", HEDERA_TESTNET_PRIVATE_KEY, HEDERA_TESTNET_RPC_URL, 0);
		// await sendTransactionHederaTestnet("0x128", HEDERA_TESTNET_PRIVATE_KEY, HEDERA_TESTNET_RPC_URL, 2);
		// await sendTransactionHedera(accountId, client, String(OPERATOR_PRIVATE));
		// await sendTransactionFromSepoliaToHedera("0x9ca5a66468cbcf4cf7d39de88c191e5399efa1939f57c96eded49f400b049b84", accountId, client, OPERATOR_PRIVATE || '');
		// await sendTransactionFromSepoliaToHedera("0x419ae1c103f41ef99c1e8a6f46d81bf18835bd59b3ba0603a96d49615f51397f", accountId, client, OPERATOR_PRIVATE || '');
		// await sendTransactionHedera("0x85e339d06c16000ed326c10bff2cdc6163c89ac4fea66e97c2cf4c29348e4016", accountId, client);
	// }

	// SEND LEGACY TRANSACTION FROM SEPOLIA TO HEDERA WITH ETHERS JS 
	// if (HEDERA_PRIVATE_KEY && HEDERA_RPC_URL && SEPOLIA_RPC_URL) {
	// 	await prepareAndSendTransactionFromSepoliaToHedera("0x7afaa1366e0a6273b29a6d8d7c932e939dc681ef70dfdeed2fd1a66f582d000c", HEDERA_PRIVATE_KEY, HEDERA_RPC_URL, accountId, client);
	// }

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
	//STATE COMPARISION TEST CASE #1
	// compareStateForSameContracts("0x5b000f50d4272f0874573e9365d0cbb386235ead", "0x50887fcc55040f4bc302c8add72cb6286d1fd838");

	//STATE COMPARISON TEST CASE #2
	// compareStateForSameContracts("0x1362dc92648f47a294a033892e8c7a67d37ed318", "0x65f1ac5c7ad89d830451772423871f253800ae14");
// })();