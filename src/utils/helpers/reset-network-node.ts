import shell from 'shelljs';

export async function resetNetworkNode() {
	console.log('Resets network node...');
	shell.exec('docker restart network-node');
	await new Promise((resolve) => setTimeout(resolve, 300000));
	console.log('Network node is running');
}
