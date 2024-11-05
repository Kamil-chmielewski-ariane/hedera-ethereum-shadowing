import { TransactionId } from '@hashgraph/sdk';
import { axiosReceiptApi } from '../config';
import { isAxiosError } from 'axios';
import { TransactionType } from '@/utils/types';

interface TransactionReceiptPayload {
	transactionId: TransactionId;
	evmAddress: string;
	currentBlock: number;
	transactionType: TransactionType;
	txTimestamp?: string;
	ethereumTransactionHash: string | null;
	hederaTransactionHash: string | Uint8Array;
}

export async function sendTransactionInfoToReceiptApi(
	transactionReceiptApi: TransactionReceiptPayload
) {
	try {
		const response = await axiosReceiptApi.post('/check-transaction', {
			transactionId: transactionReceiptApi.transactionId.toString(),
			ethereumTransactionHash: transactionReceiptApi.ethereumTransactionHash,
			hederaTransactionHash: transactionReceiptApi.hederaTransactionHash,
			blockNumber: transactionReceiptApi.currentBlock,
			addressTo: transactionReceiptApi.evmAddress,
			type: transactionReceiptApi.transactionType,
			txTimestamp: transactionReceiptApi.txTimestamp,
			currentTimestamp: new Date().toISOString(),
		});

		if (response.data === 'OK') {
			console.log('Transaction was send successfully');
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
