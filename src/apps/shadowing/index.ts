import { getAllGenesisData } from '@/apps/shadowing/frontier/get-all-frontier-data';
import { Client, AccountId } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { startNetworkReplicationProcess } from '@/apps/shadowing/blockchain-utils/start-network-replication-process';
import { sendHbarToAlias } from '@/apps/shadowing/transfers/send-hbar-to-alias';
import { compareStateForContractsInBlock } from '@/apps/shadowing/blockchain-utils/compare-state-root-of-blocks';
import { getTransaction } from '@/api/hedera/get-transaction';
import { createEthereumTransaction } from '@/apps/shadowing/ethereum/create-ethereum-transaction';
import { getHederaContractStates } from '@/apps/shadowing/hedera/get-hedera-contract-states';
import { getStorageAt } from '@/api/erigon/get-storage-at';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;

const node = { '127.0.0.1:50211': new AccountId(3) };
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {
	// await startNetworkReplicationProcess(accountId, genesisTransactions, client);
	const tableOfTxHash = [
		'0x1009199f804a4c75d266627548dc154989eec8385c7b3a67e2bd50a5db5063c9',
		"0xf610415432536b090f219ed834e71540a8a5a2967905efdcd02e55e35ed5958f",
		"0x924fbeaac12d61557ebd0276ba68babcbb769adea3b09b1d5869a6a00246fdd5",
		"0x76eda1c97fc2ce2bfc69cf300dfb28776446f05cc2a1d47c534640e94a7a27eb",
		"0xd42e0945337a445dd1e93e8d77528b9174f66306574975a7ba4acd4ea57c357d",
		"0x2974937220d8bfca08207824ff15462735570e9827c2584b84d37ae362adaa00",
		"0x52dcba3e29b4c5060124b52f1356d6a6c57af3494f177282d22dec3b72c94d4b",
		"0x4f7ff178327faffb2506707d9a2147b834cc417885f0ae45ca4c08a74ac2cfbd",
		"0x1b352e76caf6851e23a5561f0ace599206d08e1db82a9d0ff0bcf33a35f28658",
		"0xbd19856f9ad0bb31fae78d6317a4fea0a10410d1c35f44476cf919a6d9025406",
		"0x8ccfebe033350f63ee49a429f6f783d982b6547df9fb3f927ad02ef73842f577",
		"0x60e14f181e95a38a63fe74df356cde7cdcd80903d01b6f4023e14b221dead23e",
		"0x775b6226b889c54bc2b384288dae51d33fd8c17b481697a590376970b290e268",
		"0x8ae1f307db28c862a0d58a3172a95145abfedcc2fea629161a94b5eb94c24d1b",
		"0x63ec523097c8b5c8fc51924a157125ea19d20930ca74387b29319ed6e20453d1",
		"0x046c24ecf5f229913746807eaa3af74ab2a5605b3ad149b94ca855c51c27a4e3",
		"0x69c029bfdfb8f0a70192efef3a911e0ac111183081ba8f53b5fb32d3b06b0841",
		"0xaf85ca1eefae870ab64b65bb678564c1cf0ca8e71e946adbe66253f32c2c3124",
		"0x75fee1a1be85202cfb2070f9a30f39239be06802a3c63a5b1a2bb0583e24ef01",
		"0xbac95565a5846e984abe4be735a3ccd3924e423a2f26be3ebad8a63be9253b17",
		"0x55490dd83c3c0ddfaaa02d7a70905447701db3d87beba8defb0a5c59da1043c0",
		"0x91a2059d0ad7c841960bad4b8217af0f7a2f15eebc2308760c8c12058b2dfa21",
		"0xb26b2e936044d5a60c129e03fdc3fac3d8e7f98c4c56c8f207eaaefe8519e608",
		"0x4ea27538e04515f4eaec33794d44f7a1b89737a74b61e75774e4a6eddd2e031f",
		"0x85e339d06c16000ed326c10bff2cdc6163c89ac4fea66e97c2cf4c29348e4016",
		"0xb560462e14338322e2670883991e8bc687203c0980ce856e2d6d2ad2ef5538a4",
		"0x3b53080a61d92bb19340cc68174506c2f355332bf9c9aa4fb3b2d3286ee2d9b6",
		"0x47d9cd56fdf342a53b097ad4e7e048c489fb6bc419494016d723136af34b7a09",
		"0xd19ee946a03db24f85147da06aef9f31f412259bb162aa215fbfb6803b4a9d87",
		"0x8494952d2fc431833f81c870e6ba481bb499546640f235448617a514aba4726f",
		"0x1d5703eb6b77205ec0c51d0087c8cc10854c9ced1b2dc635a74346cd62ce14a9",
		"0xdbef18b126376681e192491dd5da3066f582ede08cd920c679d93ff160026b7e",
		"0x7978bee18d79678cdf3d9b23cf8f165a5a3f0ea7a9051d431a64797c4e3b5250",
		"0x7679570d96be0838fd86b6b53ec592ef5a6ffb047a2237b05ceb0b63470b6aec"
	];

	await sendHbarToAlias(
		accountId,
		'0xa701afD383E5c9f85a07A228a4837B2E31aDaC9a',
		1,
		client
	);

	const errorInBlock = [];
	for (const elem of tableOfTxHash) {
			await createEthereumTransaction(
				{
					txHash: elem,
					gas: 21000,
				},
				accountId,
				client
			);

		const transaction = await getTransaction(elem)
		if (transaction && transaction.hash && transaction.to) {
			const possibleTransactionAddress = transaction.to;
			console.log(possibleTransactionAddress);
			const hederaStates = await getHederaContractStates(possibleTransactionAddress);
			for (const hederaState of hederaStates) {
				const sepoliaStateValue = await getStorageAt(possibleTransactionAddress, hederaState.slot, transaction.blockNumber);
				if (sepoliaStateValue != hederaState.value) {
					const data = {
						"blockNumber": transaction.blockNumber,
						"transactionHash": transaction.hash,
						"contractAddress": possibleTransactionAddress,
						"searchedSlot": hederaState.slot,
						"hederaValue": hederaState.value,
						"ethereumValue": sepoliaStateValue
					}
					errorInBlock.push(data);
				}
			}
		}
	}

	console.log(errorInBlock);
})();
