const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// =============================================
// GAME STATE
// =============================================
const WORD_LIST = [
  "KEREN", "BESAR", "CEPAT", "PINTU", "MAKAN", "MINUM", "TIDUR", "JALAN",
  "RUMAH", "MOBIL", "BUNGA", "POHON", "HUJAN", "ANGIN", "BARAT", "TIMUR",
  "UTARA", "DEPAN", "BELAK", "DALAM", "LUAR", "ATAS", "BAWAH", "DEKAT",
  "JAUH",  "KERAS", "LUNAK", "PANAS", "DINGI", "GELAP", "TERAN", "HITAM",
  "PUTIH", "MERAH", "HIJAU", "KUNING","BIRU",  "COKLAT","ORANGE","UNGU",
  "MANIS", "PAHIT", "ASIN",  "PEDAS", "ASAM",  "SEGAR", "HARUM", "BUSUK",
  "BERSIH","KOTOR", "BAGUS", "JELEK", "CANTIK","TAMPAN","RAJIN", "MALAS",
  "PANDAI","BODOH", "BERANI","TAKUT", "SENANG","SEDIH", "MARAH", "TENANG",
  "HUTAN", "GUNUNG","PANTAI","LAUT",  "SUNGAI","KOLAM", "SAWAH", "KEBUN",
  "PASAR", "TOKO",  "HOTEL", "RESTO", "KANTOR","SEKOLAH","MASJID","GEREJA",
  // English words too
  "APPLE", "BEACH", "BRAVE", "CHAIN", "DANCE", "EARTH", "FAITH", "GIANT",
  "HAPPY", "IMAGE", "JEWEL", "KNIFE", "LIGHT", "MAGIC", "NIGHT", "OCEAN",
  "PEACE", "QUEEN", "RIVER", "SMILE", "TIGER", "ULTRA", "VOICE", "WATER",
  "XENON", "YACHT", "ZESTY", "ANGEL", "BLAZE", "CRAFT", "DREAM", "ELITE",
  "FLAME", "GRACE", "HEART", "INNER", "JOKER", "KARMA", "LASER", "MONEY",
  "NOBLE", "ORDER", "POWER", "QUICK", "RACER", "SPACE", "TRAIN", "UNITY",
  "VAPOR", "WITCH", "XYLEM", "YOUNG", "ZEBRA", "FROST", "GLOBE", "HONEY",
  "IVORY", "JUMPY", "KNACK", "LEMON", "MUSIC", "NERVE", "OLIVE", "PIANO",
  "QUOTA", "RADAR", "SALAD", "TOXIC", "UPPER", "VIVID", "WALTZ", "EXACT"
];

let gameState = {
  secretWord: "",
  guesses: [],       // { username, word, result, timestamp }
  isActive: false,
  maxGuesses: 20,
  roundNumber: 0,
  winner: null,
  tiktokUser: "",
  connected: false
};

let tiktokConnection = null;

function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function checkGuess(guess, secret) {
  const result = [];
  const secretArr = secret.split("");
  const guessArr = guess.split("");
  const secretUsed = Array(5).fill(false);
  const guessUsed = Array(5).fill(false);

  // First pass: correct position
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "correct";
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: wrong position
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (secretUsed[j]) continue;
      if (guessArr[i] === secretArr[j]) {
        result[i] = "present";
        secretUsed[j] = true;
        guessUsed[i] = true;
        break;
      }
    }
    if (!result[i]) result[i] = "absent";
  }

  return result;
}

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

function startNewRound() {
  gameState.secretWord = getRandomWord();
  gameState.guesses = [];
  gameState.isActive = true;
  gameState.winner = null;
  gameState.roundNumber++;
  
  console.log(`🎮 Round ${gameState.roundNumber} started! Word: ${gameState.secretWord}`);
  
  broadcast({
    type: "NEW_ROUND",
    roundNumber: gameState.roundNumber,
    wordLength: gameState.secretWord.length,
    maxGuesses: gameState.maxGuesses
  });
}

function processGuess(username, word, nickname = "", avatar = "") {
  if (!gameState.isActive) return;
  if (word.length !== 5) return;
  
  const upperWord = word.toUpperCase();
  
  // Check if this user already guessed this exact word
  const alreadyGuessed = gameState.guesses.some(
    g => g.username === username && g.word === upperWord
  );
  if (alreadyGuessed) return;
  
  // Check max guesses
  if (gameState.guesses.length >= gameState.maxGuesses) return;

  const result = checkGuess(upperWord, gameState.secretWord);
  const isWinner = result.every(r => r === "correct");

  const guessData = {
    username,
    nickname: nickname || username,
    avatar,
    word: upperWord,
    result,
    timestamp: Date.now(),
    guessNumber: gameState.guesses.length + 1
  };

  gameState.guesses.push(guessData);

  console.log(`💬 ${username}: ${upperWord} → ${result.join(", ")}${isWinner ? " 🏆 WINNER!" : ""}`);

  broadcast({
    type: "NEW_GUESS",
    guess: guessData,
    totalGuesses: gameState.guesses.length
  });

  if (isWinner) {
    gameState.winner = username;
    gameState.isActive = false;
    
    setTimeout(() => {
      broadcast({
        type: "GAME_WON",
        winner: username,
        nickname,
        avatar,
        word: gameState.secretWord,
        totalGuesses: gameState.guesses.length
      });
    }, 500);

    // Auto start new round after 8 seconds
    setTimeout(() => {
      startNewRound();
    }, 8000);
  } else if (gameState.guesses.length >= gameState.maxGuesses) {
    gameState.isActive = false;
    
    setTimeout(() => {
      broadcast({
        type: "GAME_OVER",
        word: gameState.secretWord,
        totalGuesses: gameState.guesses.length
      });
    }, 500);

    setTimeout(() => {
      startNewRound();
    }, 8000);
  }
}

// =============================================
// TIKTOK LIVE CONNECTION
// =============================================
async function connectTikTok(username) {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch(e) {}
    tiktokConnection = null;
  }

  gameState.tiktokUser = username;
  gameState.connected = false;

  const connection = new WebcastPushConnection(username, {
    processInitialData: false,
    enableExtendedGiftInfo: false,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    clientParams: {
      app_language: "id-ID",
      device_platform: "web"
    }
  });

  tiktokConnection = connection;

  connection.on("connect", state => {
    console.log(`✅ Connected to @${username}'s TikTok Live!`);
    gameState.connected = true;
    broadcast({ type: "TIKTOK_CONNECTED", username });
  });

  connection.on("disconnect", () => {
    console.log("❌ TikTok disconnected");
    gameState.connected = false;
    broadcast({ type: "TIKTOK_DISCONNECTED" });
  });

  connection.on("error", err => {
    console.error("TikTok error:", err.message);
    broadcast({ type: "TIKTOK_ERROR", message: err.message });
  });

  connection.on("chat", data => {
    const comment = data.comment?.trim() || "";
    const username = data.uniqueId || "anon";
    const nickname = data.nickname || data.uniqueId || "anon";
    const avatar = data.profilePictureUrl || "";

    // Broadcast all chat to feed
    broadcast({ type: "CHAT_MESSAGE", username, nickname, avatar, message: comment, isGuess: /^[a-zA-Z]{5}$/.test(comment) });

    // Only process if it looks like a word (5 letters, no spaces)
    if (/^[a-zA-Z]{5}$/.test(comment)) {
      processGuess(username, comment, nickname, avatar);
    }
  });

  try {
    await connection.connect();
    startNewRound();
  } catch (err) {
    console.error("Failed to connect:", err.message);
    broadcast({ type: "TIKTOK_ERROR", message: `Gagal connect: ${err.message}` });
  }
}

// =============================================
// REST API
// =============================================
app.post("/api/connect", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ success: false, message: "Username diperlukan" });
  
  try {
    connectTikTok(username.replace("@", ""));
    res.json({ success: true, message: `Mencoba connect ke @${username}...` });
  } catch(e) {
    res.json({ success: false, message: e.message });
  }
});

app.post("/api/disconnect", (req, res) => {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch(e) {}
    tiktokConnection = null;
  }
  gameState.connected = false;
  gameState.isActive = false;
  res.json({ success: true });
});

app.post("/api/new-round", (req, res) => {
  startNewRound();
  res.json({ success: true });
});

app.post("/api/test-guess", (req, res) => {
  const { username, word } = req.body;
  processGuess(username || "test_user", word);
  res.json({ success: true });
});

app.get("/api/state", (req, res) => {
  res.json({
    ...gameState,
    secretWord: gameState.isActive ? "?????" : gameState.secretWord
  });
});

// =============================================
// WEBSOCKET
// =============================================
wss.on("connection", (ws) => {
  console.log("🌐 Browser connected");
  ws.send(JSON.stringify({
    type: "STATE",
    state: {
      ...gameState,
      secretWord: gameState.isActive ? "?????" : gameState.secretWord
    }
  }));
});

// =============================================
// START SERVER
// =============================================
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      🎮 TikTok Live WORDLE SERVER     ║
╠════════════════════════════════════════╣
║  Buka browser: http://localhost:3000   ║
║  Masukkan username TikTok kamu         ║
║  Pastikan sedang LIVE!                 ║
╚════════════════════════════════════════╝
  `);
});
