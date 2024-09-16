import { axiosInstanceHedera } from '@/api/config';
import { isAxiosError } from 'axios';

export async function sendRawTransaction(txnHash: string) {
	try {
		const response = await axiosInstanceHedera.post('', {
			method: 'eth_sendRawTransaction',
			params: [txnHash],
			id: 1,
			jsonrpc: '2.0',
		});

		if (response.data && response.data.result) {
			console.log(response.data.result);
			return response.data.result;
		}
	} catch (error) {
		if (isAxiosError(error)) {
			return error.response?.data
		} else {
			throw new Error(
				'Error fetching raw transaction: ' +
					(error instanceof Error ? error.message : String(error))
			);
		}
	}
}
