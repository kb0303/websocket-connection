// websocket-server.js
import { WebSocketServer } from 'ws';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const wss = new WebSocketServer({ noServer: true });

app.post('/broadcast', (req, res) => {
  const { message } = req.body;
  if (message) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
    res.status(200).json({ status: 'Message broadcasted' });
  } else {
    res.status(400).json({ error: 'Message is required' });
  }
});
const port = 8080;
const server = app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
