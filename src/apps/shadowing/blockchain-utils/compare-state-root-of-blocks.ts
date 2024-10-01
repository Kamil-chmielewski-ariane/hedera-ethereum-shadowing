import { getStorageAt } from "@/api/erigon/get-storage-at";
import { getHederaContractStates } from "@/apps/shadowing/hedera/get-hedera-contract-states";
import fs from "fs";

export async function compareStateForContractsInBlock(blockNumber: any, transactions: any) {
    const errorInBlock = [];
    for (const transaction of transactions) {
        if (transaction && transaction.hash && transaction.to) {
            const possibleTransactionAddress = transaction.to;
            const hederaStates = await getHederaContractStates(possibleTransactionAddress);
            for (const hederaState of hederaStates) {
                const sepoliaStateValue = await getStorageAt(possibleTransactionAddress, hederaState.slot, blockNumber);
                if (sepoliaStateValue != hederaState.value) {
                    const data = {
                        "blockNumber": blockNumber,
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
    await writeLogFileForBlock(errorInBlock, Number(blockNumber));
}

async function writeLogFileForBlock(data: any, blockNumber: any) {
    const jsonData = JSON.stringify(data)
    fs.writeFile(`logs/${blockNumber}.json`, jsonData, 'utf-8', (err) => {
        if (err) {  console.error(err);  return; }
    });
}
