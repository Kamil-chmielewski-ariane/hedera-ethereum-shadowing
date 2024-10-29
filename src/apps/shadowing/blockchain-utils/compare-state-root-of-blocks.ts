import { getStorageAt } from "@/api/erigon/get-storage-at";
import { writeLogFile } from "@/utils/helpers/write-log-file";
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';
import { getTransaction } from '@/api/hedera-mirror-node/get-transaction';
import { getHederaContractStatesByTimestamp } from '@/apps/shadowing/hedera/get-hedera-contract-states-by-timestamp';

export async function compareStateForContractsInBlock(block: any, transactions: any, lastTransaction: any) {
    const transactionResponse = await getTransaction(lastTransaction)
    const lastTransactionTimestamp = transactionResponse.consensus_timestamp
    console.log(lastTransactionTimestamp, 'lastTransactionTimestamp');
    const blockNumberDex = convertHexIntoDecimal(block.number)
    const transactionsInBlock = [];
    const contractsInBlock = [];
    const possibleErrorInBlock = [];
    const errorInBlock = [];
    let stateRootError = false;
    for (const transaction of transactions) {
        if (transaction && transaction.hash && transaction.to) {
            const possibleTransactionAddress = transaction.to;
            console.log(possibleTransactionAddress);
            const hederaStates = await getHederaContractStatesByTimestamp(possibleTransactionAddress, lastTransactionTimestamp);
            console.log(hederaStates, 'hederaStates');

            if (hederaStates.length > 0) {
                contractsInBlock.push(transaction.to)
            } else {
                transactionsInBlock.push(transaction.hash)
            }

            for (const hederaState of hederaStates) {
                const sepoliaStateValue = await getStorageAt(possibleTransactionAddress, hederaState.stateSlot, block.number);
                if (sepoliaStateValue != hederaState.stateValue) {
                    stateRootError = true;
                    const dataError = {
                        "blockNumber": blockNumberDex,
                        "transactionHash": transaction.hash,
                        "timestamp": hederaState.timestamp,
                        "contractAddress": possibleTransactionAddress,
                        "searchedSlot": hederaState.stateSlot,
                        "hederaValue": hederaState.stateValue,
                        "ethereumValue": sepoliaStateValue
                    }
                    possibleErrorInBlock.push(dataError);
                }
            }
            if (stateRootError) {
                await new Promise(resolve => setTimeout(resolve, 120000));
                const delayedHederaStates = await getHederaContractStatesByTimestamp(possibleTransactionAddress, lastTransactionTimestamp);
                for (const delayedHederaState of delayedHederaStates) {
                    const delayedSepoliaStateValue = await getStorageAt(possibleTransactionAddress, delayedHederaState.stateSlot, block.number);
                    if (delayedSepoliaStateValue != delayedHederaState.stateValue) {
                        const delayedDataError = {
                            "blockNumber": blockNumberDex,
                            "transactionHash": transaction.hash,
                            "timestamp": delayedHederaState.timestamp,
                            "contractAddress": possibleTransactionAddress,
                            "searchedSlot": delayedHederaState.stateSlot,
                            "hederaValue": delayedHederaState.stateValue,
                            "ethereumValue": delayedSepoliaStateValue
                        }
                        errorInBlock.push(delayedDataError);
                    }
                }
            }
        }
    }

    const blockWithTransactions = {
        [blockNumberDex]: {
            transactions: transactionsInBlock
        }
    }

    const blockWithContracts = {
        [blockNumberDex]: {
            contracts: contractsInBlock
        }
    }

    if (blockWithTransactions[blockNumberDex].transactions.length > 0) {
        await writeLogFile(`logs/blocks-with-transactions.json`, JSON.stringify(blockWithTransactions));
    }

    if (blockWithContracts[blockNumberDex].contracts.length > 0) {
        await writeLogFile(`logs/blocks-with-contracts.json`, JSON.stringify(blockWithContracts));
    }

    if (possibleErrorInBlock.length > 0) {
        await writeLogFile(`logs/possible-state-root-compare-errors.json`, JSON.stringify(possibleErrorInBlock));
    }

    if (errorInBlock.length > 0) {
        await writeLogFile(`logs/state-root-compare-errors.json`, JSON.stringify(errorInBlock));
    }
}
