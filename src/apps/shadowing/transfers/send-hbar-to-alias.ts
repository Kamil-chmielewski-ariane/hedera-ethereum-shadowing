import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function sendHbarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number | Hbar,
	client: Client,
	currentBlock: number,
	iterator: number = 0
) {
	if (iterator < 10) {
		try {
			console.log(`Running transaction ${accountId}, ${evmAddress}`);
			const transaction = new TransferTransaction()
				.addHbarTransfer(accountId, new Hbar(amountHBar).negated())
				.addHbarTransfer(evmAddress, new Hbar(amountHBar));

			// Execute the transaction
			const response = await transaction.execute(client);

			// Get the receipt to confirm the transaction
			const receipt = await response.getReceipt(client);

			console.log('Transaction status:', receipt.status.toString());
		} catch (error) {
			await writeLogFile(
				'logs/errors-sending-hbar-attempt.txt',
				`Error attempt ${iterator} for sending HBAR to user ${evmAddress} for block ${currentBlock} \n ${error} \n`
			);
			console.error('Error sending HBAR to alias:', error);
			await new Promise(resolve => setTimeout(resolve, 5000));
			await sendHbarToAlias(
				accountId,
				evmAddress,
				amountHBar,
				client,
				currentBlock,
				iterator + 1
			);
		}
	} else {
		await writeLogFile('logs/errors-sending-hbar.txt', `There was an error for sending HBAR for user ${evmAddress} in block ${currentBlock} Reason: More than 10 attempts \n`);
	}
}
