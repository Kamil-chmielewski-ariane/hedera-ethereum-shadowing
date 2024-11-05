import { getMirrorNodeTransaction } from '@/api/hedera-mirror-node/get-mirror-node-transaction';
import { getHederaContractStatesByTimestamp } from '@/apps/shadowing/hedera/get-hedera-contract-states-by-timestamp';
import { getStorageAt } from '@/api/erigon/get-storage-at';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { ContractType } from '@/utils/types';

export async function compareSmartContractRootState(contractRootData: ContractType) {
	console.log(`Starting compare state contract ${contractRootData.blockNumber}`)
	
	const errorInBlock = [];
	const contractsInBlock = [];
	const transactionResponse = await getMirrorNodeTransaction(contractRootData.hederaTransactionHash);

	const createTransactionTimestamp = transactionResponse.consensus_timestamp;
	console.log(createTransactionTimestamp, 'lastTransactionTimestamp');

	if (contractRootData && contractRootData.ethereumTransactionHash && contractRootData.addressTo) {
		const possibleTransactionAddress = contractRootData.addressTo;
		const hederaStates = await getHederaContractStatesByTimestamp(
			possibleTransactionAddress,
			createTransactionTimestamp
		);

		if (hederaStates.length > 0) {
			contractsInBlock.push(transactionResponse.transactionHash);
		}

		for (const hederaState of hederaStates) {
			const sepoliaStateValue = await getStorageAt(
				possibleTransactionAddress,
				hederaState.slot,
				contractRootData.blockNumber.toString(16)
			);

			const contractDetails = {
				blockNumber: contractRootData.blockNumber,
				ethereumTransactionHash: contractRootData.ethereumTransactionHash,
				timestamp: hederaState.timestamp,
				contractAddress: possibleTransactionAddress,
				searchedSlot: hederaState.slot,
				hederaValue: hederaState.value,
				ethereumValue: sepoliaStateValue,
			};

			await writeLogFile(
				`logs/all-contracts-details.json`,
				JSON.stringify(contractDetails)
			);
			if (sepoliaStateValue != hederaState.value) {
				errorInBlock.push(contractDetails);
			}
		}
	}

	const blockWithContracts = {
		[contractRootData.blockNumber]: {
			contracts: contractsInBlock,
		},
	};

	if (blockWithContracts[contractRootData.blockNumber].contracts.length > 0) {
		await writeLogFile(
			`logs/blocks-with-contracts.json`,
			JSON.stringify(blockWithContracts)
		);
	}

	if (errorInBlock.length > 0) {
		await writeLogFile(
			`logs/state-root-compare-errors.json`,
			JSON.stringify(errorInBlock)
		);
	}
}
