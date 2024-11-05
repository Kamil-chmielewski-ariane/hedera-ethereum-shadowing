import { getRawTransaction } from '@/api/erigon/get-raw-transaction';
import {
	AccountId,
	Client,
	EthereumTransaction,
	Hbar,
	PrivateKey,
	TransactionId,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

export async function createEthereumTransaction(
	transactionData: { txHash: string; gas: number },
	accountId: AccountId,
	client: Client,
	nodeAccountId: AccountId,
	accountTo: string,
	currentBlock: number
): Promise<any> {
	try {
		const rawBody = await getRawTransaction(transactionData.txHash);
		const txId = TransactionId.generate(accountId);
		const transaction = await new EthereumTransaction()
			.setTransactionId(txId)
			.setEthereumData(
				Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex'))
			)
			.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
			.setNodeAccountIds([nodeAccountId])
			.freeze()
			.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)));
		await new Promise((resolve) => setTimeout(resolve, 1));
		const txResponse = await transaction.execute(client);
		console.log(txResponse.toJSON())
		const transactionTimestamp = new Date().toISOString();
		await sendTransactionInfoToReceiptApi({
			transactionId: txId,
			ethereumTransactionHash: null,
			hederaTransactionHash: txResponse.transactionHash,
			transactionType: 'TRANSFER_TRANSACTION',
			currentBlock: currentBlock,
			evmAddress: accountTo,
			txTimestamp: transactionTimestamp,
		});
		return txResponse.toJSON();
	} catch (error: any) {
		if (error.status && error.status === "DUPLICATE_TRANSACTION") {
			await writeLogFile(
				`logs/create-ethereum-transaction-error.txt`,
				`DUPLICATE TRASNSACTION: \nFound error at transaction ${transactionData.txHash} in block ${currentBlock} Transaction Type: EthereumTransaction \n ${JSON.stringify(error)} \n`
			);
			await createEthereumTransaction(transactionData, accountId, client, nodeAccountId, accountTo, currentBlock);
		}
		else {
			await writeLogFile(
				`logs/create-ethereum-transaction-error.txt`,
				`Found error at transaction ${transactionData.txHash} in block ${currentBlock} Transaction Type: EthereumTransaction \n ${JSON.stringify(error)} \n`
			);
		}
		
	}
}
