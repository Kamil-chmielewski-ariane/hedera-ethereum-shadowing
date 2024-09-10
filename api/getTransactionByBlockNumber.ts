import {axiosInstanceErigon} from "./config";

export async function getTransactionByBlockNumber (blockNumber: string): Promise<any> {
    const response = await axiosInstanceErigon.post('', {
        method: 'eth_getBlockByNumber',
        params: ['0x' + blockNumber, false],
        id: 1,
        jsonrpc: '2.0',
    })

    try {
        return response.data.result;
    } catch (error) {
        throw new Error('Error fetching raw transaction:' + JSON.stringify(error));
    }
}