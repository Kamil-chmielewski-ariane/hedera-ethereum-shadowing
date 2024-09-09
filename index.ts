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
        .setAlias(`0x3282791d6fd713f1e94f4bfd565eaa78b3a0599d`)
        .setInitialBalance(new Hbar(parseInt('1337000000000000000000') / 1000000000))
        .execute(client)

    const receipt = await newAccount.getReceipt(client);

    const newAccountId = receipt.accountId;

    console.log("The new account ID is " + newAccountId);

    return newAccountId;
}

createHederaAccount(accountsMapping).then((elem) => {
    console.log('createHedera account data', elem);
}).catch((error) => console.log(error));
