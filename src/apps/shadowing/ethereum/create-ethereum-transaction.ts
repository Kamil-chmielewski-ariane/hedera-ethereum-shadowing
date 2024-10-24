import { getRawTransaction } from '@/api/erigon/get-raw-transaction';
import { sendTransactionInfoToReceiptApi } from '@/api/receipt/transaction-sender';
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
import { getTransactionByHash } from '@/api/erigon/get-transaction-by-hash';
import { getHederaContractStates } from '../hedera/get-hedera-contract-states';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

export async function createEthereumTransaction(
	transactionData: { txHash: string; gas: number },
	accountId: AccountId,
	client: Client,
	nodeAccountId: AccountId,
	accountTo: string,
	currentBlock: number
) {
	try {
		const rawBody = await getRawTransaction(transactionData.txHash);
		const txBody = await getTransactionByHash(transactionData.txHash);
		const txId = TransactionId.generate(accountId);
		const transaction = await new EthereumTransaction()
			.setTransactionId(txId)
			.setEthereumData(Uint8Array.from(Buffer.from(rawBody.substring(2), 'hex')))
			.setMaxGasAllowanceHbar(new Hbar(transactionData.gas))
			.setNodeAccountIds([nodeAccountId])
			.freeze()
			.sign(PrivateKey.fromString(String(OPERATOR_PRIVATE)));
		await new Promise(resolve => setTimeout(resolve, 1));
		const txResponse = await transaction.execute(client);
		const txTimestamp = new Date().toISOString();
		
		if (txBody && txBody.to) {
			const hederaStates = await getHederaContractStates(txBody.to);
			if (hederaStates && hederaStates.length > 0) {
				const receipt = await txResponse.getReceipt(client);
				await writeLogFile('logs/receipt-for-contract-transactions.txt', `Transaction hash ${transactionData.txHash} in block ${currentBlock} \n ${JSON.stringify(receipt)} \n`);
			}
		}
		

		console.log('txResponse', txResponse.toJSON());
		// TODO: uncomment when receipt API is ready
		// sendTransactionInfoToReceiptApi(txId, accountTo, currentBlock, "ETHEREUM_TRANSACTION", txTimestamp);
	} catch (error) {
		await writeLogFile(`logs/create-ethereum-transaction-error.txt`, `Found error at transaction ${transactionData.txHash} in block ${currentBlock} Transaction Type: EthereumTransaction \n ${JSON.stringify(error)} \n`);
	}
}
