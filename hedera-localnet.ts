import {defineChain} from "viem";

export const hederaLocalnet = defineChain({
    id: 298,
    name: 'Hedera Localnet',
    nativeCurrency: {
        symbol: 'HBAR',
        name: 'HBAR',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['http://localhost:7546'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Hashscan',
            url: 'https://hashscan.io/testnet',
        },
    },
})