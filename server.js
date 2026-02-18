const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { Server: SocketIO } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─────────────────────────────────────────────────────
//  WHO'S THE SPY — WebSocket + REST
// ─────────────────────────────────────────────────────
const spyRooms = {};
const spyClients = {};
const spyChats = {};

app.get('/spy/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const st = spyRooms[code];
  if (!st) return res.status(404).json({ error: 'Room not found' });
  res.json(st);
});
app.post('/spy/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  spyRooms[code] = req.body;
  broadcastSpyState(code, spyRooms[code]);
  res.json({ ok: true });
});
app.delete('/spy/room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  delete spyRooms[code];
  delete spyChats[code];
  if (spyClients[code]) {
    spyClients[code].forEach((ws) => {
      try { ws.send(JSON.stringify({ type: 'deleted' })); } catch(e) {}
    });
    delete spyClients[code];
  }
  res.json({ ok: true });
});

// WebSocket server (noServer so socket.io can coexist)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  // socket.io handles its own upgrades via its path prefix; spy gets everything else
  if (req.url === '/spy-ws') {
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  }
  // socket.io intercepts /socket.io/* automatically — no action needed here
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
        if (!spyClients[subscribedRoom]) spyClients[subscribedRoom] = new Map();
        spyClients[subscribedRoom].set(playerName, ws);
        if (spyRooms[subscribedRoom]) ws.send(JSON.stringify({ type: 'state', data: spyRooms[subscribedRoom] }));
        if (spyChats[subscribedRoom]) ws.send(JSON.stringify({ type: 'chat_history', messages: spyChats[subscribedRoom] }));
      }

      if (data.type === 'chat' && subscribedRoom && playerName) {
        const msg = { from: playerName, text: data.text, time: Date.now() };
        if (!spyChats[subscribedRoom]) spyChats[subscribedRoom] = [];
        spyChats[subscribedRoom].push(msg);
        if (spyChats[subscribedRoom].length > 100) spyChats[subscribedRoom].shift();
        broadcastSpyToRoom(subscribedRoom, { type: 'chat', msg });
      }

      if (['voice_offer', 'voice_answer', 'voice_ice'].includes(data.type)) {
        if (subscribedRoom && data.to && spyClients[subscribedRoom]) {
          const targetWs = spyClients[subscribedRoom].get(data.to);
          if (targetWs && targetWs.readyState === 1) targetWs.send(JSON.stringify({ ...data, from: playerName }));
        }
      }

      if (data.type === 'voice_speaking' && subscribedRoom) {
        broadcastSpyToRoom(subscribedRoom, { type: 'voice_speaking', from: playerName, speaking: data.speaking }, ws);
      }

    } catch(e) {}
  });

  ws.on('close', () => {
    if (subscribedRoom && spyClients[subscribedRoom]) {
      spyClients[subscribedRoom].delete(playerName);
      broadcastSpyToRoom(subscribedRoom, { type: 'voice_speaking', from: playerName, speaking: false });
    }
  });
});

function broadcastSpyState(roomCode, state) {
  if (!spyClients[roomCode]) return;
  const msg = JSON.stringify({ type: 'state', data: state });
  spyClients[roomCode].forEach((ws) => { if (ws.readyState === 1) try { ws.send(msg); } catch(e) {} });
}
function broadcastSpyToRoom(roomCode, payload, exclude = null) {
  if (!spyClients[roomCode]) return;
  const msg = JSON.stringify(payload);
  spyClients[roomCode].forEach((ws) => { if (ws !== exclude && ws.readyState === 1) try { ws.send(msg); } catch(e) {} });
}

// Cleanup old spy rooms
setInterval(() => {
  const now = Date.now();
  Object.keys(spyRooms).forEach(code => {
    const st = spyRooms[code];
    if (st._createdAt && now - st._createdAt > 2 * 60 * 60 * 1000) {
      delete spyRooms[code]; delete spyChats[code]; delete spyClients[code];
    }
  });
}, 10 * 60 * 1000);

// ─────────────────────────────────────────────────────
//  SOCKET.IO (Wordle + Skribbl)
// ─────────────────────────────────────────────────────
const io = new SocketIO(server);

// ── WORDLE ──────────────────────────────────────────
const battleRooms = {};
const raceRooms = {};
const PLAYER_COLORS_W = ['#FF6B6B','#4ECDC4','#45B7D1','#F7DC6F','#BB8FCE','#76D7C4','#F0A500','#EC407A'];

function makeBattleId() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:5}, () => c[Math.floor(Math.random()*c.length)]).join('');
}
function makeRaceId() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:4}, () => c[Math.floor(Math.random()*c.length)]).join('');
}

// ── SKRIBBL ──────────────────────────────────────────
const SKRIBBL_CATEGORIES = {
  'Hewan': ['KUCING','ANJING','GAJAH','HARIMAU','KELINCI','KUDA','SAPI','AYAM','BEBEK','IKAN','BURUNG','MONYET','ZEBRA','JERAPAH','BUAYA','ULAR','KURA-KURA','LUMBA-LUMBA','PANDA','KANGURU','RUSA','KAMBING','BABI','TIKUS','KUPU-KUPU','LEBAH','LABA-LABA','UDANG','KEPITING','CUMI-CUMI','HIU','PENYU','KOALA','BADAK','SINGA','BERUANG','RUBAH','KELELAWAR','CICAK'],
  'Makanan': ['NASI','MIE','BAKSO','SATE','RENDANG','PIZZA','BURGER','ROTI','TELUR','PISANG','APEL','MANGGA','SUSHI','DONAT','KUE','COKLAT','PERMEN','KERUPUK','TEMPE','TAHU','GULAI','RAWON','GADO-GADO','SOTO','JERUK','SEMANGKA','DURIAN','NANAS','STROBERI','ANGGUR','KENTANG','WORTEL','JAGUNG','TIMUN','TOMAT','BAWANG','KEJU','ESKRIM','PANCAKE','WAFEL'],
  'Kendaraan': ['MOBIL','MOTOR','SEPEDA','PESAWAT','KAPAL','KERETA','BUS','TRUK','HELIKOPTER','ROKET','PERAHU','TREM','TAKSI','AMBULANS','TRAKTOR','BECAK','DELMAN','SKATEBOARD','SKUTER','FORKLIFT'],
  'Benda': ['KURSI','MEJA','LEMARI','PINTU','JENDELA','BUKU','PENSIL','PULPEN','KACAMATA','TOPI','SEPATU','TAS','PAYUNG','LAMPU','TELEVISI','KULKAS','TELEPON','KOMPUTER','KAMERA','CERMIN','SAPU','GUNTING','PALU','KUNCI','BOTOL','GELAS','PIRING','SENDOK','GARPU','BANTAL','SISIR','JAM TANGAN','KALKULATOR','HEADPHONE'],
  'Alam': ['GUNUNG','PANTAI','SUNGAI','HUTAN','DANAU','MATAHARI','BULAN','BINTANG','AWAN','HUJAN','PETIR','PELANGI','GUNUNG BERAPI','AIR TERJUN','PADANG PASIR','SALJU','LAUT','PULAU','BUKIT','LEMBAH'],
  'Profesi': ['DOKTER','GURU','POLISI','KOKI','PETANI','PILOT','TENTARA','HAKIM','PENGACARA','ARSITEK','SENIMAN','MUSISI','AKTOR','ATLET','ASTRONOT','ILMUWAN','NELAYAN','PEMADAM','PERAWAT','INSINYUR'],
  'Olahraga': ['SEPAK BOLA','BASKET','RENANG','TENIS','BULU TANGKIS','VOLI','TINJU','SENAM','GOLF','BERSEPEDA','LARI','PANAHAN','SELAM','SURFING','SKATEBOARD'],
  'Bangunan': ['RUMAH','GEDUNG','SEKOLAH','RUMAH SAKIT','MASJID','GEREJA','ISTANA','BENTENG','MENARA','JEMBATAN','STASIUN','BANDARA','PASAR','MALL','MUSEUM','STADION','PERPUSTAKAAN'],
};

const skribblRooms = {};
const SKRIBBL_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#F7DC6F','#BB8FCE','#76D7C4','#F0A500','#EC407A'];

function makeSkribblId() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:5}, () => c[Math.floor(Math.random()*c.length)]).join('');
}
function getSkribblPlayerList(room) {
  return Object.values(room.players).map((p) => ({
    id: p.id, name: p.name, score: p.score, color: p.color,
    isDrawing: p.id === room.currentDrawer,
    hasGuessed: room.guessedPlayers?.has(p.id) || false,
    isHost: p.id === room.hostId,
  }));
}
function getRandWords(category, count = 3) {
  const pool = [...(SKRIBBL_CATEGORIES[category] || SKRIBBL_CATEGORIES['Hewan'])];
  const result = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}
function clearSkribblTurnTimers(room) {
  clearTimeout(room.turnTimer);
  clearTimeout(room.hintTimer);
  clearTimeout(room.chooseTimer);
}

function startSkribblTurn(roomId) {
  const room = skribblRooms[roomId];
  if (!room || room.status !== 'playing') return;
  room.guessedPlayers = new Set();
  room.currentWord = null;
  const playerIds = Object.keys(room.players);
  if (playerIds.length < 2) { endSkribblGame(roomId); return; }
  if (room.drawerQueue.length === 0) {
    room.currentRound++;
    if (room.currentRound > room.totalRounds) { endSkribblGame(roomId); return; }
    room.drawerQueue = [...playerIds];
  }
  let drawer = null;
  while (room.drawerQueue.length > 0) {
    const c = room.drawerQueue.shift();
    if (room.players[c]) { drawer = c; break; }
  }
  if (!drawer) { startSkribblTurn(roomId); return; }
  room.currentDrawer = drawer;
  const choices = getRandWords(room.category, 3);
  io.to(roomId).emit('skribbl:turn_start', {
    drawerId: room.currentDrawer,
    drawerName: room.players[room.currentDrawer].name,
    round: room.currentRound, totalRounds: room.totalRounds,
    players: getSkribblPlayerList(room),
  });
  io.to(room.currentDrawer).emit('skribbl:choose_word', { choices });
  room.chooseTimer = setTimeout(() => {
    if (!room.currentWord) pickSkribblWord(roomId, choices[Math.floor(Math.random() * choices.length)]);
  }, 15000);
}

function pickSkribblWord(roomId, word) {
  const room = skribblRooms[roomId];
  if (!room || room.currentWord) return;
  clearTimeout(room.chooseTimer);
  room.currentWord = word.toUpperCase();
  room.turnStartTime = Date.now();
  room.guessedPlayers = new Set();
  room.guessedPlayers.add(room.currentDrawer);
  const blank = room.currentWord.split('').map(c => c === ' ' ? ' ' : '_').join('');
  io.to(room.currentDrawer).emit('skribbl:word_picked', { word: room.currentWord });
  io.to(roomId).except(room.currentDrawer).emit('skribbl:word_hint', { hint: blank });
  room.hintTimer = setTimeout(() => revealSkribblHint(roomId), room.turnDuration * 0.55 * 1000);
  room.turnTimer = setTimeout(() => endSkribblTurn(roomId), room.turnDuration * 1000);
  io.to(roomId).emit('skribbl:timer_start', { duration: room.turnDuration });
}

function revealSkribblHint(roomId) {
  const room = skribblRooms[roomId];
  if (!room || !room.currentWord) return;
  const word = room.currentWord;
  const idx = [];
  for (let i = 0; i < word.length; i++) if (word[i] !== ' ') idx.push(i);
  const reveal = [...idx].sort(() => Math.random() - 0.5).slice(0, Math.max(1, Math.floor(idx.length * 0.35)));
  const hint = word.split('').map((c, i) => c === ' ' ? ' ' : reveal.includes(i) ? c : '_').join('');
  io.to(roomId).except(room.currentDrawer).emit('skribbl:hint_reveal', { hint });
}

function endSkribblTurn(roomId) {
  const room = skribblRooms[roomId];
  if (!room) return;
  clearSkribblTurnTimers(room);
  io.to(roomId).emit('skribbl:turn_end', { word: room.currentWord || '???', players: getSkribblPlayerList(room) });
  io.to(roomId).emit('skribbl:clear_canvas');
  setTimeout(() => startSkribblTurn(roomId), 5000);
}

function endSkribblGame(roomId) {
  const room = skribblRooms[roomId];
  if (!room) return;
  room.status = 'ended';
  clearSkribblTurnTimers(room);
  const sorted = Object.values(room.players).sort((a, b) => b.score - a.score);
  io.to(roomId).emit('skribbl:end', { players: sorted });
}

// ─────────────────────────────────────────────────────
//  SOCKET.IO EVENT HANDLERS
// ─────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  // ── WORDLE BATTLE ──────────────────────────────────
  socket.on('battle:create', ({ name, lang }) => {
    const roomId = makeBattleId();
    battleRooms[roomId] = { p1: { id: socket.id, name, word: null }, p2: null, winner: null, lang };
    socket.join(roomId);
    socket.emit('battle:created', { roomId, role: 'p1' });
  });

  socket.on('battle:join', ({ roomId, name }) => {
    const room = battleRooms[roomId];
    if (!room) { socket.emit('battle:error', 'Room tidak ditemukan!'); return; }
    if (room.p2) { socket.emit('battle:error', 'Room sudah penuh!'); return; }
    room.p2 = { id: socket.id, name, word: null };
    socket.join(roomId);
    socket.emit('battle:joined', { roomId, role: 'p2', lang: room.lang });
    io.to(room.p1.id).emit('battle:opponent_joined', { name });
    io.to(roomId).emit('battle:enter_word');
  });

  socket.on('battle:set_word', ({ roomId, word }) => {
    const room = battleRooms[roomId];
    if (!room) return;
    if (room.p1?.id === socket.id) room.p1.word = word;
    else if (room.p2?.id === socket.id) room.p2.word = word;
    socket.emit('battle:word_locked');
    if (room.p1?.word && room.p2?.word) {
      io.to(room.p1.id).emit('battle:start', { yourWord: room.p1.word, guessWord: room.p2.word, opponentName: room.p2.name });
      io.to(room.p2.id).emit('battle:start', { yourWord: room.p2.word, guessWord: room.p1.word, opponentName: room.p1.name });
    }
  });

  socket.on('battle:win', ({ roomId }) => {
    const room = battleRooms[roomId];
    if (!room || room.winner) return;
    room.winner = socket.id;
    const winnerName = room.p1?.id === socket.id ? room.p1.name : room.p2?.name;
    io.to(roomId).emit('battle:result', { winnerId: socket.id, winnerName });
  });

  socket.on('battle:restart', ({ roomId }) => {
    const room = battleRooms[roomId];
    if (!room) return;
    room.p1.word = null; room.p2.word = null; room.winner = null;
    io.to(roomId).emit('battle:enter_word');
  });

  socket.on('battle:leave', ({ roomId }) => {
    const room = battleRooms[roomId];
    if (room) { io.to(roomId).emit('battle:opponent_left'); delete battleRooms[roomId]; }
    socket.leave(roomId);
  });

  // ── WORDLE RACE ────────────────────────────────────
  socket.on('race:create', ({ name, lang, solution }) => {
    const roomId = makeRaceId();
    raceRooms[roomId] = {
      solution, lang, winner: null, hostId: socket.id,
      players: { [socket.id]: { name, won: false, guesses: 0 } },
    };
    socket.join(roomId);
    socket.emit('race:created', { roomId });
  });

  socket.on('race:join', ({ roomId, name }) => {
    const room = raceRooms[roomId];
    if (!room) { socket.emit('race:error', 'Room tidak ditemukan!'); return; }
    room.players[socket.id] = { name, won: false, guesses: 0 };
    socket.join(roomId);
    socket.emit('race:joined', { solution: room.solution, lang: room.lang });
    io.to(roomId).emit('race:players', getRacePlayerList(room));
  });

  socket.on('race:guess', ({ roomId }) => {
    const room = raceRooms[roomId];
    if (!room || !room.players[socket.id]) return;
    room.players[socket.id].guesses += 1;
    io.to(roomId).emit('race:players', getRacePlayerList(room));
  });

  socket.on('race:win', ({ roomId, guesses }) => {
    const room = raceRooms[roomId];
    if (!room || room.winner) return;
    room.players[socket.id].won = true;
    room.players[socket.id].guesses = guesses;
    room.winner = { id: socket.id, name: room.players[socket.id].name, guesses };
    io.to(roomId).emit('race:players', getRacePlayerList(room));
    io.to(roomId).emit('race:winner', room.winner);
  });

  socket.on('race:lose', ({ roomId }) => {
    const room = raceRooms[roomId];
    if (!room || !room.players[socket.id]) return;
    room.players[socket.id].won = false;
    room.players[socket.id].guesses = 6;
    io.to(roomId).emit('race:players', getRacePlayerList(room));
  });

  socket.on('race:restart', ({ roomId, solution }) => {
    const room = raceRooms[roomId];
    if (!room || room.hostId !== socket.id) return;
    room.solution = solution; room.winner = null;
    Object.keys(room.players).forEach(pid => { room.players[pid].won = false; room.players[pid].guesses = 0; });
    io.to(roomId).emit('race:restarted', { solution, lang: room.lang });
    io.to(roomId).emit('race:players', getRacePlayerList(room));
  });

  socket.on('race:leave', ({ roomId }) => {
    const room = raceRooms[roomId];
    if (room && room.players[socket.id]) {
      delete room.players[socket.id];
      if (Object.keys(room.players).length === 0) delete raceRooms[roomId];
      else io.to(roomId).emit('race:players', getRacePlayerList(room));
    }
    socket.leave(roomId);
  });

  // ── SKRIBBL ────────────────────────────────────────
  socket.on('skribbl:room_create', ({ name, category, rounds }) => {
    const roomId = makeSkribblId();
    skribblRooms[roomId] = {
      hostId: socket.id, category: category || 'Hewan',
      totalRounds: parseInt(rounds) || 3, currentRound: 1, status: 'waiting',
      players: { [socket.id]: { id: socket.id, name, score: 0, color: SKRIBBL_COLORS[0] } },
      currentDrawer: null, drawerQueue: [], currentWord: null,
      guessedPlayers: new Set(), turnDuration: 80,
    };
    socket.join(roomId);
    socket.emit('skribbl:room_created', { roomId });
    io.to(roomId).emit('skribbl:players', getSkribblPlayerList(skribblRooms[roomId]));
    io.to(roomId).emit('skribbl:chat', { type: 'system', message: `${name} membuat room 🎉` });
  });

  socket.on('skribbl:room_join', ({ roomId, name }) => {
    const room = skribblRooms[roomId];
    if (!room) { socket.emit('skribbl:error', 'Room tidak ditemukan!'); return; }
    if (room.status === 'ended') { socket.emit('skribbl:error', 'Game sudah selesai!'); return; }
    const ci = Object.keys(room.players).length % SKRIBBL_COLORS.length;
    room.players[socket.id] = { id: socket.id, name, score: 0, color: SKRIBBL_COLORS[ci] };
    socket.join(roomId);
    socket.emit('skribbl:room_joined', { roomId, category: room.category, rounds: room.totalRounds, hostId: room.hostId, status: room.status });
    io.to(roomId).emit('skribbl:players', getSkribblPlayerList(room));
    io.to(roomId).emit('skribbl:chat', { type: 'system', message: `${name} bergabung! 👋` });
  });

  socket.on('skribbl:start', ({ roomId }) => {
    const room = skribblRooms[roomId];
    if (!room || room.hostId !== socket.id) return;
    if (Object.keys(room.players).length < 2) { socket.emit('skribbl:error', 'Butuh minimal 2 pemain!'); return; }
    room.status = 'playing'; room.currentRound = 1;
    room.drawerQueue = Object.keys(room.players);
    Object.values(room.players).forEach(p => p.score = 0);
    io.to(roomId).emit('skribbl:started', { category: room.category });
    startSkribblTurn(roomId);
  });

  socket.on('skribbl:pick_word', ({ roomId, word }) => {
    const room = skribblRooms[roomId];
    if (!room || room.currentDrawer !== socket.id) return;
    pickSkribblWord(roomId, word);
  });

  socket.on('skribbl:draw', ({ roomId, data }) => {
    const room = skribblRooms[roomId];
    if (!room || room.currentDrawer !== socket.id) return;
    socket.to(roomId).emit('skribbl:draw', data);
  });

  socket.on('skribbl:clear', ({ roomId }) => {
    const room = skribblRooms[roomId];
    if (!room || room.currentDrawer !== socket.id) return;
    io.to(roomId).emit('skribbl:clear_canvas');
  });

  socket.on('skribbl:guess', ({ roomId, guess }) => {
    const room = skribblRooms[roomId];
    if (!room || !room.currentWord || room.currentDrawer === socket.id) return;
    if (room.guessedPlayers.has(socket.id)) return;
    const player = room.players[socket.id];
    if (!player) return;
    if (guess.trim().toUpperCase() === room.currentWord) {
      room.guessedPlayers.add(socket.id);
      const timeLeft = Math.max(0, room.turnDuration - Math.floor((Date.now() - room.turnStartTime) / 1000));
      const points = Math.round(50 + (timeLeft / room.turnDuration) * 100);
      player.score += points;
      if (room.players[room.currentDrawer]) room.players[room.currentDrawer].score += 20;
      io.to(roomId).emit('skribbl:correct_guess', { playerId: socket.id, playerName: player.name, points, players: getSkribblPlayerList(room) });
      socket.emit('skribbl:you_guessed', { word: room.currentWord, points });
      const nonDrawers = Object.keys(room.players).filter(id => id !== room.currentDrawer);
      if (nonDrawers.every(id => room.guessedPlayers.has(id))) {
        clearSkribblTurnTimers(room);
        setTimeout(() => endSkribblTurn(roomId), 2000);
      }
    } else {
      io.to(roomId).emit('skribbl:chat', { type: 'guess', playerName: player.name, playerColor: player.color, message: guess, playerId: socket.id });
    }
  });

  socket.on('skribbl:chat', ({ roomId, message }) => {
    const room = skribblRooms[roomId];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player) return;
    io.to(roomId).emit('skribbl:chat', { type: 'chat', playerName: player.name, playerColor: player.color, message });
  });

  socket.on('skribbl:restart', ({ roomId }) => {
    const room = skribblRooms[roomId];
    if (!room || room.hostId !== socket.id) return;
    clearSkribblTurnTimers(room);
    room.status = 'waiting'; room.currentDrawer = null; room.currentWord = null;
    room.currentRound = 1; room.drawerQueue = [];
    Object.values(room.players).forEach(p => p.score = 0);
    io.to(roomId).emit('skribbl:restarted');
    io.to(roomId).emit('skribbl:players', getSkribblPlayerList(room));
  });

  // ── DISCONNECT ─────────────────────────────────────
  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);

    // Wordle Battle
    for (const [roomId, room] of Object.entries(battleRooms)) {
      if (room.p1?.id === socket.id || room.p2?.id === socket.id) {
        io.to(roomId).emit('battle:opponent_left');
        delete battleRooms[roomId];
      }
    }
    // Wordle Race
    for (const [roomId, room] of Object.entries(raceRooms)) {
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        if (Object.keys(room.players).length === 0) delete raceRooms[roomId];
        else io.to(roomId).emit('race:players', getRacePlayerList(room));
      }
    }
    // Skribbl
    for (const [roomId, room] of Object.entries(skribblRooms)) {
      if (!room.players[socket.id]) continue;
      const name = room.players[socket.id].name;
      delete room.players[socket.id];
      if (Object.keys(room.players).length === 0) { delete skribblRooms[roomId]; continue; }
      if (room.hostId === socket.id) {
        room.hostId = Object.keys(room.players)[0];
        io.to(room.hostId).emit('skribbl:you_are_host');
      }
      io.to(roomId).emit('skribbl:players', getSkribblPlayerList(room));
      io.to(roomId).emit('skribbl:chat', { type: 'system', message: `${name} keluar 👋` });
      if (room.status === 'playing' && room.currentDrawer === socket.id) {
        clearSkribblTurnTimers(room);
        setTimeout(() => endSkribblTurn(roomId), 2000);
      }
    }
  });
});

function getRacePlayerList(room) {
  return Object.entries(room.players)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => { if (a.won && !b.won) return -1; if (!a.won && b.won) return 1; return (a.guesses||99)-(b.guesses||99); });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ GameHub jalan di http://localhost:${PORT}`));
