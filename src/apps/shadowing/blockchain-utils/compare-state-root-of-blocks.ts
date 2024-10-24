import { getStorageAt } from "@/api/erigon/get-storage-at";
import { getHederaContractStates } from "@/apps/shadowing/hedera/get-hedera-contract-states";
import { writeLogFile } from "@/utils/helpers/write-log-file";
import { convertHexIntoDecimal } from '@/utils/helpers/convert-hex-into-decimal';

export async function compareStateForContractsInBlock(block: any, transactions: any) {
    const blockNumberDex = convertHexIntoDecimal(block.number)
    const transactionsInBlock = []
    const contractsInBlock = []
    const errorInBlock = [];
    for (const transaction of transactions) {
        if (transaction && transaction.hash && transaction.to) {
            const possibleTransactionAddress = transaction.to;
            console.log(possibleTransactionAddress);
            const hederaStates = await getHederaContractStates(possibleTransactionAddress);

            if (hederaStates.length > 0) {
                contractsInBlock.push(transaction.to)
            } else {
                transactionsInBlock.push(transaction.hash)
            }

            for (const hederaState of hederaStates) {
                const sepoliaStateValue = await getStorageAt(possibleTransactionAddress, hederaState.slot, block.number);
                if (sepoliaStateValue != hederaState.value) {
                    const dataError = {
                        "blockNumber": blockNumberDex,
                        "transactionHash": transaction.hash,
                        "contractAddress": possibleTransactionAddress,
                        "searchedSlot": hederaState.slot,
                        "hederaValue": hederaState.value,
                        "ethereumValue": sepoliaStateValue
                    }
                    errorInBlock.push(dataError);
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

    if (errorInBlock.length > 0) {
        await writeLogFile(`logs/state-root-compare-errors.json`, JSON.stringify(errorInBlock));
        throw new Error(
            'Error for state root blocks '
        );
    }
}
