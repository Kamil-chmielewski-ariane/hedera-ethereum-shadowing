import {getRawTransaction} from '@/api/get-raw-transaction';
import {sendHbarToAlias} from '@/apps/shadowing/send-hbar-to-alias';
import {AccountId, Client, EthereumTransaction, Hbar, PrivateKey, TransactionId} from '@hashgraph/sdk';

//This function should add a new ethereum transaction but on the hedera exploler should display WRONG_CHAIN_ID
export async function sendTransactionAsEthereum(accountId: AccountId, client: Client, ppkey: string) {
    const rawBody = await getRawTransaction(
        '0xda17f66e764bbe84f2d71b5544c9733f3b4a48d49e3226a98e955747ba0b7060'
    );
    await sendHbarToAlias(accountId, '0xa9DE2a4904DDcEc6f969784FbAd36a0b7fe0f2Cd', 200, client);
    const txId = TransactionId.generate(accountId);
    const transaction = await new EthereumTransaction()
        .setTransactionId(txId)
        .setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
        .setMaxGasAllowanceHbar(new Hbar(100))
        .freezeWith(client)
        .sign(PrivateKey.fromString(String(ppkey)));

    const txResponse = await transaction.execute(client);

    console.log('txResponse', JSON.stringify(txResponse));
}
