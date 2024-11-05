import { Router, Request, Response } from 'express';
import { WebSocketServer } from 'ws';
import { ContractType } from '@/utils/types';

const contractValueRouter = (wss: WebSocketServer) => {
	const router = Router();

	router.post('/', (req: Request<ContractType>, res: Response) => {
		const contractData = {
			transactionId: req.body.transactionId,
			type: req.body.type,
			blockNumber: req.body.blockNumber,
			addressTo: req.body.addressTo,
			txTimestamp: req.body.txTimestamp,
			timestamp: req.body.timestamp,
			currentTimestamp: req.body.currentTimestamp,
			hederaTransactionHash: req.body.hederaTransactionHash,
			ethereumTransactionHash: req.body.ethereumTransactionHash,
		};

		wss.clients.forEach((client) => {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify(contractData));
			}
		});

		res.status(201).json('Data was send successfully');
	});

	return router;
};

export default contractValueRouter;
