import axios from 'axios';

export const axiosInstanceErigon = axios.create({
	baseURL: 'http://localhost:9545/',
	headers: {
		'Content-Type': 'application/json',
	},
});

export const axiosInstanceHederaRpcApi = axios.create({
	baseURL: 'http://localhost:7546/',
	headers: {
		'Content-Type': 'application/json',
	},
});

export const axiosReceiptApi = axios.create({
	baseURL: 'http://localhost:9000/',
	headers: {
		'Content-Type': 'application/json',
	},
})
