import { Router, Request, Response } from 'express';
import { WebSocketServer } from 'ws';

const contractValueRouter = (wss: WebSocketServer) => {
	const router = Router();

	router.post('/', (req: Request, res: Response) => {
		const message = JSON.stringify(req.body);

		wss.clients.forEach(client => {
			if (client.readyState === client.OPEN) {
				client.send(message);
			}
		});

		res.status(201).json('Data was send to websocket');
	});

	return router;
};

export default contractValueRouter;
