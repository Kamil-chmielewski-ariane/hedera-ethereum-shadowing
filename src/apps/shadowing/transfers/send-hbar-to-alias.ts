import { AccountId, Client, Hbar, TransferTransaction } from '@hashgraph/sdk';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function sendHbarToAlias(
	accountId: AccountId,
	evmAddress: string,
	amountHBar: number | Hbar,
	client: Client,
	iterator: number = 0
) {
	//interval
	setTimeout(async () => {
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
					`Error attempt ${iterator} for sending HBAR to user ${evmAddress} \n ${error}`
				);
				console.error('Error sending HBAR to alias:', error);
				await sendHbarToAlias(
					accountId,
					evmAddress,
					amountHBar,
					client,
					iterator + 1
				);
			}
		} else {
			await writeLogFile('/logs/errors-sending-hbar.txt', `There was an error for sending HBAR for user ${evmAddress}`);
		}
	}, 5000);
}
