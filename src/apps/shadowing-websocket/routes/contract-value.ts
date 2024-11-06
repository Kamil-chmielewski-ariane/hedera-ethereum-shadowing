import { Router, Request, Response } from 'express';
import { WebSocketServer } from 'ws';
import { TransactionStatusResponse } from '@/utils/types';

const contractValueRouter = (wss: WebSocketServer) => {
	const router = Router();

	router.post('/', (req: Request<TransactionStatusResponse>, res: Response) => {
		console.log('reqBody', req.body);

		const contractData = {
			transactionId: req.body.transactionPayload.transactionId,
			type: req.body.transactionPayload.type,
			blockNumber: req.body.transactionPayload.blockNumber,
			addressTo: req.body.transactionPayload.addressTo,
			txTimestamp: req.body.transactionPayload.txTimestamp,
			timestamp: req.body.transactionPayload.timestamp,
			currentTimestamp: req.body.transactionPayload.currentTimestamp,
			hederaTransactionHash: req.body.transactionPayload.hederaTransactionHash,
			ethereumTransactionHash:
				req.body.transactionPayload.ethereumTransactionHash,
			transactionStatus: req.body.transactionPayload.transactionStatus,
			status: req.body.status,
			error: req.body.error,
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
