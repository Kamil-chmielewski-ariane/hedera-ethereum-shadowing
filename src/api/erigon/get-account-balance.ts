import {axiosInstanceErigon} from '@/api/config';
import {isAxiosError} from 'axios';

export async function getAccountBalance(address: string, blockNumber: string) {
    try {
        const response = await axiosInstanceErigon.post('', {
            method: 'eth_getBalance',
            params: [address, `0x${blockNumber}`],
            id: 1,
            jsonrpc: '2.0',
        })

        if (response.data && response.data.result) {
            return response.data.result
        }
    }catch (error) {
        if (isAxiosError(error)) {
            throw new Error(
                'Error fetching raw transaction: ' +
                JSON.stringify(error.response?.data)
            );
        } else {
            console.error('Unknown error:', error);
            throw new Error(
                'Error fetching raw transaction: ' +
                (error instanceof Error ? error.message : String(error))
            );
        }
    }
}
