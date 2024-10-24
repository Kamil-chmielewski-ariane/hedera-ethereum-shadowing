import { TransactionId } from '@hashgraph/sdk';
import { axiosReceiptApi } from '../config';
import { isAxiosError } from 'axios';
export async function sendTransactionInfoToReceiptApi(
	transactionId: TransactionId,
	evmAddress: string,
	currentBlock: number,
	transactionType: string,
	txTimestamp: string
) {
	try {
        const response = await axiosReceiptApi.post('', {
			transactionId: transactionId.toString(),
			blockNumber: currentBlock,
			addressTo: evmAddress,
			type: transactionType,
			txTimestamp: txTimestamp,
			currentTimestamp: new Date().toISOString()
		});

		if (response.data && response.data.result) {
			console.log(response.data.result);
			return response.data.result;
		} else {
			throw new Error('No result found in response');
		}
	} catch (error) {
		// handle unknown type and check if axios error
		if (isAxiosError(error)) {
			console.error('Error fetching raw transaction:', error.response?.data);
			throw new Error('Error fetching raw transaction: ' + JSON.stringify(error.response?.data));
		} else {
			// if error not axios error, use generic error
			console.error('Unknown error:', error);
			throw new Error('Error fetching raw transaction: ' + (error instanceof Error ? error.message : String(error)));
		}
	}
}