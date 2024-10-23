import { axiosInstanceErigon } from '@/api/config';
import { isAxiosError } from 'axios';

export async function getUncleByBlockNumberAndIndex(
	blockNumber: string,
    index: string
): Promise<any> {
	try {
		const response = await axiosInstanceErigon.post('', {
			method: 'eth_getUncleByBlockNumberAndIndex',
			params: ['0x' + blockNumber, '0x' + index],
			id: 1,
			jsonrpc: '2.0',
		});

		if (response.data && response.data.result) {
			return response.data.result;
		}
	} catch (error) {
		if (isAxiosError(error)) {
			console.error('Error fetching raw transaction:', error.response?.data);
            return undefined;
		} else {
			// if error not axios error, use generic error
			console.error('Unknown error:', error);
            return undefined;
		}
	}
}