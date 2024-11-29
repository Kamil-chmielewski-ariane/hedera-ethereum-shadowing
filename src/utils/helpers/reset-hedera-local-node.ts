import shell from 'shelljs';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function resetHederaLocalNode() {
		await writeLogFile(
			`logs/network_node_service_error_log.txt`,
			`network node error appeared`
		);

	console.log('Resets hedera local node...');
	shell.exec('hedera restart RELAY_CHAIN_ID=11155111 -d --dev -a --verbose --detached');
	await new Promise((resolve) => setTimeout(resolve, 300000));
	console.log('hedera is running');
}
