import { getAllFrontierData, getAllGenesisData, GenesisData } from './getAllFrontierData';
import {
    Client,
    Hbar,
    AccountId,
    TransferTransaction
} from "@hashgraph/sdk";
import dotenv from 'dotenv';
import { Account } from "./types";
import {getTransactionByBlock} from "./getTransactionByBlock";
import {getLastBlockNumber} from "./api/getLastBlockNumber";
import {convertHexIntoDecimal} from "./helpers/convert-hex-into-decimal";
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE

const HARDCODED_NUMBER_OF_BLOCKS = 100000

type accountType = Account;

const accountsMapping = getAllFrontierData()

const node = {"127.0.0.1:50211": new AccountId(3)}
const genesisTransactions = getAllGenesisData();
const client = Client.forNetwork(node).setMirrorNetwork("127.0.0.1:5600");
const accountId = new AccountId(2);

client.setOperator(accountId, OPERATOR_PRIVATE || '')

async function sendHbarToAlias(evmAddress: string, amountHBar: number) {
    try {
        console.log(`Running transaction ${accountId}, ${evmAddress}`);
        const transaction = new TransferTransaction()
            .addHbarTransfer(accountId, new Hbar(-amountHBar))
            .addHbarTransfer(evmAddress, new Hbar(amountHBar));

        // Execute the transaction
        const response = await transaction.execute(client);

        // Get the receipt to confirm the transaction
        const receipt = await response.getReceipt(client);

        console.log("Transaction status:", receipt.status.toString());
    } catch (error) {
        console.error("Error sending HBAR to alias:", error);
    }
}

async function iterateThoughGenesisTransactions(genesisTransactions: GenesisData[]) {
    // for (const transaction of genesisTransactions) {
    //     await sendHbarToAlias(transaction.toAccount, transaction.amount);
    // }
    const lastBlockNumber = await getLastBlockNumber();
    const convertedBlockNumber = convertHexIntoDecimal(lastBlockNumber);

    getTransactionByBlock(convertedBlockNumber);
}

(async () => {
    iterateThoughGenesisTransactions(genesisTransactions);
})();








