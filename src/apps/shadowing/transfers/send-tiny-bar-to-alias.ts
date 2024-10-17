import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function sendTinyBarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number,
	client: Client,
	iterator: number = 0
) {
	if (iterator < 10) {
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
			await new Promise((resolve) => setTimeout(resolve, 5000));
			await writeLogFile(
				'logs/errors-sending-tiny-hbar-attempt.txt',
				`Error attempt ${iterator} for sending tiny HBAR to user ${evmAddress} \n ${error} \n`
			);
			console.error('Error sending tinyBar to alias:', error);
			await sendTinyBarToAlias(
				accountId,
				evmAddress,
				amountHBar,
				client,
				iterator + 1
			);
		}
	} else {
		await writeLogFile(
			'logs/errors-sending-tiny-hbar.txt',
			`There was an error for sending tiny HBAR for user ${evmAddress} \n`
		);
	}
}
