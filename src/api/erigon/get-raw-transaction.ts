import { axiosInstanceErigon } from '@/api/config';
import {isAxiosError} from 'axios';

// TODO to type promise response objects
export async function getRawTransaction(txnHash: string): Promise<any> {
	try {
		const response = await axiosInstanceErigon.post('', {
			method: 'eth_getRawTransactionByHash',
			params: [txnHash],
			id: 1,
			jsonrpc: '2.0',
		});

		if (response.data && response.data.result) {
			console.log(response.data.result);
			return response.data.result;
		} else {
			throw new Error('No result found in response');
		}
	} catch (error) {
		// Teraz obsługujemy typ unknown i sprawdzamy, czy error to AxiosError
		if (isAxiosError(error)) {
			console.error('Error fetching raw transaction:', error.response?.data);
			throw new Error('Error fetching raw transaction: ' + JSON.stringify(error.response?.data));
		} else {
			// Jeżeli error to nie AxiosError, używamy generycznego błędu
			console.error('Unknown error:', error);
			throw new Error('Error fetching raw transaction: ' + (error instanceof Error ? error.message : String(error)));
		}
	}
}