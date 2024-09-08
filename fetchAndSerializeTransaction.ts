import { axiosInstance, axiosInstanceHedera } from './axios-config';

export const fetchAndSerializeTransaction = async (txnHash: string): Promise<any> => {

    const response = await axiosInstance.post('', {
        method: 'eth_getRawTransactionByHash',
        params: [txnHash],
        id: 1,
        jsonrpc: '2.0',
    })

    try {
        console.log('Raw transaction hex:' + response.data.result + '\n');
        return response.data.result;
    } catch (error) {
        console.error('Error fetching raw transaction:', error);
        throw new Error('Error fetching raw transaction:' + JSON.stringify(error));
    }
};

export const sendRawTransaction = async (txnHash: string) => {

    const response = await axiosInstanceHedera.post('', {
        method: 'eth_sendRawTransaction',
        params: [txnHash],
        id: 1,
        jsonrpc: '2.0',
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        }
        else {
            console.log(error.message);
        }
    });

    try {
        console.log('Raw transaction hex:', response);
    } catch (error) {
        console.error('Error fetching raw transaction:', error);
    }
};
