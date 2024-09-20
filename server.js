import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const wss = new WebSocketServer({ noServer: true });

app.post('/broadcast', (req, res) => {
  const { type, content } = req.body;
  if (type && content) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, content }));
      }
    });
    res.status(200).json({ status: 'Message broadcasted' });
  } else {
    res.status(400).json({ error: 'Type and content are required' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'welcome to websocket connection' });
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
