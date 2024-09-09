import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8545/',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const axiosInstanceHedera = axios.create({
    baseURL: 'http://localhost:7546/',
    headers: {
        'Content-Type': 'application/json',
    },
})
