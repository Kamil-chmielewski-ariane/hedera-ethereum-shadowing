import {Client, AccountId, TransactionId, EthereumTransaction, Hbar} from '@hashgraph/sdk';
import dotenv from 'dotenv';
dotenv.config();
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE;

const HARDCODED_NUMBER_OF_BLOCKS = 100000;
const HARDCODED_BLOCK_NUMBER_WITH_TRANSACTIONS = 5966639;
const HARDCODED_RAW_BODY = '0xf86b048503ff9aca0782520f94e64fac7f3df5ab44333ad3d3eb3fb68be43f2e8c830fffff808401546d71a026cf0758fda122862a4de71a82a3210ef7c172ee13eae42997f5d32b747ec78ca03587c5c2eee373b1e45693544edcde8dde883d2be3e211b3f0f3c840d6389c8a';

const node = { '127.0.0.1:50211': new AccountId(3) };
const client = Client.forNetwork(node).setMirrorNetwork('127.0.0.1:5600');
const accountId = new AccountId(2);
client.setOperator(accountId, OPERATOR_PRIVATE || '');

(async () => {

	const txId = TransactionId.generate(accountId);
	const transaction = new EthereumTransaction()
		.setTransactionId(txId)
		.setEthereumData(Uint8Array.from(Buffer.from(HARDCODED_RAW_BODY.substring(2), 'hex')))
		.setMaxGasAllowanceHbar(new Hbar(100))
		.freezeWith(client)

	const txResponse = await transaction.execute(client);

	console.log('txResponse', txResponse.toJSON());
})();
