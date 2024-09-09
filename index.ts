import { fetchAndSerializeTransaction, sendRawTransaction } from './fetchAndSerializeTransaction';
import { getAllFrontierData } from './getAllFrontierData';
import { createWalletClient, http } from "viem";
import { hederaLocalnet } from './hedera-localnet';
import {
    Client,
    PrivateKey,
    Hbar,
    AccountId,
    AccountCreateTransaction,
    PublicKey
} from "@hashgraph/sdk";

const viem = createWalletClient({
    chain: hederaLocalnet,
    transport: http()
});

type HederaAccount = {
    accountId: string;
    publicKey: string;
    privateKey: string;
    ethAddress: string;
};

type accountType = Record<string, {balance: string}>;

const accountsMapping = getAllFrontierData() // Record<string, {balance: string}>

const node = {"127.0.0.1:50211": new AccountId(3)}
const txnHash = '0xd825a42771467afad0e22186840a3c64397ac8d60b78e3cf203b14b252b5f272';

// fetchAndSerializeTransaction(txnHash).then((data) => {
//     console.log(`fetched transaction data ${data}`);
//     // sendRawTransaction(data);
// });

async function createHederaAccount(options : accountType ) {
    const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
    client.setOperator('0.0.1002', '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137')

    console.log('crearing new account...');

    const newAccount = await new AccountCreateTransaction()
        .setAlias('3282791d6fd713f1e94f4bfd565eaa78b3a0599d')
        .setInitialBalance(new Hbar(parseInt('1337000000000000000000') / 1000000000))
        .execute(client);

    console.log('newAccount', newAccount);

    // for (const accountId in options) {
    //     console.log(`Creating account for ${accountId} `)
    //     const newAccount = new AccountCreateTransaction()
    //     .setAlias(accountId)
    //     .setInitialBalance(new Hbar(parseInt(accountsMapping[accountId].balance) / 1000000000))
    //     .execute(client);
    //
    //     newAccount.then((data) => {
    //         console.log(`data for ${accountId} ${data}`);
    //     }).catch(err => console.log(err));
    // }
}

createHederaAccount(accountsMapping);
