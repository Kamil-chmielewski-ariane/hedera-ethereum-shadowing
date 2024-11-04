import express from 'express'
import contractValue from './routes/contract-value';
import { WebSocket, WebSocketServer } from 'ws';
const port = 8080;

const wss = new WebSocketServer({ port: port });

const app = express();
app.use(express.json());
app.use('/contract-value', contractValue(wss) )

wss.on('connection', (ws: WebSocket) => {
	ws.on('error', console.error)

	ws.on('message', (message) => {
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(	`CONNECTION SUCESS', ${message.toString()}`);
			}
		})
	})

	ws.on('close', () => {
		wss.on('close', () => console.log('Connection closed'));
	})
})

app.listen(3000, () => {
	console.log('Listening on port ' + 3000);
})
