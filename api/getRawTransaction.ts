import { axiosInstanceErigon, axiosInstanceHedera } from './config';
export async function getRawTransaction (txnHash: string) {

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
