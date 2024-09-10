import frontier from './frontier.json'
import genesis from './genesis_block_transactions.json'

export class GenesisData {
    toAccount: string;
    amount: number;

    constructor(_toAccount: string, _amount: number) {
        this.toAccount = _toAccount;
        this.amount = _amount;
    }
}

export const getAllFrontierData = () => {
    const accounts: Record<string, { balance: string }> = frontier.alloc
    // for (const key in accounts) {
    //     const balance = accounts[key].balance;
    //     console.log("Key: " + key + " Balance: " + balance)
    // }
    return accounts;
}

export const getAllGenesisData = () => {
    let genesisData = new Array();
    genesis.forEach(element => {
        let genData = new GenesisData(element.to, element.amount);
        genesisData.push(genData);
    });
    return genesisData;
}
