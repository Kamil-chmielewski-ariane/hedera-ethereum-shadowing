import frontier from './frontier.json'

export const getAllFrontierData = () => {
    const accounts: Record<string, { balance: string }> = frontier.alloc
    for (const key in accounts) {
        const balance = accounts[key].balance;
        console.log(`Address: ${key}, Balance: ${balance}`);
    }
}
