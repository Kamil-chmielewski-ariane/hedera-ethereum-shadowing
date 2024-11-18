import shell from 'shelljs';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { TransactionData } from '@/utils/types';

export async function resetNetworkNode(transactionData: TransactionData) {
	await writeLogFile(
		`logs/platform_not_active_error_log.txt`,
		`Error appeared in transaction ${transactionData.txHash}`
	);
	console.log('Resets network node...');
	shell.exec('docker restart network-node');
	await new Promise((resolve) => setTimeout(resolve, 300000));
	console.log('Network node is running');
}
