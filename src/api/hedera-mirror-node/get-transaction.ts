import axios, { isAxiosError } from 'axios';

export async function getTransaction(transactionId: string): Promise<any> {
	const url = `http://localhost:5551/api/v1/transactions/${transactionId}`

	try {
		const response = await axios.get(url)

		if (response.data) {
			return response.data.transactions[0];
		} else {
			throw new Error('No result found in response');
		}

	} catch (error) {
		if (isAxiosError(error)) {
			console.error('Error fetching transaction:', JSON.stringify(error));
		} else {
			// if error not axios error, use generic error
			console.error('Unknown error:', error);
		}
	}
}
