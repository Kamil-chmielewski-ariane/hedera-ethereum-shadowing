import { getAllFrontierData } from './getAllFrontierData';
import {
    Client,
    PrivateKey,
    Hbar,
    AccountId,
    AccountCreateTransaction,
} from "@hashgraph/sdk";

type accountType = Record<string, {balance: string}>;

const accountsMapping = getAllFrontierData() // Record<string, {balance: string}>

const node = {"127.0.0.1:50211": new AccountId(3)}

async function createHederaAccount(options : accountType ) {
    const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
    client.setOperator(new AccountId(2), '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137')

    console.log('Creating new account...');

    const newAccount = await new AccountCreateTransaction()
        .setKey(PrivateKey.fromString('302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137'))
        .setInitialBalance(new Hbar(1))
        .execute(client)

    const receipt = await newAccount.getReceipt(client);

    const newAccountId = receipt.accountId;

    console.log('receipt', receipt)

    console.log("The new account ID is " + newAccountId);

    return newAccountId;
}

createHederaAccount(accountsMapping).then((elem) => {
    console.log('createHedera account data', elem);
}).catch((error) => console.log(error));
