import { axiosInstance } from './axios-config';

export const fetchAndSerializeTransaction = async (txnHash: string) => {

    const response = await axiosInstance.post('', {
        method: 'eth_getRawTransactionByHash',
        params: [txnHash],
        id: 1,
        jsonrpc: '2.0',
    })

    try {
        console.log('Raw transaction hex:', response.data.result);
    } catch (error) {
        console.error('Error fetching raw transaction:', error);
    }
};
