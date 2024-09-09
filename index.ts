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

const accountsMapping = getAllFrontierData() // Record<string, {balance: string}>
const node = {"127.0.0.1:50211": new AccountId(3)}
const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
client.setOperator(new AccountId(2), '302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137')
const txnHash = '0xd825a42771467afad0e22186840a3c64397ac8d60b78e3cf203b14b252b5f272';

createHederaAccount();

fetchAndSerializeTransaction(txnHash).then((data) => {
    console.log("Data " + data);
    sendRawTransaction(data);
});

async function createHederaAccount() {
    for (const key in accountsMapping) {
        console.log(key);
        const newAccount = await new AccountCreateTransaction()
        // .setKey(newAccountPk)
        .setAlias(key)
        .setInitialBalance(new Hbar(parseInt(accountsMapping[key].balance) / 1000000000))
        .execute(client);
    }
}