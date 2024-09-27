import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';

export async function sendTinyBarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number,
	client: Client
) {
	try {
		console.log(`Running tinybar transaction ${accountId}, ${evmAddress}`);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, Hbar.fromTinybars(amountHBar).negated())
			.addHbarTransfer(evmAddress, Hbar.fromTinybars(amountHBar));

		// Execute the transaction
		const response = await transaction.execute(client);

		// Get the receipt to confirm the transaction
		const receipt = await response.getReceipt(client);
		console.log('Transaction status:', receipt.status.toString());
	} catch (error) {
		console.error('Error sending tinyBar to alias:', error);
	}
}
