export type TransactionType = 'TRANSFER' | 'TRANSFER_TRANSACTION';

export type Genesis = {
	toAccount: string;
	amount: number;
};

export interface StateData {
	slot: string;
	value: string;
	timestamp: string;
	address: string;
}

export interface ContractType {
	transactionId: string;
	type: string;
	blockNumber: number;
	addressTo: string;
	txTimestamp: string;
	currentTimestamp: string;
	ethereumTransactionHash: string | null;
	hederaTransactionHash: string;
	transactionStatus: string;
}

export interface TransactionStatusResponse {
	transactionPayload: ContractType;
	status: string;
	error: string;
}
