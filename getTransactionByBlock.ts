import {getTransactionByBlockNumber} from "./api/getTransactionByBlockNumber";
import {getAndSerializeTransaction} from "./api/getAndSerializeTransaction";

export async function getTransactionByBlock(blockNumber: number) {
    try {
        for (let currentBlockNumber = 0; currentBlockNumber < blockNumber; currentBlockNumber++) {
            console.log('currentBlockNumber', currentBlockNumber);
            let result = await getTransactionByBlockNumber(currentBlockNumber.toString(16));
            const transactions: string[] = result.transactions

            if (transactions.length > 1) {
                console.log(`transacion in block ${currentBlockNumber} found...`)
                console.log('preceding iterate through transactions...')
                for (const transactionId of transactions) {
                    console.log(`current element ${transactionId}`)
                    const transactionRawBody = await getAndSerializeTransaction(transactionId)
                    console.log('transactionRawBody', transactionRawBody );
                    // await getRawTransaction(transactionRawBody);
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}
