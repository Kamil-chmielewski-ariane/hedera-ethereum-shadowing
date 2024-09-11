import {Genesis} from '@/utils/types';
import {getLastBlockNumber} from '@/api/get-last-block-number';
import {convertHexIntoDecimal} from '@/utils/helpers/convert-hex-into-decimal';

export async function iterateThoughGenesisTransactions(
    genesisTransactions: Genesis[]
) {
    // for (const transaction of genesisTransactions) {
    //     await sendHbarToAlias(transaction.toAccount, transaction.amount);
    // }
    const lastBlockNumber = await getLastBlockNumber();
    const convertedBlockNumber = convertHexIntoDecimal(lastBlockNumber);

    // getTransactionByBlock(5966638, convertedBlockNumber);
}
