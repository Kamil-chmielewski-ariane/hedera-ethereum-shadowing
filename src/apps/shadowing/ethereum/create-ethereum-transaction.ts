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
import { resetHederaLocalNode } from '@/utils/helpers/reset-hedera-local-node';
import { TransactionData } from '@/utils/types';
dotenv.config();

const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

// Create a hedera transaction using a raw transaction Data from Erigon api. More info here
// https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts/ethereum-transaction
export async function createEthereumTransaction(
	transactionData: TransactionData,
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
		console.log(txResponse.toJSON());
		const transactionTimestamp = new Date().toISOString();
		// Sends transaction data to receipt api to check if this transaction is a smart contract
		await sendTransactionInfoToReceiptApi({
			transactionId: txId,
			ethereumTransactionHash: transactionData.txHash,
			hederaTransactionHash: txResponse.toJSON().transactionHash,
			transactionType: 'TRANSFER_TRANSACTION',
			currentBlock: currentBlock,
			evmAddress: accountTo,
			txTimestamp: transactionTimestamp,
		});
		return txResponse.toJSON();
	} catch (error: any) {
		if (error.status && error.status === 'DUPLICATE_TRANSACTION') {
			writeLogFile(
				`logs/create-ethereum-transaction-error`,
				`DUPLICATE TRASNSACTION: \nFound error at transaction ${transactionData.txHash} in block ${currentBlock} Transaction Type: EthereumTransaction \n ${JSON.stringify(error)} \n`,
				true,
				'txt'
			);
			await createEthereumTransaction(
				transactionData,
				accountId,
				client,
				nodeAccountId,
				accountTo,
				currentBlock
			);
		}

		if (
			error &&
			typeof error.message === 'string' &&
			error.message.includes('PLATFORM_NOT_ACTIVE')
		) {
			writeLogFile(
				`logs/send-tiny-bar-to-alias-error.txt`,
				`Found error in block ${currentBlock} Transaction Type: TransferTransaction  \n ${error} \n`,
				true,
				'txt'
			);
			await resetHederaLocalNode();
			await createEthereumTransaction(
				transactionData,
				accountId,
				client,
				nodeAccountId,
				accountTo,
				currentBlock
			);
		} else if (
			error &&
			typeof error.message === 'string' &&
			// TODO Currenty we have platform transaction not created error when we are executing contract transaction on later blocks from 1879240 and later "https://sepolia.etherscan.io/tx/0xd8637b677add1f4a3735259bc1cae4015be7d829e0375b54d217f1d3af6cdcc5"
			error.message.includes('PLATFORM_TRANSACTION_NOT_CREATED')
		) {
			writeLogFile(
				`logs/send-tiny-bar-to-alias-error.txt`,
				`Found error in block ${currentBlock} PLATFORM_TRANSACTION_NOT_CREATED ERROR  \n ${error} \n`,
				true,
				'txt'
			);
			await resetHederaLocalNode();
		}

		writeLogFile(
			`logs/create-ethereum-transaction-error.txt`,
			`Found error at transaction ${transactionData.txHash} in block ${currentBlock} Transaction Type: EthereumTransaction \n ${JSON.stringify(error)} \n`,
			true,
			'txt'
		);
	}
}
