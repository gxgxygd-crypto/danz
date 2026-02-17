const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ── In-memory game state store ──
const rooms = {}; // { [roomCode]: gameState }
const roomClients = {}; // { [roomCode]: Set<ws> }

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ── REST API ──

// GET state
app.get('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const st = rooms[code];
  if (!st) return res.status(404).json({ error: 'Room not found' });
  res.json(st);
});

// SET state (create/update)
app.post('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  rooms[code] = req.body;
  broadcast(code, rooms[code]);
  res.json({ ok: true });
});

// DELETE state (cleanup)
app.delete('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  delete rooms[code];
  if (roomClients[code]) {
    roomClients[code].forEach(ws => {
      try { ws.send(JSON.stringify({ type: 'deleted' })); } catch(e) {}
    });
    delete roomClients[code];
  }
  res.json({ ok: true });
});

// ── WebSocket for real-time push ──
wss.on('connection', (ws, req) => {
  let subscribedRoom = null;

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'subscribe' && data.room) {
        subscribedRoom = data.room.toUpperCase();
        if (!roomClients[subscribedRoom]) roomClients[subscribedRoom] = new Set();
        roomClients[subscribedRoom].add(ws);
        // Send current state immediately
        if (rooms[subscribedRoom]) {
          ws.send(JSON.stringify({ type: 'state', data: rooms[subscribedRoom] }));
        }
      }
    } catch(e) {}
  });

  ws.on('close', () => {
    if (subscribedRoom && roomClients[subscribedRoom]) {
      roomClients[subscribedRoom].delete(ws);
    }
  });
});

function broadcast(roomCode, state) {
  if (!roomClients[roomCode]) return;
  const msg = JSON.stringify({ type: 'state', data: state });
  roomClients[roomCode].forEach(ws => {
    if (ws.readyState === 1) {
      try { ws.send(msg); } catch(e) {}
    }
  });
}

// Auto-cleanup rooms older than 2 hours
setInterval(() => {
  const now = Date.now();
  Object.keys(rooms).forEach(code => {
    const st = rooms[code];
    if (st._createdAt && now - st._createdAt > 2 * 60 * 60 * 1000) {
      delete rooms[code];
      delete roomClients[code];
    }
  });
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🕵️  Who's The Spy server running on port ${PORT}`);
});
