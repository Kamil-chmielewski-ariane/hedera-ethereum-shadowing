import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';

export async function sendHbarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number,
	client: Client
) {
	try {
		console.log(`Running transaction ${accountId}, ${evmAddress}`);
		const transaction = new TransferTransaction()
			.addHbarTransfer(accountId, new Hbar(-amountHBar))
			.addHbarTransfer(evmAddress, new Hbar(amountHBar));

		// Execute the transaction
		const response = await transaction.execute(client);

		// Get the receipt to confirm the transaction
		const receipt = await response.getReceipt(client);

		console.log('Transaction status:', receipt.status.toString());
	} catch (error) {
		console.error('Error sending HBAR to alias:', error);
	}
}
