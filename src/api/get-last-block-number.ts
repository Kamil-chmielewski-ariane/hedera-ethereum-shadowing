import { axiosInstanceErigon } from '@/api/config';

export async function getLastBlockNumber(): Promise<any> {
	const response = await axiosInstanceErigon.post('', {
		method: 'eth_blockNumber',
		params: [],
		id: 1,
		jsonrpc: '2.0',
	});

	try {
		return response.data.result;
	} catch (error) {
		throw new Error('Error fetching raw transaction:' + JSON.stringify(error));
	}
}
