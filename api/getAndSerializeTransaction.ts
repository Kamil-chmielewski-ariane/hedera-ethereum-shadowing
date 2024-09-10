import { axiosInstanceErigon} from "./config";

// TODO to type promise response objects
export async function getAndSerializeTransaction(txnHash: string): Promise<any> {

    const response = await axiosInstanceErigon.post('', {
        method: 'eth_getRawTransactionByHash',
        params: [txnHash],
        id: 1,
        jsonrpc: '2.0',
    })

    try {
        return response.data.result;
    } catch (error) {
        throw new Error('Error fetching raw transaction:' + JSON.stringify(error));
    }
};
