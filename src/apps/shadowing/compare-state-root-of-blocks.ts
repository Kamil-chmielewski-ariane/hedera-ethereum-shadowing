import { getBlockByHashHedera } from "@/api/get-block-by-hash";
import { getTransaction } from "@/api/get-transaction";
import { appendFile } from "fs";

export async function compareStateRootOfBlocks(erigonBlock: any, lastTransactionHashInBlock: any) {
    const hederaTransaction = await getTransaction(lastTransactionHashInBlock);
    if (hederaTransaction && hederaTransaction.blockHash) {
        const hederaBlock = await getBlockByHashHedera(hederaTransaction.blockHash);
        if (hederaBlock && hederaBlock.stateRoot && erigonBlock.stateRoot) {
            if (hederaBlock.stateRoot == erigonBlock.stateRoot) {
                console.log(`\n\nHedera block ${hederaBlock.number} and erigon block ${erigonBlock.number} have the same state root\n\n`)
            }
            else {
                appendFile("logs.txt", `Hedera block ${hederaBlock.number} and erigon block ${erigonBlock.number} do not have the same state root\n`, function (err) {
                    console.log(err);
                })
                console.log(`\n\nHedera block ${hederaBlock.number} and erigon block ${erigonBlock.number} do not have the same state root\n\n`);
            }
        }
    }
}