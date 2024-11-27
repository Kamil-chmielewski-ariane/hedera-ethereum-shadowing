import shell from 'shelljs';
import { writeLogFile } from '@/utils/helpers/write-log-file';

export async function resetHederaLocalNode() {
		await writeLogFile(
			`logs/platform_not_active_error_log.txt`,
			`PLATFORM_NOT_ACTIVE Error appeared`
		);

	console.log('Resets network node...');
	shell.exec('hedera restart RELAY_CHAIN_ID=11155111 -d --dev -a --verbose --detached');
	await new Promise((resolve) => setTimeout(resolve, 300000));
	console.log('Network node is running');
}
