import { getStorageAt } from "@/api/erigon/get-storage-at";
import { getHederaContractStates } from "@/apps/shadowing/hedera/get-hedera-contract-states";
import { writeLogFile } from "@/utils/helpers/write-log-file";

export async function compareStateForContractsInBlock(blockNumber: any, transactions: any) {
    const blocksWithTransacitons = []
    const errorInBlock = [];
    for (const transaction of transactions) {
        if (transaction && transaction.hash && transaction.to) {
            const possibleTransactionAddress = transaction.to;
            console.log(possibleTransactionAddress);
            const hederaStates = await getHederaContractStates(possibleTransactionAddress);
            console.log(hederaStates);
            for (const hederaState of hederaStates) {
                const sepoliaStateValue = await getStorageAt(possibleTransactionAddress, hederaState.slot, blockNumber);
                if (sepoliaStateValue != hederaState.value) {
                    const dataError = {
                        "blockNumber": blockNumber,
                        "transactionHash": transaction.hash,
                        "contractAddress": possibleTransactionAddress,
                        "searchedSlot": hederaState.slot,
                        "hederaValue": hederaState.value,
                        "ethereumValue": sepoliaStateValue
                    }
                    errorInBlock.push(dataError);
                }
            }
            const dataTransactions = {
                "blockNumber": blockNumber,
                "transactionHash": transaction.hash
            }
            blocksWithTransacitons.push(dataTransactions);
        }
    }
    await writeLogFile(`logs/blocks-with-transactions.json`, JSON.stringify(blocksWithTransacitons));
    await writeLogFile(`logs/state-root-compare.json`, JSON.stringify(errorInBlock));
}