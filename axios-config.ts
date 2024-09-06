import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8545/',
    headers: {
        'Content-Type': 'application/json',
    },
})
