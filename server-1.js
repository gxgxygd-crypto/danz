const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = {};
const roomClients = {};
const roomChats = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const st = rooms[code];
  if (!st) return res.status(404).json({ error: 'Room not found' });
  res.json(st);
});

app.post('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  rooms[code] = req.body;
  broadcastState(code, rooms[code]);
  res.json({ ok: true });
});

app.delete('/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  delete rooms[code];
  delete roomChats[code];
  if (roomClients[code]) {
    roomClients[code].forEach((ws) => {
      try { ws.send(JSON.stringify({ type: 'deleted' })); } catch(e) {}
    });
    delete roomClients[code];
  }
  res.json({ ok: true });
});

wss.on('connection', (ws) => {
  let subscribedRoom = null;
  let playerName = null;

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw);

      if (data.type === 'subscribe') {
        subscribedRoom = data.room.toUpperCase();
        playerName = data.name;
        if (!roomClients[subscribedRoom]) roomClients[subscribedRoom] = new Map();
        roomClients[subscribedRoom].set(playerName, ws);
        if (rooms[subscribedRoom]) {
          ws.send(JSON.stringify({ type: 'state', data: rooms[subscribedRoom] }));
        }
        if (roomChats[subscribedRoom]) {
          ws.send(JSON.stringify({ type: 'chat_history', messages: roomChats[subscribedRoom] }));
        }
      }

      if (data.type === 'chat' && subscribedRoom && playerName) {
        const msg = { from: playerName, text: data.text, time: Date.now() };
        if (!roomChats[subscribedRoom]) roomChats[subscribedRoom] = [];
        roomChats[subscribedRoom].push(msg);
        if (roomChats[subscribedRoom].length > 100) roomChats[subscribedRoom].shift();
        broadcastToRoom(subscribedRoom, { type: 'chat', msg });
      }

      if (['voice_offer','voice_answer','voice_ice'].includes(data.type)) {
        if (subscribedRoom && data.to && roomClients[subscribedRoom]) {
          const targetWs = roomClients[subscribedRoom].get(data.to);
          if (targetWs && targetWs.readyState === 1) {
            targetWs.send(JSON.stringify({ ...data, from: playerName }));
          }
        }
      }

      if (data.type === 'voice_speaking' && subscribedRoom) {
        broadcastToRoom(subscribedRoom, { type: 'voice_speaking', from: playerName, speaking: data.speaking }, ws);
      }

    } catch(e) {}
  });

  ws.on('close', () => {
    if (subscribedRoom && roomClients[subscribedRoom]) {
      roomClients[subscribedRoom].delete(playerName);
      broadcastToRoom(subscribedRoom, { type: 'voice_speaking', from: playerName, speaking: false });
    }
  });
});

function broadcastState(roomCode, state) {
  if (!roomClients[roomCode]) return;
  const msg = JSON.stringify({ type: 'state', data: state });
  roomClients[roomCode].forEach((ws) => {
    if (ws.readyState === 1) try { ws.send(msg); } catch(e) {}
  });
}

function broadcastToRoom(roomCode, payload, exclude = null) {
  if (!roomClients[roomCode]) return;
  const msg = JSON.stringify(payload);
  roomClients[roomCode].forEach((ws) => {
    if (ws !== exclude && ws.readyState === 1) try { ws.send(msg); } catch(e) {}
  });
}

setInterval(() => {
  const now = Date.now();
  Object.keys(rooms).forEach(code => {
    const st = rooms[code];
    if (st._createdAt && now - st._createdAt > 2 * 60 * 60 * 1000) {
      delete rooms[code]; delete roomChats[code]; delete roomClients[code];
    }
  });
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🕵️  Who's The Spy server running on port ${PORT}`));
