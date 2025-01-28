import axios from 'axios';

export async function getAccount(evmAddress: string) {
	const url = `http://localhost:5551/api/v1/accounts/${evmAddress}`;

	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		return false;
	}
}
