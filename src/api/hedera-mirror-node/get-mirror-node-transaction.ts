import axios, { isAxiosError } from 'axios';

export async function getMirrorNodeTransaction(
	hederaTransactionHash: string,
): Promise<any> {

	if (hederaTransactionHash === undefined) {
		const date = new Date();
		const unixTimestamp = Math.floor(date.getTime() / 1000);

		return {
			consensus_timestamp: unixTimestamp,
		};
	}

	const url = `http://localhost:5551/api/v1/transactions/${hederaTransactionHash}`;

	try {
		const response = await axios.get(url);
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
