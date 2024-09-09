import { getAllFrontierData } from './getAllFrontierData';
import {
    Client,
    PrivateKey,
    Hbar,
    AccountId,
    AccountCreateTransaction,
} from "@hashgraph/sdk";
import {base32} from 'rfc4648';

type accountType = Record<string, {balance: string}>;

const accountsMapping = getAllFrontierData() // Record<string, {balance: string}>

const node = {"127.0.0.1:50211": new AccountId(3)}

async function createHederaAccount(accounts : accountType ) {
    

    const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
    client.setOperator(new AccountId(2), '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137')

    console.log('Creating new account...');
    for (const key in accounts) {
        const balance = accounts[key].balance;
        const privateKey = PrivateKey.generateECDSA();
        const longAccountId = await transformPublicKeyToAccountId(key)
        const signTransaction = await new AccountCreateTransaction()
            .setKey(privateKey)
            .setAlias(longAccountId)
            .setInitialBalance(new Hbar(parseInt(balance) / 1000000000000))
            .freezeWith(client)
            .sign(PrivateKey.fromString('302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137'));
        const newAccount = await signTransaction.execute(client);
        
        const receipt = await newAccount.getReceipt(client);
        const newAccountId = receipt.accountId;

        console.log('receipt', receipt);

        console.log("The new account ID is " + newAccountId);
    }
}

createHederaAccount(accountsMapping).then((elem) => {
    console.log('createHedera account data', elem);
}).catch((error) => console.log(error));

async function transformPublicKeyToAccountId(key: string) {
    const protoBufPrefix = `1220`;
    const bufferRaw = Buffer.from(`${protoBufPrefix}${key}`, 'hex');
    return '0.0.' + base32.stringify(bufferRaw, { pad: false });
}
