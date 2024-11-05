import { TransactionId } from '@hashgraph/sdk';
import { axiosReceiptApi } from '../config';
import { isAxiosError } from 'axios';

interface ReceiptData {
	transactionId: string | TransactionId,
	evmAddress: string,
	currentBlock: number,
	transactionType: string,
	txTimestamp: string
}

export async function sendTransactionInfoToReceiptApi(receiptData: ReceiptData) {
	try {
		const response = await axiosReceiptApi.post('/check-transaction', {
			transactionId: receiptData.transactionId.toString(),
			type: receiptData.transactionType,
			blockNumber: receiptData.currentBlock,
			addressTo: receiptData.evmAddress,
			txTimestamp: receiptData.txTimestamp,
			currentTimestamp: new Date().toISOString(),
		});

		if (response.data === 'OK') {
			console.log('Transaction was send successfully')
		}
	} catch (error) {
		// handle unknown type and check if axios error
		if (isAxiosError(error)) {
			console.error('Error fetching raw transaction:', error.response?.data);
			throw new Error(
				'Error fetching raw transaction: ' +
					JSON.stringify(error.response?.data)
			);
		} else {
			// if error not axios error, use generic error
			console.error('Unknown error:', error);
			throw new Error(
				'Error fetching raw transaction: ' +
					(error instanceof Error ? error.message : String(error))
			);
		}
	}
}
