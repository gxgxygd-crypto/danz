const express  = require("express");
const http     = require("http");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");
const path     = require("path");
const fs       = require("fs");
const readline = require("readline");

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ============================================================
// BROADCAST
// ============================================================
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
}

// ============================================================
// ██╗    ██╗ ██████╗ ██████╗ ██████╗ ██╗     ███████╗
// ██║    ██║██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝
// ██║ █╗ ██║██║   ██║██████╔╝██║  ██║██║     █████╗
// ██║███╗██║██║   ██║██╔══██╗██║  ██║██║     ██╔══╝
// ╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝███████╗███████╗
//  ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
// ============================================================

const WORDLE_WORDS = [
  "ABBEY", "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT",
  "ADORE", "AFTER", "AGAIN", "AGENT", "AGILE", "AGREE", "AHEAD", "AISLE",
  "AKTIF", "AKTOR", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLEY",
  "ALLOW", "ALOFT", "ALONE", "ALONG", "ALTAR", "ALTER", "AMONG", "AMPLE",
  "ANGEL", "ANGER", "ANGIN", "ANGLE", "ANGRY", "ANKLE", "ANTIC", "ANTIK",
  "APART", "APPLE", "APPLY", "APRON", "APTLY", "ARDOR", "ARENA", "ARGUE",
  "ARISE", "ARMED", "ARMOR", "AROMA", "ARRAY", "ARROW", "ARTIS", "ARTSY",
  "ASCOT", "ASIDE", "ASSET", "ATLAS", "ATTIC", "AUDIO", "AUGUR", "AVOID",
  "AWAKE", "AWARE", "AWFUL", "AZURE", "BADAI", "BADGE", "BAGUS", "BAJAJ",
  "BAKER", "BAKSO", "BANJO", "BARAT", "BARET", "BASAH", "BASIC", "BASIS",
  "BATCH", "BATHE", "BAYOU", "BEACH", "BEARD", "BEAST", "BEBEK", "BECAK",
  "BEDAK", "BEFOG", "BEGIN", "BEING", "BELOW", "BELUM", "BENCH", "BERAT",
  "BESAR", "BETIS", "BIBIR", "BIDAN", "BIRCH", "BIRTH", "BISON", "BLACK",
  "BLADE", "BLAME", "BLAND", "BLANK", "BLAST", "BLAZE", "BLEED", "BLEND",
  "BLESS", "BLIMP", "BLIND", "BLISS", "BLOAT", "BLOCK", "BLOOD", "BLOOM",
  "BLOWN", "BLUNT", "BLURB", "BOARD", "BODOH", "BOGUS", "BOLEH", "BONUS",
  "BOOST", "BOOTH", "BORAX", "BOTCH", "BOUND", "BOXER", "BRACE", "BRAID",
  "BRAIN", "BRAND", "BRASH", "BRAVE", "BRAWL", "BRAWN", "BRAZE", "BREAD",
  "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF", "BRING", "BRINK", "BRISK",
  "BROAD", "BROIL", "BROKE", "BROOK", "BROTH", "BROWN", "BROWS", "BRUSH",
  "BRUTE", "BUAYA", "BUBUR", "BUDDY", "BUDGE", "BUILT", "BUKIT", "BULAN",
  "BULGE", "BULLY", "BUMBU", "BUMPY", "BUNCH", "BUNGA", "BURNS", "BURST",
  "BURUH", "BUSHY", "BUSTY", "BUYER", "CABIN", "CABLE", "CAMEO", "CANDY",
  "CARGO", "CARRY", "CATCH", "CAUSE", "CEDAR", "CEPAT", "CERAH", "CHAIN",
  "CHAIR", "CHALK", "CHAMP", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP",
  "CHECK", "CHEEK", "CHESS", "CHEST", "CHIEF", "CHILD", "CHILL", "CHOIR",
  "CINTA", "CIVIC", "CIVIL", "CLAIM", "CLAMP", "CLASH", "CLASP", "CLASS",
  "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLING", "CLINK",
  "CLOCK", "CLONE", "CLOSE", "CLOTH", "CLOUD", "COACH", "COAST", "COMET",
  "COMIC", "CORAL", "COUCH", "COUGH", "COULD", "COURT", "COVER", "CRACK",
  "CRAFT", "CRAMP", "CRANE", "CRASH", "CRAVE", "CRAZY", "CREAM", "CREEK",
  "CRIME", "CRIMP", "CRISP", "CROSS", "CROWD", "CROWN", "CRUDE", "CRUEL",
  "CRUSH", "CRUST", "CRYPT", "CUBIC", "CUKUP", "CURLY", "CURVE", "CUTIE",
  "CYCLE", "DADDY", "DAILY", "DALAM", "DANAU", "DANCE", "DANDY", "DAPUR",
  "DARAH", "DARAT", "DATED", "DEATH", "DEBUT", "DECOR", "DEEDS", "DEITY",
  "DEKAT", "DELAY", "DELTA", "DENSE", "DEPAN", "DEPOT", "DEPTH", "DETIK",
  "DEVIL", "DIRTY", "DISCO", "DITCH", "DITTY", "DIZZY", "DODGE", "DODGY",
  "DOGMA", "DOING", "DOLLY", "DOMBA", "DONOR", "DOUBT", "DOUGH", "DOWDY",
  "DOWNY", "DRAFT", "DRAIN", "DRAMA", "DRANK", "DRAWN", "DREAD", "DREAM",
  "DRIFT", "DRINK", "DRIVE", "DROWN", "DRUNK", "DUNIA", "DUSKY", "DUSTY",
  "DUTCH", "DWARF", "DWELL", "EAGER", "EARLY", "EARTH", "EASEL", "EERIE",
  "EIGHT", "ELANG", "ELBOW", "ELITE", "EMBER", "EMBUN", "EMOTE", "EMPTY",
  "ENEMY", "ENJOY", "ENTER", "ENTRY", "EPOCH", "EQUAL", "ERROR", "ESSAY",
  "ETHIC", "EVENT", "EVERY", "EVOKE", "EXACT", "EXERT", "EXILE", "EXIST",
  "EXPEL", "EXTOL", "EXTRA", "EXULT", "FABLE", "FADED", "FAINT", "FAIRY",
  "FAITH", "FAJAR", "FALSE", "FANCY", "FATAL", "FEAST", "FEVER", "FIBER",
  "FIELD", "FIERY", "FIFTH", "FIGHT", "FINAL", "FINCH", "FIRST", "FIXED",
  "FIZZY", "FJORD", "FLAIR", "FLAKY", "FLAME", "FLANK", "FLAPS", "FLARE",
  "FLASH", "FLASK", "FLESH", "FLOAT", "FLOCK", "FLOOD", "FLOOR", "FLORA",
  "FLOUR", "FLUID", "FLUNG", "FLUSH", "FLUTE", "FOAMY", "FOCUS", "FOGGY",
  "FOLLY", "FORCE", "FORGE", "FORTE", "FORTH", "FORTY", "FORUM", "FOUND",
  "FRAIL", "FRAME", "FRANK", "FRAUD", "FREED", "FRESH", "FRISK", "FROND",
  "FRONT", "FROST", "FROTH", "FROZE", "FRUIT", "FULLY", "FUNNY", "FURRY",
  "GAJAH", "GAMMA", "GARAM", "GARPU", "GAUZE", "GAVEL", "GELAP", "GELAS",
  "GEMUK", "GHOST", "GIANT", "GIVEN", "GLASS", "GLEAM", "GLEAN", "GLIDE",
  "GLINT", "GLOAT", "GLOBE", "GLOOM", "GLORY", "GLOVE", "GNOME", "GOING",
  "GORGE", "GOURD", "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAPE",
  "GRASP", "GRASS", "GRAVE", "GREAT", "GREED", "GREEN", "GREET", "GRIEF",
  "GRIMY", "GRIND", "GRIPE", "GROAN", "GROOM", "GROSS", "GROUP", "GROVE",
  "GROWN", "GRUFF", "GUARD", "GUESS", "GUEST", "GUIDE", "GUILD", "GUILT",
  "GUISE", "GULAI", "GULCH", "GULLY", "GUSTO", "GUSTY", "HABIT", "HAKIM",
  "HALUS", "HANDY", "HARAP", "HARDY", "HARSH", "HARUS", "HASTE", "HASTY",
  "HAUNT", "HAVEN", "HAZEL", "HEADY", "HEART", "HEAVY", "HEDGE", "HEIST",
  "HELIX", "HINGE", "HIPPO", "HIPPY", "HITCH", "HOARD", "HOMER", "HONEY",
  "HOPPY", "HORDE", "HORNY", "HOTLY", "HOUND", "HOUSE", "HUJAN", "HUMAN",
  "HUMID", "HUMOR", "HUSKY", "HUTAN", "HYPER", "IDEAL", "IMAGE", "IMPEL",
  "INDAH", "INDEX", "INEPT", "INFER", "INNER", "INPUT", "INTER", "INTRO",
  "IONIC", "IRATE", "ISSUE", "IVORY", "JAHAT", "JAKET", "JAKSA", "JAMBU",
  "JARUM", "JAZZY", "JEANS", "JELEK", "JERKY", "JERUK", "JEWEL", "JOINT",
  "JOKER", "JOLLY", "JOUST", "JUDGE", "JUICE", "JUICY", "JUJUR", "JUMBO",
  "JUMPY", "KABUT", "KAMAR", "KAPAL", "KARMA", "KASAR", "KASIH", "KASUR",
  "KATAK", "KAYAK", "KEBUN", "KECAP", "KECIL", "KERAS", "KEREN", "KINKY",
  "KIPAS", "KNEEL", "KNELT", "KNIFE", "KNOBS", "KNOCK", "KNOLL", "KNOWN",
  "KODOK", "KOLAM", "KOOKY", "KOTOR", "KULIT", "KUNCI", "KURSI", "KURUS",
  "LABEL", "LACEY", "LAFFY", "LALAT", "LAMPU", "LANCE", "LANKY", "LARGE",
  "LARVA", "LASER", "LATCH", "LATER", "LAUGH", "LAYER", "LEAFY", "LEAPT",
  "LEARN", "LEBAH", "LEBAR", "LEBIH", "LEERY", "LEGAL", "LEHER", "LEMAH",
  "LEMON", "LEPET", "LEVEL", "LEVER", "LICIN", "LIDAH", "LIGHT", "LIMBO",
  "LIMIT", "LINGO", "LINTY", "LITHE", "LIVER", "LLAMA", "LOCAL", "LODEH",
  "LODGE", "LOFTY", "LOGIC", "LOOSE", "LOUSY", "LOVER", "LOWER", "LOWLY",
  "LOYAL", "LUCKY", "LUMPY", "LUMUT", "LUNAR", "LUPIS", "LUSTY", "LUTUT",
  "LYRIC", "MACAN", "MAGIC", "MAHAL", "MAJOR", "MAKER", "MALAM", "MALAS",
  "MANGO", "MANIA", "MANLY", "MANOR", "MAPLE", "MARAH", "MARCH", "MARSH",
  "MATCH", "MAXIM", "MAYOR", "MEANT", "MEDAL", "MEDIA", "MELEE", "MELON",
  "MENIT", "MERAK", "MERCY", "MERIT", "MESIN", "MESSY", "METAL", "METRO",
  "MEWAH", "MICRO", "MIGHT", "MILKY", "MIMPI", "MINTY", "MIRIP", "MIRTH",
  "MISER", "MISTY", "MIXED", "MOBIL", "MOCHA", "MODEL", "MONEY", "MONTH",
  "MOODY", "MORAL", "MOSSY", "MOTOR", "MOTTO", "MOUNT", "MOUSE", "MOUSY",
  "MOUTH", "MOVED", "MUGGY", "MULUT", "MURAH", "MURKY", "MUSHY", "MUSIC",
  "MUTED", "NAFAS", "NAIVE", "NANAS", "NASTY", "NERDY", "NERVE", "NEVER",
  "NEWER", "NIFTY", "NIGHT", "NINJA", "NIPPY", "NITRO", "NOBLE", "NOISY",
  "NOOSE", "NORTH", "NOTCH", "NOTED", "NOVEL", "NUTTY", "NYATA", "NYMPH",
  "OASIS", "OCEAN", "ODDLY", "OFFER", "OLIVE", "OMBAK", "OMBRE", "ONSET",
  "OPERA", "OPTIC", "ORBIT", "ORDER", "OUTER", "OVATE", "PADDY", "PAGAR",
  "PAINT", "PAKIS", "PALSU", "PANAS", "PANCI", "PANEL", "PANSY", "PAPER",
  "PARTY", "PASIF", "PASIR", "PASTA", "PASTY", "PATCH", "PAUSE", "PEACE",
  "PEAKY", "PEARL", "PECEL", "PEDAL", "PENNY", "PENUH", "PEPPY", "PERKY",
  "PERUT", "PETIR", "PETTY", "PHASE", "PHONE", "PHOTO", "PIANO", "PIGGY",
  "PILOT", "PINKY", "PINTU", "PISAU", "PITCH", "PITHY", "PIVOT", "PIXEL",
  "PIZZA", "PLACE", "PLAID", "PLAIN", "PLANE", "PLANT", "PLATE", "PLAZA",
  "PLUCK", "PLUMB", "PLUME", "POHON", "POINT", "POKER", "POLAR", "POMPA",
  "POUFY", "POUND", "POUTY", "POWER", "PRANK", "PRAWN", "PRESS", "PRICE",
  "PRIDE", "PRIME", "PRINT", "PRISM", "PRIVY", "PRIZE", "PROBE", "PROOF",
  "PROUD", "PROVE", "PROWL", "PROXY", "PRUNE", "PSALM", "PULAU", "PULSE",
  "PURGE", "PUTTY", "QUAFF", "QUALM", "QUART", "QUASI", "QUEEN", "QUEST",
  "QUICK", "QUIET", "QUIRK", "QUOTA", "QUOTE", "RADAR", "RADIO", "RAISE",
  "RAJIN", "RALLY", "RAMAH", "RANGE", "RAPID", "RAPUH", "RASPY", "RATIO",
  "RATTY", "RAVEN", "RAWON", "REACH", "READY", "REALM", "REBEL", "REEDY",
  "REGAL", "REIGN", "RELAX", "REMIX", "REPAY", "REPEL", "REPLY", "RESET",
  "RESIN", "RETRO", "RIBUT", "RIDER", "RIGHT", "RIGID", "RINDU", "RISKY",
  "RITZY", "RIVAL", "RIVER", "ROBOT", "ROCKY", "ROGUE", "ROKET", "ROMPI",
  "ROOMY", "ROUGH", "ROUND", "ROWDY", "ROYAL", "RUBAH", "RUDDY", "RUJAK",
  "RULER", "RURAL", "RUSAK", "RUSTY", "SABUK", "SABUN", "SAINT", "SAKIT",
  "SALAK", "SAUCE", "SAUCY", "SAVVY", "SAWAH", "SCALE", "SCALY", "SCANT",
  "SCARE", "SCARY", "SCENE", "SCOPE", "SCORE", "SCOUT", "SEDIH", "SEEDY",
  "SEHAT", "SEIZE", "SEJUK", "SEMUA", "SEMUR", "SEMUT", "SENJA", "SENSE",
  "SERAI", "SERUM", "SETIA", "SEVEN", "SHADE", "SHADY", "SHAFT", "SHAKE",
  "SHAKY", "SHALL", "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP", "SHEEN",
  "SHEEP", "SHEER", "SHELF", "SHELL", "SHIFT", "SHINE", "SHINY", "SHIRT",
  "SHOCK", "SHORE", "SHORT", "SHOUT", "SHRUB", "SIANG", "SIBUK", "SIGHT",
  "SIKAT", "SILKY", "SILLY", "SINCE", "SINGA", "SIREN", "SIRUP", "SISIR",
  "SIXTH", "SKILL", "SKIMP", "SKULL", "SKUNK", "SLATE", "SLAVE", "SLEEP",
  "SLICE", "SLIDE", "SLINK", "SLOPE", "SLOTH", "SMART", "SMOKE", "SMOKY",
  "SNAKE", "SNAKY", "SNOWY", "SOFTY", "SOGGY", "SOLAR", "SOLID", "SOLVE",
  "SONIC", "SOOTY", "SOPIR", "SORRY", "SOUTH", "SPANK", "SPARE", "SPAWN",
  "SPEAK", "SPEAR", "SPEED", "SPELL", "SPEND", "SPEWY", "SPICE", "SPICY",
  "SPIKE", "SPIKY", "SPINE", "SPINY", "SPLIT", "SPOOK", "SPOON", "SPORT",
  "SPRAY", "SPUNK", "SQUAD", "SQUAT", "SQUID", "STACK", "STAFF", "STAGE",
  "STAID", "STAIN", "STAMP", "STAND", "STARE", "START", "STATE", "STEAK",
  "STEAM", "STEED", "STEEL", "STEER", "STICK", "STILL", "STING", "STOCK",
  "STOIC", "STOMP", "STONE", "STONY", "STORE", "STORM", "STORY", "STOUT",
  "STRAP", "STRAY", "STRIP", "STRUM", "STRUT", "STUCK", "STUDY", "STUFF",
  "STYLE", "SUBUH", "SUDAH", "SUDSY", "SUEDE", "SUGAR", "SUITE", "SULKY",
  "SUMUR", "SUNNY", "SUPER", "SURGE", "SURLY", "SWAMP", "SWANK", "SWARM",
  "SWEAR", "SWEEP", "SWEET", "SWIFT", "SWIPE", "SWOON", "SWORD", "TABLE",
  "TACKY", "TAFFY", "TAHUN", "TAJAM", "TAKUT", "TALON", "TANAH", "TANGY",
  "TARDY", "TASTE", "TASTY", "TAUNT", "TAWNY", "TEACH", "TEARY", "TEBAL",
  "TELUR", "TEMPE", "TEMPO", "TENSE", "TENTH", "TEPID", "TERAS", "TERMS",
  "TERSE", "TESTY", "THICK", "THORN", "THREE", "THREW", "THROW", "THUMB",
  "TIANG", "TIDAK", "TIDAL", "TIKAR", "TIKUS", "TIMER", "TIMID", "TIMUR",
  "TINNY", "TIPIS", "TIPPY", "TIPSY", "TIRED", "TITAN", "TITLE", "TOKEN",
  "TOPAN", "TOPSY", "TOTAL", "TOTEM", "TOUGH", "TOWEL", "TOWER", "TOXIC",
  "TRACK", "TRADE", "TRAIL", "TRAIN", "TRAIT", "TRICK", "TROOP", "TROVE",
  "TRUCE", "TRUCK", "TRULY", "TRUNK", "TRUST", "TRUTH", "TUBBY", "TULIP",
  "TUMIT", "TUNIC", "TUPAI", "TURBO", "TUTOR", "TWICE", "TWILL", "TWIST",
  "UDARA", "ULCER", "ULTRA", "UNCLE", "UNDER", "UNIFY", "UNION", "UNITY",
  "UNLIT", "UNMET", "UNTIL", "UNZIP", "UPPER", "USAGE", "UTARA", "VAGUE",
  "VALET", "VALID", "VALUE", "VALVE", "VAPOR", "VAULT", "VAUNT", "VEGAN",
  "VENOM", "VERGE", "VERSE", "VEXED", "VIBES", "VIDEO", "VIGOR", "VILLA",
  "VIRAL", "VIRUS", "VISIT", "VISOR", "VISTA", "VITAL", "VIVID", "VIXEN",
  "VOCAL", "VOTER", "VYING", "WACKY", "WAFER", "WAGED", "WAGER", "WAGON",
  "WAJAN", "WAKEY", "WAKTU", "WANLY", "WARTY", "WASHY", "WASTE", "WATCH",
  "WATER", "WEARY", "WEAVE", "WEDGE", "WEEDY", "WEIRD", "WELLY", "WETLY",
  "WHALE", "WHEEL", "WHERE", "WHICH", "WHILE", "WHINY", "WHITE", "WHOLE",
  "WHOSE", "WIDER", "WIMPY", "WINDY", "WISPY", "WITCH", "WITTY", "WOMAN",
  "WOOZY", "WORLD", "WORMY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND",
  "WRATH", "WRECK", "WRING", "WRIST", "WROTE", "XENON", "XYLEM", "YACHT",
  "YAKIN", "YIELD", "YOUNG", "YOUTH", "ZAMAN", "ZEBRA", "ZESTY", "ZILCH",
  "ZONAL",
];

const ROUND_DURATION_WORDLE = 120;

let wordleState = {
  secretWord  : "",
  guesses     : [],
  isActive    : false,
  roundNumber : 0,
  winner      : null,
  tiktokUser  : "",
  connected   : false,
  roundEndTime: null,
};

let wordleTimer      = null;
let wordleConnection = null;

function wordleGetRandom() {
  return WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
}

function wordleCheck(guess, secret) {
  const result     = Array(5).fill("absent");
  const secUsed    = Array(5).fill(false);
  const guessUsed  = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
      secUsed[i] = guessUsed[i] = true;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (secUsed[j]) continue;
      if (guess[i] === secret[j]) {
        result[i] = "present";
        secUsed[j] = true;
        break;
      }
    }
  }
  return result;
}

function wordleStartRound() {
  if (wordleTimer) { clearTimeout(wordleTimer); wordleTimer = null; }

  wordleState.secretWord   = wordleGetRandom();
  wordleState.guesses      = [];
  wordleState.isActive     = true;
  wordleState.winner       = null;
  wordleState.roundEndTime = Date.now() + ROUND_DURATION_WORDLE * 1000;
  wordleState.roundNumber++;

  console.log(`🟩 [WORDLE] Ronde ${wordleState.roundNumber} — ${wordleState.secretWord}`);

  broadcast({ game: "wordle", type: "NEW_ROUND",
    roundNumber : wordleState.roundNumber,
    duration    : ROUND_DURATION_WORDLE,
    roundEndTime: wordleState.roundEndTime,
  });

  wordleTimer = setTimeout(() => {
    if (!wordleState.isActive) return;
    wordleState.isActive = false;
    broadcast({ game: "wordle", type: "GAME_OVER", word: wordleState.secretWord, totalGuesses: wordleState.guesses.length, reason: "timeout" });
    setTimeout(wordleStartRound, 8000);
  }, ROUND_DURATION_WORDLE * 1000);
}

function wordleProcessGuess(userId, username, word, nickname, avatar) {
  if (!wordleState.isActive) return;
  const w = word.toUpperCase().replace(/[^A-Z]/g, "");
  if (w.length !== 5) return;

  if (wordleState.guesses.some(g => g.userId === userId && g.word === w)) return;

  const result   = wordleCheck(w, wordleState.secretWord);
  const isWinner = result.every(r => r === "correct");
  const guessData = { userId, username, nickname: nickname || username, avatar, word: w, result, timestamp: Date.now(), guessNumber: wordleState.guesses.length + 1 };

  wordleState.guesses.push(guessData);
  console.log(`  ✅ [WORDLE] ${username} → ${w} ${isWinner ? "🏆" : ""}`);

  broadcast({ game: "wordle", type: "NEW_GUESS", guess: guessData, totalGuesses: wordleState.guesses.length });

  if (isWinner) {
    wordleState.isActive = false;
    wordleState.winner   = username;
    if (wordleTimer) { clearTimeout(wordleTimer); wordleTimer = null; }
    setTimeout(() => broadcast({ game: "wordle", type: "GAME_WON", winner: username, nickname: guessData.nickname, avatar, word: wordleState.secretWord, totalGuesses: wordleState.guesses.length }), 500);
    setTimeout(wordleStartRound, 8000);
  }
}


// ============================================================
// WORD VECTORS — dipakai oleh Contexto
// ============================================================
let sekata_vectors = {};
let sekata_vocab   = [];
let sekata_rankMap = {};

const SEKATA_VECTORS_FILE = require("path").join(__dirname, "vectors.vec");
const SEKATA_MAX_WORDS    = 100000;

const SEKATA_SECRET_WORDS = [
  "hutan","gunung","pantai","sungai","danau","laut","hujan","angin","api","tanah",
  "harimau","gajah","ular","burung","ikan","kucing","anjing","singa","kupu","lebah",
  "nasi","rendang","sate","bakso","tempe","kopi","madu","gula","garam","cabai",
  "rumah","pohon","buku","meja","kursi","lampu","pintu","jendela","kunci","cermin",
  "cinta","rindu","bahagia","sedih","marah","takut","bangga","kecewa","senang","lelah",
  "guru","dokter","petani","nelayan","polisi","pilot","hakim","aktor","musisi","penulis",
  "batik","wayang","gamelan","angklung","reog","kebaya","sarung","keraton","candi","pura",
  "udara","langit","bintang","bulan","matahari","waktu","mimpi","harapan","semangat","berani",
];

async function sekataLoadVectors() {
  if (!require("fs").existsSync(SEKATA_VECTORS_FILE)) {
    console.warn("⚠️  vectors.vec tidak ada → mode DEMO");
    sekataLoadDemo();
    return;
  }
  console.log("📖 Loading vectors...");
  const t0 = Date.now();
  const rl = require("readline").createInterface({ input: require("fs").createReadStream(SEKATA_VECTORS_FILE, { encoding: "utf8" }), crlfDelay: Infinity });
  let n = 0;
  for await (const line of rl) {
    if (n === 0) { n++; continue; }
    if (n > SEKATA_MAX_WORDS) break;
    const sp = line.indexOf(" ");
    if (sp === -1) continue;
    const word  = line.slice(0, sp).toLowerCase();
    const parts = line.slice(sp + 1).trimEnd().split(" ");
    const vec   = new Float32Array(parts.length);
    for (let i = 0; i < parts.length; i++) vec[i] = parseFloat(parts[i]);
    sekata_vectors[word] = vec;
    sekata_vocab.push(word);
    n++;
  }
  console.log(`✅ Vectors: ${sekata_vocab.length} kata dalam ${((Date.now()-t0)/1000).toFixed(1)}s`);
}

function sekataLoadDemo() {
  const DIM = 50;
  const groups = [
    ["nasi","makan","lauk","minum","kopi","teh","bubur","soto","bakso","rendang","gulai","sate","tempe","tahu","ikan","ayam","daging","telur","susu","roti","gula","garam","bumbu","sambal","minyak","bawang","cabai","tomat","pisang","mangga","apel","jeruk","durian","kelapa","pepaya","semangka","nanas","anggur","alpukat","rambutan"],
    ["hutan","pohon","daun","bunga","akar","rumput","lumut","batu","tanah","pasir","air","sungai","danau","laut","pantai","gunung","bukit","lembah","sawah","ladang","kebun","taman","matahari","bulan","bintang","awan","hujan","angin","petir","badai","gempa","banjir","musim","cuaca","langit","udara","alam","hewan","tumbuhan","bumi"],
    ["anjing","kucing","sapi","kuda","kambing","domba","ayam","bebek","burung","ikan","ular","buaya","harimau","gajah","singa","beruang","monyet","kelinci","tikus","kelelawar","kupu","lebah","semut","nyamuk","lalat","capung","kodok","katak","penyu","lumba","paus","hiu","elang","merpati","nuri","rajawali","rusa","babi","macan","serigala"],
    ["ayah","ibu","anak","kakak","adik","kakek","nenek","paman","bibi","sepupu","keponakan","saudara","suami","istri","menantu","mertua","ipar","keluarga","orang","manusia","bayi","balita","remaja","dewasa","lansia","teman","sahabat","kawan","tetangga","kolega"],
    ["rumah","gedung","kantor","sekolah","masjid","gereja","hotel","restoran","toko","pasar","bank","stasiun","bandara","pelabuhan","terminal","garasi","dapur","kamar","ruang","teras","atap","dinding","lantai","pintu","jendela","tangga","sumur","pagar","tembok","tiang"],
    ["senang","sedih","marah","takut","cemas","bahagia","gembira","kecewa","malu","bangga","rindu","cinta","sayang","benci","iri","heran","kagum","bingung","lelah","sehat","sakit","lapar","kenyang","segar","galau","gundah","resah","tenang","damai","syukur"],
    ["guru","dokter","perawat","polisi","tentara","petani","nelayan","pedagang","sopir","pilot","insinyur","arsitek","akuntan","pengacara","hakim","jaksa","menteri","presiden","artis","penyanyi","aktor","musisi","pelukis","penulis","jurnalis","peneliti","ilmuwan","pengusaha","bidan","apoteker"],
    ["komputer","laptop","ponsel","tablet","internet","aplikasi","program","kode","data","server","wifi","listrik","baterai","layar","keyboard","mouse","printer","kamera","televisi","radio","speaker","drone","robot","satelit","roket","teknologi","digital","virtual","online","media"],
    ["merah","biru","hijau","kuning","putih","hitam","ungu","oranye","coklat","abu","pink","tosca","maroon","navy","gold","silver","cream","beige","violet","magenta"],
    ["batik","kebaya","sarung","songket","wayang","gamelan","angklung","kecak","reog","saman","adat","budaya","tradisi","ritual","upacara","perayaan","merdeka","pancasila","bendera","garuda","keraton","candi","pura","masjid","keris","mahkota","singgasana","tari","musik","seni"],
  ];
  const rand = (s, i) => { const x = Math.sin(s*127.1+i*311.7)*43758.5453; return x-Math.floor(x); };
  groups.forEach((group, gi) => {
    const base = new Float32Array(DIM);
    for (let d = 0; d < DIM; d++) base[d] = rand(gi*100+d,0)*2-1;
    const mag = Math.sqrt(base.reduce((s,v)=>s+v*v,0));
    for (let d = 0; d < DIM; d++) base[d] /= mag;
    group.forEach((word, wi) => {
      const vec = new Float32Array(DIM);
      for (let d = 0; d < DIM; d++) vec[d] = base[d]*0.8+(rand(gi*1000+wi*37+d,1)*2-1)*0.2;
      const m2 = Math.sqrt(vec.reduce((s,v)=>s+v*v,0));
      for (let d = 0; d < DIM; d++) vec[d] /= m2;
      sekata_vectors[word] = vec;
      sekata_vocab.push(word);
    });
  });
  console.log(`✅ Demo vectors: ${sekata_vocab.length} kata`);
}

function sekataCosine(a, b) {
  let dot=0, ma=0, mb=0;
  for (let i=0; i<a.length; i++) { dot+=a[i]*b[i]; ma+=a[i]*a[i]; mb+=b[i]*b[i]; }
  return (ma===0||mb===0) ? 0 : dot/(Math.sqrt(ma)*Math.sqrt(mb));
}

function sekataComputeRankings(secret) {
  const sv = sekata_vectors[secret.toLowerCase()];
  if (!sv) return false;
  const sims = sekata_vocab.map(w => ({ w, s: sekataCosine(sekata_vectors[w], sv) }));
  sims.sort((a,b) => b.s - a.s);
  sekata_rankMap = {};
  sims.forEach((item, i) => { sekata_rankMap[item.w] = i+1; });
  return true;
}

function sekataGetRank(word) { return sekata_rankMap[word.toLowerCase()] ?? null; }

// ============================================================
// ██████╗ ██████╗ ███╗   ██╗████████╗███████╗██╗  ██╗████████╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██╔═══██╗
// ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗   ╚███╔╝    ██║   ██║   ██║
// ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝   ██╔██╗    ██║   ██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██╔╝ ██╗   ██║   ╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝
// ============================================================

// Contexto memakai vocabulary & vector yang SAMA dengan Sekata Buta
// tapi state game terpisah sepenuhnya

const ROUND_DURATION_CONTEXTO = 120;

let contextoState = {
  secretWord  : "",
  guesses     : [],
  isActive    : false,
  roundNumber : 0,
  winner      : null,
  tiktokUser  : "",
  connected   : false,
  roundEndTime: null,
  totalWords  : 0,
};

let contextoTimer      = null;
let contextoConnection = null;

async function contextoStartRound() {
  if (contextoTimer) { clearTimeout(contextoTimer); contextoTimer = null; }

  let secret, ok = false, attempts = 0;
  do {
    secret = SEKATA_SECRET_WORDS[Math.floor(Math.random()*SEKATA_SECRET_WORDS.length)];
    ok = sekataComputeRankings(secret);
    attempts++;
  } while (!ok && attempts < 10);

  if (!ok) { console.error("[CONTEXTO] Tidak bisa pilih kata rahasia!"); return; }

  contextoState.secretWord   = secret;
  contextoState.guesses      = [];
  contextoState.isActive     = true;
  contextoState.winner       = null;
  contextoState.roundEndTime = Date.now() + ROUND_DURATION_CONTEXTO * 1000;
  contextoState.roundNumber++;
  contextoState.totalWords   = sekata_vocab.length;

  console.log(`🟣 [CONTEXTO] Ronde ${contextoState.roundNumber} — ${secret}`);

  broadcast({ game: "contexto", type: "NEW_ROUND",
    roundNumber : contextoState.roundNumber,
    duration    : ROUND_DURATION_CONTEXTO,
    roundEndTime: contextoState.roundEndTime,
    totalWords  : sekata_vocab.length,
  });

  contextoTimer = setTimeout(() => {
    if (!contextoState.isActive) return;
    contextoState.isActive = false;
    broadcast({ game: "contexto", type: "GAME_OVER", word: contextoState.secretWord, totalGuesses: contextoState.guesses.length, reason: "timeout" });
    setTimeout(contextoStartRound, 8000);
  }, ROUND_DURATION_CONTEXTO * 1000);
}

function contextoProcessGuess(userId, username, word, nickname, avatar) {
  if (!contextoState.isActive) return;
  const w = word.toLowerCase().trim();
  if (!w || w.length < 2) return;

  if (contextoState.guesses.some(g => g.userId === userId && g.word === w)) return;

  const rank     = sekataGetRank(w);
  const isWinner = w === contextoState.secretWord.toLowerCase();
  const guessData = { userId, username, nickname: nickname||username, avatar, word: w, rank, isWinner, timestamp: Date.now() };

  contextoState.guesses.push(guessData);
  console.log(`  📊 [CONTEXTO] ${username} → "${w}" rank #${rank} ${isWinner?"🏆":""}`);

  if (rank === null) { broadcast({ game: "contexto", type: "WORD_UNKNOWN", username, word: w }); return; }

  broadcast({ game: "contexto", type: "NEW_GUESS", guess: guessData, totalGuesses: contextoState.guesses.length });

  if (isWinner) {
    contextoState.isActive = false;
    contextoState.winner   = username;
    if (contextoTimer) { clearTimeout(contextoTimer); contextoTimer = null; }
    setTimeout(() => broadcast({ game: "contexto", type: "GAME_WON", winner: username, nickname: guessData.nickname, avatar, word: contextoState.secretWord, totalGuesses: contextoState.guesses.length }), 500);
    setTimeout(contextoStartRound, 10000);
  }
}


// ============================================================
// ██████╗ ██╗   ██╗██╗███████╗
// ██╔═══██╗██║   ██║██║╚══███╔╝
// ██║   ██║██║   ██║██║  ███╔╝
// ██║▄▄ ██║██║   ██║██║ ███╔╝
// ╚██████╔╝╚██████╔╝██║███████╗
//  ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝
// ============================================================

const QUESTION_DURATION = 30; // detik per soal

// Bank soal default (streamer bisa tambah via API)
const DEFAULT_QUESTIONS = [
  { q: "Ibu kota Indonesia?", a: ["jakarta"] },
  { q: "Berapa 7 × 8?", a: ["56"] },
  { q: "Bahasa resmi Brasil?", a: ["portugis","portuguese"] },
  { q: "Planet terbesar di tata surya?", a: ["jupiter"] },
  { q: "Siapa penemu telepon?", a: ["graham bell","alexander bell","bell"] },
  { q: "Gunung tertinggi di Indonesia?", a: ["puncak jaya","carstensz","cartensz"] },
  { q: "Mata uang Jepang?", a: ["yen"] },
  { q: "Berapa sisi segitiga?", a: ["3","tiga"] },
  { q: "Nama lain vitamin C?", a: ["asam askorbat","ascorbic acid"] },
  { q: "Negara terluas di dunia?", a: ["rusia","russia"] },
  { q: "Berapa 12 × 12?", a: ["144"] },
  { q: "Benua terkecil di dunia?", a: ["australia"] },
  { q: "Tanggal kemerdekaan Indonesia?", a: ["17 agustus","17-8-1945","17 agustus 1945"] },
  { q: "Warna bendera Indonesia?", a: ["merah putih"] },
  { q: "Sungai terpanjang di dunia?", a: ["nil","nile"] },
  { q: "Berapa planet di tata surya?", a: ["8","delapan"] },
  { q: "Apa singkatan dari DNA?", a: ["deoxyribonucleic acid","asam deoksiribonukleat"] },
  { q: "Presiden pertama Indonesia?", a: ["soekarno","sukarno"] },
  { q: "Berapa sudut dalam segitiga sama sisi?", a: ["60","60 derajat"] },
  { q: "Gas terbanyak di atmosfer bumi?", a: ["nitrogen"] },

  // === GEOGRAFI ===
  { q: "Ibu kota Australia?", a: ["canberra"] },
  { q: "Ibu kota Jepang?", a: ["tokyo"] },
  { q: "Ibu kota Korea Selatan?", a: ["seoul"] },
  { q: "Ibu kota Mesir?", a: ["kairo","cairo"] },
  { q: "Negara terkecil di dunia?", a: ["vatikan","vatican"] },
  { q: "Gunung tertinggi di dunia?", a: ["everest","mount everest"] },
  { q: "Danau terbesar di dunia?", a: ["kaspia","laut kaspia","caspian"] },
  { q: "Samudra terbesar di dunia?", a: ["pasifik","samudra pasifik"] },
  { q: "Negara dengan penduduk terbanyak di dunia?", a: ["india"] },
  { q: "Sungai terpanjang di Amerika Selatan?", a: ["amazon"] },
  { q: "Ibu kota Brasil?", a: ["brasilia"] },
  { q: "Berapa provinsi di Indonesia?", a: ["38"] },
  { q: "Pulau terbesar di Indonesia?", a: ["kalimantan","borneo"] },
  { q: "Ibu kota Turki?", a: ["ankara"] },
  { q: "Gurun terluas di dunia?", a: ["sahara"] },

  // === SEJARAH INDONESIA ===
  { q: "Siapa proklamator kemerdekaan Indonesia?", a: ["soekarno hatta","sukarno hatta","bung karno bung hatta"] },
  { q: "Tahun berapa Indonesia merdeka?", a: ["1945"] },
  { q: "Siapa presiden kedua Indonesia?", a: ["soeharto","suharto"] },
  { q: "Apa nama kerajaan Hindu tertua di Indonesia?", a: ["kutai"] },
  { q: "Di mana Konferensi Asia Afrika 1955 diadakan?", a: ["bandung"] },
  { q: "Siapa pahlawan dari Aceh yang terkenal?", a: ["cut nyak dien","cut nyak din","teuku umar"] },
  { q: "Apa nama perjanjian yang mengakui kedaulatan Indonesia dari Belanda?", a: ["roem royen","kmi","konferensi meja bundar"] },
  { q: "Siapa pendiri Budi Utomo?", a: ["wahidin sudirohusodo","soetomo"] },
  { q: "Siapa pahlawan dari Surabaya yang terkenal?", a: ["bung tomo"] },
  { q: "Pada tahun berapa Sumpah Pemuda diikrarkan?", a: ["1928"] },

  // === SAINS & ALAM ===
  { q: "Apa rumus kimia air?", a: ["h2o"] },
  { q: "Berapa kecepatan cahaya (km/s)?", a: ["300000","300.000"] },
  { q: "Planet terdekat dari Matahari?", a: ["merkurius","mercury"] },
  { q: "Apa nama tulang paha dalam bahasa medis?", a: ["femur"] },
  { q: "Gas apa yang dihasilkan tanaman saat fotosintesis?", a: ["oksigen","o2"] },
  { q: "Apa nama ilmuwan yang menemukan gravitasi dari apel jatuh?", a: ["newton","isaac newton"] },
  { q: "Berapa suhu normal tubuh manusia (Celsius)?", a: ["37","37 derajat"] },
  { q: "Atom terkecil di alam semesta disebut?", a: ["kuark","quark"] },
  { q: "Hewan apa yang memiliki DNA paling mirip dengan manusia?", a: ["simpanse","chimpanzee"] },
  { q: "Apa nama lapisan terluar bumi?", a: ["kerak","kerak bumi","crust"] },
  { q: "Vitamin D dihasilkan tubuh dari?", a: ["sinar matahari","sinar uv","matahari"] },
  { q: "Berapa jumlah kromosom manusia?", a: ["46"] },
  { q: "Apa nama proses berubahnya ulat menjadi kupu-kupu?", a: ["metamorfosis"] },
  { q: "Planet mana yang punya cincin paling terkenal?", a: ["saturnus","saturn"] },
  { q: "Apa unsur kimia dengan simbol Au?", a: ["emas","gold"] },

  // === MATEMATIKA ===
  { q: "Berapa hasil 15 × 15?", a: ["225"] },
  { q: "Berapa akar kuadrat dari 144?", a: ["12"] },
  { q: "Berapa 100 dibagi 8?", a: ["12.5","12,5","12 setengah"] },
  { q: "Berapa 2 pangkat 10?", a: ["1024"] },
  { q: "Berapa luas lingkaran dengan jari-jari 7? (π=22/7)", a: ["154"] },
  { q: "Berapa sudut dalam pentagon (segi lima)?", a: ["540","540 derajat"] },
  { q: "Berapa bilangan prima setelah 17?", a: ["19"] },
  { q: "Berapa 1000 – 369?", a: ["631"] },

  // === POP CULTURE & HIBURAN ===
  { q: "Film animasi Disney tentang putri salju?", a: ["frozen"] },
  { q: "Siapa penulis Harry Potter?", a: ["jk rowling","joanne rowling","j.k. rowling"] },
  { q: "Karakter utama anime Naruto bermarga apa?", a: ["uzumaki"] },
  { q: "Siapa vokalis grup musik BTS yang paling populer?", a: ["jungkook","jung kook"] },
  { q: "Film Marvel tentang manusia laba-laba?", a: ["spiderman","spider-man","spider man"] },
  { q: "Siapa pemilik perusahaan Tesla?", a: ["elon musk"] },
  { q: "Aplikasi media sosial berbasis video pendek populer?", a: ["tiktok","tik tok"] },
  { q: "Game battle royale buatan Garena?", a: ["free fire","freefire"] },
  { q: "Apa nama planet dalam film Avatar?", a: ["pandora"] },
  { q: "Siapa penyanyi lagu 'Shape of You'?", a: ["ed sheeran"] },

  // === KULINER & BUDAYA ===
  { q: "Rendang berasal dari daerah mana?", a: ["minangkabau","sumatera barat","padang"] },
  { q: "Batik berasal dari negara mana?", a: ["indonesia"] },
  { q: "Apa nama tarian tradisional dari Bali?", a: ["kecak","legong","pendet"] },
  { q: "Makanan khas Yogyakarta yang terbuat dari beras ketan?", a: ["gudeg"] },
  { q: "Wayang golek berasal dari daerah mana?", a: ["jawa barat","sunda"] },
  { q: "Angklung terbuat dari bahan apa?", a: ["bambu"] },
  { q: "Apa nama rumah adat Toraja?", a: ["tongkonan"] },
  { q: "Senjata tradisional dari Jawa yang berbentuk berliku?", a: ["keris"] },

  // === BATCH TAMBAHAN ===
  { q: "Berapa 25 × 25?", a: ["625"] },
  { q: "Berapa 17 × 13?", a: ["221"] },
  { q: "Berapa akar kuadrat dari 225?", a: ["15"] },
  { q: "Berapa 3 pangkat 5?", a: ["243"] },
  { q: "Berapa 11 × 11?", a: ["121"] },
  { q: "Berapa 999 + 111?", a: ["1110"] },
  { q: "Berapa 1000 ÷ 25?", a: ["40"] },
  { q: "Berapa 64 ÷ 8?", a: ["8"] },
  { q: "Berapa 13 × 7?", a: ["91"] },
  { q: "Berapa 18 × 18?", a: ["324"] },
  { q: "Berapa 5 pangkat 4?", a: ["625"] },
  { q: "Berapa akar kuadrat dari 169?", a: ["13"] },
  { q: "Berapa 21 × 21?", a: ["441"] },
  { q: "Berapa 250 × 4?", a: ["1000"] },
  { q: "Berapa bilangan prima ke-10?", a: ["29"] },
  { q: "Berapa 2 pangkat 8?", a: ["256"] },
  { q: "Berapa sudut dalam segitiga siku-siku yang lain jika satu sudutnya 35°?", a: ["55","55 derajat"] },
  { q: "Berapa FPB dari 48 dan 36?", a: ["12"] },
  { q: "Berapa KPK dari 4 dan 6?", a: ["12"] },
  { q: "Berapa 100% dari 250?", a: ["250"] },
  { q: "Berapa 50% dari 80?", a: ["40"] },
  { q: "Berapa 25% dari 200?", a: ["50"] },
  { q: "Berapa 75% dari 400?", a: ["300"] },
  { q: "Berapa 1/3 dari 99?", a: ["33"] },
  { q: "Berapa 3/4 dari 120?", a: ["90"] },
  { q: "Berapa luas persegi dengan sisi 12cm?", a: ["144","144 cm2","144cm2"] },
  { q: "Berapa keliling lingkaran dengan diameter 14? (π=22/7)", a: ["44"] },
  { q: "Berapa volume kubus dengan sisi 5?", a: ["125"] },
  { q: "Berapa bilangan prima antara 20 dan 30?", a: ["23 dan 29","23,29","29 dan 23"] },
  { q: "Berapa 1001 − 492?", a: ["509"] },
  { q: "Berapa 144 ÷ 12?", a: ["12"] },
  { q: "Berapa persen dari 30 terhadap 150?", a: ["20","20%"] },
  { q: "Berapa 0,25 × 400?", a: ["100"] },
  { q: "Jika keliling persegi 48 cm, berapa sisinya?", a: ["12","12 cm"] },
  { q: "Berapa 4 pangkat 4?", a: ["256"] },
  { q: "Ibu kota Argentina?", a: ["buenos aires"] },
  { q: "Ibu kota Kanada?", a: ["ottawa"] },
  { q: "Ibu kota Afrika Selatan (legislatif)?", a: ["cape town","kapstadt"] },
  { q: "Ibu kota Portugal?", a: ["lisbon","lisabon"] },
  { q: "Ibu kota Norwegia?", a: ["oslo"] },
  { q: "Ibu kota Swedia?", a: ["stockholm"] },
  { q: "Ibu kota Swiss?", a: ["bern"] },
  { q: "Ibu kota Belanda?", a: ["amsterdam"] },
  { q: "Ibu kota Belgia?", a: ["brussels","brussel"] },
  { q: "Ibu kota Austria?", a: ["wina","vienna"] },
  { q: "Ibu kota Polandia?", a: ["warsawa","warsaw"] },
  { q: "Ibu kota Ceko?", a: ["praha","prague"] },
  { q: "Ibu kota Yunani?", a: ["athena","athens"] },
  { q: "Ibu kota Hungaria?", a: ["budapest"] },
  { q: "Ibu kota Romania?", a: ["bukares","bucharest"] },
  { q: "Ibu kota Ukraina?", a: ["kyiv","kiev"] },
  { q: "Ibu kota Arab Saudi?", a: ["riyadh"] },
  { q: "Ibu kota Iran?", a: ["teheran","tehran"] },
  { q: "Ibu kota Irak?", a: ["baghdad"] },
  { q: "Ibu kota Pakistan?", a: ["islamabad"] },
  { q: "Ibu kota Bangladesh?", a: ["dhaka"] },
  { q: "Ibu kota Sri Lanka?", a: ["colombo","sri jayawardenepura"] },
  { q: "Ibu kota Nepal?", a: ["kathmandu"] },
  { q: "Ibu kota Thailand?", a: ["bangkok"] },
  { q: "Ibu kota Vietnam?", a: ["hanoi"] },
  { q: "Ibu kota Filipina?", a: ["manila"] },
  { q: "Ibu kota Malaysia?", a: ["kuala lumpur"] },
  { q: "Ibu kota Singapura?", a: ["singapura","singapore"] },
  { q: "Ibu kota Myanmar?", a: ["naypyidaw"] },
  { q: "Ibu kota Kamboja?", a: ["phnom penh"] },
  { q: "Ibu kota Laos?", a: ["vientiane"] },
  { q: "Ibu kota Meksiko?", a: ["meksiko city","mexico city"] },
  { q: "Ibu kota Peru?", a: ["lima"] },
  { q: "Ibu kota Kolombia?", a: ["bogota"] },
  { q: "Ibu kota Venezuela?", a: ["caracas"] },
  { q: "Ibu kota Chile?", a: ["santiago"] },
  { q: "Ibu kota Nigeria?", a: ["abuja"] },
  { q: "Ibu kota Kenya?", a: ["nairobi"] },
  { q: "Ibu kota Ethiopia?", a: ["addis ababa"] },
  { q: "Ibu kota Ghana?", a: ["accra"] },
  { q: "Ibu kota Tanzania?", a: ["dodoma"] },
  { q: "Ibu kota Maroko?", a: ["rabat"] },
  { q: "Ibu kota Tunisia?", a: ["tunis"] },
  { q: "Ibu kota Aljazair?", a: ["algiers","aljir"] },
  { q: "Gunung berapi tertinggi di dunia?", a: ["ojos del salado","mauna kea"] },
  { q: "Selat antara Sumatera dan Jawa?", a: ["selat sunda"] },
  { q: "Selat antara Jawa dan Bali?", a: ["selat bali"] },
  { q: "Danau terbesar di Indonesia?", a: ["danau toba","toba"] },
  { q: "Sungai terpanjang di Kalimantan?", a: ["sungai kapuas","kapuas"] },
  { q: "Pulau terkecil yang dihuni di Indonesia?", a: ["pulau pasoso","pasoso"] },
  { q: "Berapa jumlah pulau di Indonesia (resmi)?", a: ["17000","17504","17508","lebih dari 17000"] },
  { q: "Gunung tertinggi di Jawa?", a: ["semeru","mahameru"] },
  { q: "Gunung tertinggi di Sumatera?", a: ["kerinci"] },
  { q: "Gunung tertinggi di Sulawesi?", a: ["latimojong"] },
  { q: "Benua yang tidak memiliki negara?", a: ["antartika","antarctica"] },
  { q: "Negara dengan garis pantai terpanjang?", a: ["kanada","canada"] },
  { q: "Danau terdalam di dunia?", a: ["baikal","danau baikal"] },
  { q: "Air terjun tertinggi di dunia?", a: ["angel falls","air terjun angel"] },
  { q: "Padang gurun terbesar di Asia?", a: ["gobi"] },
  { q: "Apa lambang kimia emas?", a: ["au"] },
  { q: "Apa lambang kimia perak?", a: ["ag"] },
  { q: "Apa lambang kimia besi?", a: ["fe"] },
  { q: "Apa lambang kimia tembaga?", a: ["cu"] },
  { q: "Apa lambang kimia timah?", a: ["sn"] },
  { q: "Apa lambang kimia raksa/merkuri?", a: ["hg"] },
  { q: "Apa lambang kimia natrium?", a: ["na"] },
  { q: "Apa lambang kimia kalium?", a: ["k"] },
  { q: "Apa lambang kimia kalsium?", a: ["ca"] },
  { q: "Berapa nomor atom oksigen?", a: ["8"] },
  { q: "Berapa nomor atom hidrogen?", a: ["1"] },
  { q: "Berapa nomor atom karbon?", a: ["6"] },
  { q: "Berapa nomor atom nitrogen?", a: ["7"] },
  { q: "Apa nama ilmuwan yang menemukan teori relativitas?", a: ["einstein","albert einstein"] },
  { q: "Apa nama ilmuwan yang menemukan vaksin pertama?", a: ["edward jenner","jenner"] },
  { q: "Apa nama ilmuwan yang menemukan penisilin?", a: ["alexander fleming","fleming"] },
  { q: "Apa nama partikel yang membawa muatan negatif?", a: ["elektron"] },
  { q: "Apa nama partikel yang membawa muatan positif di inti?", a: ["proton"] },
  { q: "Apa nama partikel netral di inti atom?", a: ["neutron"] },
  { q: "Berapa titik didih air dalam derajat Celsius?", a: ["100","100 derajat"] },
  { q: "Berapa titik beku air dalam derajat Celsius?", a: ["0","0 derajat"] },
  { q: "Organ apa yang memompa darah?", a: ["jantung"] },
  { q: "Organ apa yang menyaring darah?", a: ["ginjal"] },
  { q: "Organ apa yang menghasilkan empedu?", a: ["hati","liver"] },
  { q: "Organ apa yang memproduksi insulin?", a: ["pankreas"] },
  { q: "Berapa jumlah tulang pada manusia dewasa?", a: ["206"] },
  { q: "Tulang terpanjang dalam tubuh manusia?", a: ["femur","tulang paha"] },
  { q: "Tulang terkecil dalam tubuh manusia?", a: ["stapes","tulang sanggurdi"] },
  { q: "Apa nama lapisan ozon yang melindungi bumi?", a: ["stratosfer"] },
  { q: "Berapa lama cahaya dari matahari sampai ke bumi?", a: ["8 menit","8 menit 20 detik"] },
  { q: "Planet yang berputar terbalik (berlawanan jarum jam)?", a: ["venus"] },
  { q: "Berapa jarak bumi ke bulan (km)?", a: ["384400","384000"] },
  { q: "Apa nama proses berubahnya cairan menjadi gas?", a: ["penguapan","evaporasi"] },
  { q: "Apa nama proses berubahnya gas menjadi cairan?", a: ["kondensasi","pengembunan"] },
  { q: "Apa nama proses berubahnya padat langsung ke gas?", a: ["sublimasi"] },
  { q: "Hukum gravitasi ditemukan oleh siapa?", a: ["newton","isaac newton"] },
  { q: "Satuan kekuatan gempa?", a: ["skala richter","richter","magnitudo"] },
  { q: "Apa nama ilmu yang mempelajari bintang?", a: ["astronomi"] },
  { q: "Apa nama ilmu yang mempelajari fosil?", a: ["paleontologi"] },
  { q: "Apa nama ilmu yang mempelajari cuaca?", a: ["meteorologi"] },
  { q: "Apa nama ilmu yang mempelajari gempa?", a: ["seismologi"] },
  { q: "Apa nama ilmu yang mempelajari jamur?", a: ["mikologi"] },
  { q: "Apa nama ilmu yang mempelajari serangga?", a: ["entomologi"] },
  { q: "Apa nama bintang terdekat dengan matahari?", a: ["proxima centauri","alfa centauri"] },
  { q: "Galaksi tempat bumi berada?", a: ["bima sakti","milky way"] },
  { q: "Berapa kecepatan suara di udara (m/s)?", a: ["340","343"] },
  { q: "Apa itu DNA?", a: ["asam deoksiribonukleat","deoxyribonucleic acid","materi genetik"] },
  { q: "Siapa ilmuwan yang menemukan struktur DNA?", a: ["watson dan crick","crick dan watson","james watson","francis crick"] },
  { q: "Apa nama proses pembelahan sel pada reproduksi seksual?", a: ["meiosis"] },
  { q: "Apa nama proses pembelahan sel biasa?", a: ["mitosis"] },
  { q: "Apa nama pembuluh darah yang membawa darah ke jantung?", a: ["vena"] },
  { q: "Apa nama pembuluh darah yang membawa darah dari jantung?", a: ["arteri"] },
  { q: "Perang dunia pertama berlangsung tahun berapa?", a: ["1914-1918","1914 sampai 1918"] },
  { q: "Perang dunia kedua berakhir tahun?", a: ["1945"] },
  { q: "Siapa pemimpin Nazi Jerman?", a: ["hitler","adolf hitler"] },
  { q: "Siapa presiden Amerika Serikat pertama?", a: ["george washington","washington"] },
  { q: "Siapa penemu benua Amerika (Eropa)?", a: ["columbus","christopher columbus"] },
  { q: "Peristiwa bom atom di kota mana di Jepang pertama?", a: ["hiroshima"] },
  { q: "Siapa tokoh revolusi Prancis yang terkenal?", a: ["napoleon","napoleon bonaparte","robespierre"] },
  { q: "Tembok Besar ada di negara mana?", a: ["china","cina","tiongkok"] },
  { q: "Koloseum berada di kota?", a: ["roma","rome"] },
  { q: "Menara Eiffel ada di kota?", a: ["paris"] },
  { q: "Patung Liberty ada di kota?", a: ["new york"] },
  { q: "Piramida Giza berada di negara?", a: ["mesir","egypt"] },
  { q: "Taj Mahal berada di negara?", a: ["india"] },
  { q: "Siapa penemu mesin uap?", a: ["james watt","watt"] },
  { q: "Siapa penemu bola lampu?", a: ["thomas edison","edison"] },
  { q: "Siapa penemu radio?", a: ["marconi","guglielmo marconi"] },
  { q: "Siapa penemu pesawat terbang?", a: ["wright bersaudara","wright brothers","orville wright","wilbur wright"] },
  { q: "Siapa penemu mesin cetak?", a: ["gutenberg","johannes gutenberg"] },
  { q: "Revolusi Industri pertama kali terjadi di?", a: ["inggris","britania raya"] },
  { q: "Peristiwa jatuhnya Tembok Berlin terjadi tahun?", a: ["1989"] },
  { q: "Uni Soviet bubar tahun?", a: ["1991"] },
  { q: "Tahun berapa Neil Armstrong mendarat di bulan?", a: ["1969"] },
  { q: "Siapa astronaut pertama yang pergi ke luar angkasa?", a: ["yuri gagarin","gagarin"] },
  { q: "Olimpiade modern pertama diselenggarakan di?", a: ["athena","athens","yunani"] },
  { q: "Piala Dunia pertama kali diadakan tahun?", a: ["1930"] },
  { q: "Perang Diponegoro berlangsung tahun?", a: ["1825-1830","1825 sampai 1830"] },
  { q: "VOC didirikan tahun?", a: ["1602"] },
  { q: "Penjajahan Belanda di Indonesia berakhir tahun?", a: ["1945"] },
  { q: "Sidang BPUPKI pertama berlangsung kapan?", a: ["29 mei 1945","29 mei"] },
  { q: "Pancasila lahir pada tanggal?", a: ["1 juni","1 juni 1945"] },
  { q: "Apa antonim dari kata 'rajin'?", a: ["malas","pemalas"] },
  { q: "Apa antonim dari kata 'gelap'?", a: ["terang","cahaya"] },
  { q: "Apa sinonim dari kata 'cantik'?", a: ["indah","molek","rupawan","elok"] },
  { q: "Apa sinonim dari kata 'besar'?", a: ["agung","raya","akbar"] },
  { q: "Apa arti kata 'ambiguitas'?", a: ["makna ganda","bermakna dua","tidak jelas"] },
  { q: "Apa kepanjangan dari KKN?", a: ["kuliah kerja nyata","korupsi kolusi nepotisme"] },
  { q: "Apa kepanjangan dari BPJS?", a: ["badan penyelenggara jaminan sosial"] },
  { q: "Apa kepanjangan dari TNI?", a: ["tentara nasional indonesia"] },
  { q: "Apa kepanjangan dari POLRI?", a: ["kepolisian negara republik indonesia"] },
  { q: "Apa kepanjangan dari DPRD?", a: ["dewan perwakilan rakyat daerah"] },
  { q: "Apa kepanjangan dari BPS?", a: ["badan pusat statistik"] },
  { q: "Bahasa daerah dengan penutur terbanyak di Indonesia?", a: ["jawa","bahasa jawa"] },
  { q: "Sumpah Pemuda berbunyi apa pada butir pertama?", a: ["satu nusa","bertanah air satu","kami bertumpah darah yang satu"] },
  { q: "Lagu kebangsaan Indonesia diciptakan oleh?", a: ["wage rudolf supratman","wr supratman","w.r. supratman"] },
  { q: "Lagu 'Garuda Pancasila' diciptakan oleh?", a: ["sudharnoto"] },
  { q: "Berapa jumlah pemain bola dalam satu tim?", a: ["11"] },
  { q: "Berapa jumlah pemain basket dalam satu tim?", a: ["5"] },
  { q: "Berapa jumlah pemain voli dalam satu tim?", a: ["6"] },
  { q: "Berapa jumlah set dalam pertandingan tenis Wimbledon putra?", a: ["5","best of 5"] },
  { q: "Berapa lama pertandingan sepak bola normal?", a: ["90 menit"] },
  { q: "Olahraga apa yang menggunakan shuttlecock?", a: ["bulu tangkis","badminton"] },
  { q: "Siapa pemain bola terbanyak meraih Ballon d'Or?", a: ["messi","lionel messi"] },
  { q: "Indonesia juara Piala Thomas pertama kali tahun?", a: ["1958"] },
  { q: "Siapa petinju dunia terkenal asal Amerika yang disebut The Greatest?", a: ["muhammad ali","ali","cassius clay"] },
  { q: "Negara asal olahraga sumo?", a: ["jepang"] },
  { q: "Negara asal olahraga kriket?", a: ["inggris"] },
  { q: "Negara asal olahraga baseball?", a: ["Amerika Serikat","AS","USA"] },
  { q: "Lari maraton jaraknya berapa km?", a: ["42","42.195","42 km"] },
  { q: "Siapa perenang tercepat sepanjang masa (8 emas olimpiade)?", a: ["michael phelps","phelps"] },
  { q: "Tenis meja berasal dari negara mana?", a: ["inggris"] },
  { q: "Senam ritmik menggunakan alat apa?", a: ["pita","bola","simpai","gada","tali"] },
  { q: "Pertandingan tinju berlangsung berapa ronde (profesional)?", a: ["12","12 ronde"] },
  { q: "Siapa pelari tercepat 100m di dunia (rekor)?", a: ["usain bolt","bolt"] },
  { q: "Rekor 100m Usain Bolt adalah?", a: ["9.58","9.58 detik"] },
  { q: "Olimpiade 2024 diadakan di kota?", a: ["paris"] },
  { q: "CPU adalah singkatan dari?", a: ["central processing unit"] },
  { q: "RAM adalah singkatan dari?", a: ["random access memory"] },
  { q: "HTTP adalah singkatan dari?", a: ["hypertext transfer protocol"] },
  { q: "WWW kepanjangan dari?", a: ["world wide web"] },
  { q: "Siapa pendiri Facebook?", a: ["mark zuckerberg","zuckerberg"] },
  { q: "Siapa pendiri Apple?", a: ["steve jobs","jobs","steve wozniak"] },
  { q: "Siapa pendiri Microsoft?", a: ["bill gates","gates","paul allen"] },
  { q: "Siapa pendiri Amazon?", a: ["jeff bezos","bezos"] },
  { q: "Siapa pendiri Google?", a: ["larry page dan sergey brin","sergey brin","larry page"] },
  { q: "Bahasa pemrograman yang dikembangkan oleh James Gosling?", a: ["java"] },
  { q: "Bahasa pemrograman yang dikembangkan oleh Guido van Rossum?", a: ["python"] },
  { q: "Sistem operasi open-source untuk komputer?", a: ["linux"] },
  { q: "Browser web paling populer di dunia?", a: ["chrome","google chrome"] },
  { q: "Media sosial dengan pengguna terbanyak di dunia?", a: ["facebook"] },
  { q: "Game konsol terlaris sepanjang masa?", a: ["minecraft","ps2","wii"] },
  { q: "Singkatan AI dalam teknologi?", a: ["artificial intelligence","kecerdasan buatan"] },
  { q: "Cryptocurrency pertama di dunia?", a: ["bitcoin"] },
  { q: "Siapa yang menciptakan Bitcoin?", a: ["satoshi nakamoto","nakamoto"] },
  { q: "PDF kepanjangan dari?", a: ["portable document format"] },
  { q: "USB kepanjangan dari?", a: ["universal serial bus"] },
  { q: "WiFi kepanjangan dari?", a: ["wireless fidelity"] },
  { q: "IP address adalah singkatan dari?", a: ["internet protocol address"] },
  { q: "Google didirikan tahun berapa?", a: ["1998"] },
  { q: "iPhone pertama diluncurkan tahun?", a: ["2007"] },
  { q: "Berapa bit dalam 1 byte?", a: ["8"] },
  { q: "Berapa byte dalam 1 kilobyte?", a: ["1024","1000"] },
  { q: "OS smartphone Android dikembangkan oleh?", a: ["google"] },
  { q: "Vitamin apa yang banyak di jeruk?", a: ["vitamin c"] },
  { q: "Vitamin apa yang dibutuhkan untuk tulang?", a: ["vitamin d"] },
  { q: "Defisiensi vitamin A menyebabkan?", a: ["rabun senja","buta malam","xeroftalmia"] },
  { q: "Penyakit akibat kekurangan zat besi?", a: ["anemia"] },
  { q: "Penyakit akibat kekurangan vitamin C?", a: ["sariawan","skurvi","scurvy"] },
  { q: "Penyakit malaria disebabkan oleh?", a: ["plasmodium","parasit","nyamuk anopheles"] },
  { q: "Penyakit demam berdarah ditularkan oleh nyamuk?", a: ["aedes aegypti","aedes"] },
  { q: "Antibiotik pertama yang ditemukan?", a: ["penisilin","penicillin"] },
  { q: "Berapa tekanan darah normal (sistolik)?", a: ["120","120 mmhg"] },
  { q: "Berapa detak jantung normal per menit?", a: ["60-100","60 sampai 100","72"] },
  { q: "Penyakit diabetes disebabkan kekurangan hormon?", a: ["insulin"] },
  { q: "Apa kepanjangan HIV?", a: ["human immunodeficiency virus"] },
  { q: "Lemak yang baik untuk tubuh disebut?", a: ["lemak tak jenuh","hdl","lemak sehat"] },
  { q: "Rokok mengandung zat adiktif apa?", a: ["nikotin"] },
  { q: "Apa organ yang paling besar di tubuh?", a: ["kulit"] },
  { q: "Berapa lama tidur yang dianjurkan untuk orang dewasa?", a: ["7-8 jam","7 sampai 9 jam","8 jam"] },
  { q: "Dokter spesialis anak disebut?", a: ["dokter anak","pediatri","pediatrician"] },
  { q: "Dokter spesialis kulit disebut?", a: ["dermatologi","dermatologis","spesialis kulit"] },
  { q: "Dokter spesialis gigi disebut?", a: ["dokter gigi","ortodontis","dentis"] },
  { q: "Penyakit TBC menyerang organ apa?", a: ["paru-paru","paru"] },
  { q: "Siapa nabi terakhir dalam Islam?", a: ["muhammad","nabi muhammad"] },
  { q: "Kitab suci agama Islam?", a: ["quran","alquran","al-quran"] },
  { q: "Kitab suci agama Kristen?", a: ["alkitab","bibel","bible"] },
  { q: "Kitab suci agama Hindu?", a: ["weda","veda"] },
  { q: "Kitab suci agama Buddha?", a: ["tripitaka","tipitaka"] },
  { q: "Rukun Islam ada berapa?", a: ["5","lima"] },
  { q: "Rukun Iman ada berapa?", a: ["6","enam"] },
  { q: "Bulan suci umat Islam?", a: ["ramadan","ramadhan"] },
  { q: "Hari raya umat Islam setelah Ramadan?", a: ["idul fitri","lebaran","eid al-fitr"] },
  { q: "Hari raya Nyepi adalah hari raya agama?", a: ["hindu"] },
  { q: "Hari raya Waisak adalah hari raya agama?", a: ["buddha"] },
  { q: "Hari raya Natal adalah hari raya agama?", a: ["kristen","nasrani"] },
  { q: "Siapa tokoh utama dalam agama Kristen?", a: ["yesus","yesus kristus","jesus"] },
  { q: "Siapa pendiri agama Buddha?", a: ["siddharta gautama","buddha gautama","gautama"] },
  { q: "Kota suci umat Islam tempat Ka'bah?", a: ["mekkah","mekah","mecca"] },
  { q: "Candi Borobudur adalah candi agama?", a: ["buddha"] },
  { q: "Candi Prambanan adalah candi agama?", a: ["hindu"] },
  { q: "Tari Kecak berasal dari provinsi?", a: ["bali"] },
  { q: "Batik diakui UNESCO tahun berapa?", a: ["2009"] },
  { q: "Angklung berasal dari daerah?", a: ["jawa barat","sunda"] },
  { q: "Gamelan berasal dari budaya?", a: ["jawa","bali","jawa dan bali"] },
  { q: "Rumah adat Betawi disebut?", a: ["rumah kebaya","kebaya"] },
  { q: "Rumah adat Minangkabau disebut?", a: ["rumah gadang"] },
  { q: "Rumah adat Jawa disebut?", a: ["joglo"] },
  { q: "Rumah adat Papua disebut?", a: ["honai"] },
  { q: "Tari Saman berasal dari daerah?", a: ["aceh"] },
  { q: "Tari Pendet berasal dari daerah?", a: ["bali"] },
  { q: "Tari Piring berasal dari daerah?", a: ["sumatera barat","minangkabau","padang"] },
  { q: "Alat musik tradisional Kalimantan?", a: ["sape","sampek"] },
  { q: "Lagu 'Bengawan Solo' diciptakan oleh?", a: ["gesang"] },
  { q: "Lagu 'Halo-Halo Bandung' diciptakan oleh?", a: ["ismail marzuki"] },
  { q: "Berapa jumlah sila dalam Pancasila?", a: ["5","lima"] },
  { q: "Sila pertama Pancasila berbunyi?", a: ["ketuhanan yang maha esa"] },
  { q: "Lambang negara Indonesia?", a: ["garuda pancasila","garuda","burung garuda"] },
  { q: "Semboyan negara Indonesia?", a: ["bhinneka tunggal ika"] },
  { q: "Berapa pasal dalam UUD 1945 (setelah amandemen)?", a: ["37","37 pasal"] },
  { q: "Mata uang Indonesia?", a: ["rupiah"] },
  { q: "Bank sentral Indonesia?", a: ["bank indonesia"] },
  { q: "Ibu kota provinsi Jawa Tengah?", a: ["semarang"] },
  { q: "Ibu kota provinsi Jawa Timur?", a: ["surabaya"] },
  { q: "Ibu kota provinsi Sulawesi Selatan?", a: ["makassar"] },
  { q: "Ibu kota provinsi Sumatera Utara?", a: ["medan"] },
  { q: "Ibu kota provinsi Kalimantan Timur?", a: ["samarinda"] },
  { q: "Ibu kota provinsi Papua?", a: ["jayapura"] },
  { q: "Ibu kota provinsi NTT?", a: ["kupang"] },
  { q: "Ibu kota provinsi Maluku?", a: ["ambon"] },
  { q: "Ibu kota provinsi Riau?", a: ["pekanbaru"] },
  { q: "Ibu kota provinsi Lampung?", a: ["bandarlampung","bandar lampung"] },
  { q: "Ibu kota provinsi Aceh?", a: ["banda aceh"] },
  { q: "Ibu kota provinsi Kalimantan Barat?", a: ["pontianak"] },
  { q: "Ibu kota provinsi Bali?", a: ["denpasar"] },
  { q: "Ibu kota provinsi DIY?", a: ["yogyakarta"] },
  { q: "Ibu kota provinsi Bengkulu?", a: ["bengkulu"] },
  { q: "Indonesia terletak di antara dua benua yaitu?", a: ["asia dan australia","australia dan asia"] },
  { q: "Indonesia terletak di antara dua samudra yaitu?", a: ["pasifik dan hindia","hindia dan pasifik","samudra pasifik dan samudra hindia"] },
  { q: "Tanaman nasional Indonesia?", a: ["melati","puspa bangsa","padma raksasa","anggrek bulan"] },
  { q: "Hewan nasional Indonesia?", a: ["komodo","elang jawa","badak bercula satu"] },
  { q: "Presiden Indonesia yang ke-7?", a: ["jokowi","joko widodo"] },
  { q: "Presiden Indonesia yang ke-3?", a: ["bj habibie","habibie"] },
  { q: "Presiden Indonesia yang ke-4?", a: ["gus dur","abdurrahman wahid","wahid"] },
  { q: "Presiden Indonesia yang ke-5?", a: ["megawati","megawati sukarnoputri"] },
  { q: "Presiden Indonesia yang ke-6?", a: ["sby","susilo bambang yudhoyono","yudhoyono"] },
  { q: "Proklamasi kemerdekaan dibacakan di jalan?", a: ["pegangsaan timur","jl pegangsaan timur 56"] },
  { q: "G30S/PKI terjadi pada tahun?", a: ["1965"] },
  { q: "Reformasi Indonesia terjadi tahun?", a: ["1998"] },
  { q: "Tsunami Aceh terjadi tahun?", a: ["2004"] },
  { q: "Gempa Yogyakarta besar terjadi tahun?", a: ["2006"] },
  { q: "Siapa pemilik Tesla dan X (Twitter)?", a: ["elon musk"] },
  { q: "Siapa CEO Apple saat ini?", a: ["tim cook"] },
  { q: "Film dengan pendapatan tertinggi sepanjang masa?", a: ["avengers endgame","avatar"] },
  { q: "Siapa penulis seri buku 'The Lord of the Rings'?", a: ["tolkien","jrr tolkien","j.r.r. tolkien"] },
  { q: "Siapa penulis seri buku 'Game of Thrones'?", a: ["george rr martin","george martin"] },
  { q: "Siapa penulis 'Romeo and Juliet'?", a: ["shakespeare","william shakespeare"] },
  { q: "Siapa penulis 'Don Quixote'?", a: ["cervantes","miguel de cervantes"] },
  { q: "Disney dibuat oleh siapa?", a: ["walt disney"] },
  { q: "Nama asli Batman?", a: ["bruce wayne"] },
  { q: "Nama asli Superman?", a: ["clark kent","kal-el"] },
  { q: "Nama asli SpiderMan versi Marvel pertama?", a: ["peter parker"] },
  { q: "Anime Naruto menceritakan tentang?", a: ["ninja","shinobi","desa konoha"] },
  { q: "Karakter utama One Piece bernama?", a: ["monkey d luffy","luffy"] },
  { q: "Karakter utama Dragon Ball bernama?", a: ["son goku","goku"] },
  { q: "K-Pop grup asal Korea Selatan paling populer?", a: ["bts","blackpink"] },
  { q: "Siapa penyanyi 'Blinding Lights'?", a: ["the weeknd","weeknd"] },
  { q: "Siapa penyanyi 'Bad Guy'?", a: ["billie eilish"] },
  { q: "Siapa penyanyi 'Bohemian Rhapsody'?", a: ["queen","freddie mercury"] },
  { q: "Film animasi Pixar tentang mainan hidup?", a: ["toy story"] },
  { q: "Film Harry Potter pertama berjudul?", a: ["harry potter dan batu bertuah","philosopher's stone","sorcerer's stone"] },
  { q: "Game MOBA populer buatan Tencent?", a: ["mobile legends","pubg mobile","arena of valor"] },
  { q: "Game survival buatan Brendan Greene?", a: ["pubg","playerunknown's battlegrounds"] },
  { q: "Film superhero Marvel pertama (MCU)?", a: ["iron man"] },
  { q: "Aktor yang memerankan Iron Man?", a: ["robert downey jr","rdj"] },
  { q: "Siapa pemeran utama film Titanic?", a: ["leonardo dicaprio","kate winslet","leo dicaprio"] },
  { q: "Film Indonesia terlaris sepanjang masa?", a: ["kkg","kki","pengabdi setan","si doel"] },
  { q: "Penyanyi Indonesia yang mendunia lewat lagu 'Rasa Sayange'?", a: ["tidak ada","lagu rakyat"] },
  { q: "Lagu viral TikTok Indonesia 'Ojo Dibandingke' dinyanyikan oleh?", a: ["denny caknan","happy asmara"] },
  { q: "Hewan apa yang tidur paling lama?", a: ["koala","siput","trenggiling"] },
  { q: "Hewan apa yang dapat hidup tanpa air paling lama?", a: ["unta","dromedary"] },
  { q: "Hewan apa yang memiliki lidah terpanjang?", a: ["bunglon","chameleeon","trenggiling"] },
  { q: "Berapa jumlah kaki laba-laba?", a: ["8","delapan"] },
  { q: "Berapa jumlah kaki serangga?", a: ["6","enam"] },
  { q: "Ular terpanjang di dunia?", a: ["piton retikular","python reticulatus","sanca kembang"] },
  { q: "Mamalia terbesar di darat?", a: ["gajah africa","gajah afrika"] },
  { q: "Mamalia terbesar di laut?", a: ["paus biru","blue whale"] },
  { q: "Burung yang tidak bisa terbang?", a: ["pinguin","penguin","ostrich","emu","kiwi"] },
  { q: "Hewan dengan masa kehamilan terpanjang?", a: ["gajah"] },
  { q: "Komodo berasal dari pulau?", a: ["komodo","flores","nusa tenggara"] },
  { q: "Orang utan artinya dalam bahasa Melayu?", a: ["orang hutan","manusia hutan"] },
  { q: "Hewan apa yang berubah warna?", a: ["bunglon","chameleon","gurita","cumi"] },
  { q: "Kupu-kupu mengalami metamorfosis, urutan tahapannya?", a: ["telur ulat kepompong kupu","telur larva pupa imago"] },
  { q: "Ikan hiu bernapas menggunakan?", a: ["insang","gill"] },
  { q: "Hewan yang dapat meregenerasi ekornya?", a: ["cicak","tokek","kadal","salamander"] },
  { q: "Hewan marsupial yang paling dikenal?", a: ["kanguru","kangaroo"] },
  { q: "Berapa jumlah kaki pada udang?", a: ["10","sepuluh"] },
  { q: "Berapa tahun kura-kura raksasa bisa hidup?", a: ["100 tahun lebih","150","200"] },
  { q: "Hewan yang tidak pernah minum air langsung?", a: ["koala","kangaroo rat"] },
  { q: "Singkatan GDP dalam ekonomi?", a: ["gross domestic product","produk domestik bruto"] },
  { q: "Apa itu inflasi?", a: ["kenaikan harga","naiknya harga barang","penurunan nilai uang"] },
  { q: "Apa itu deflasi?", a: ["penurunan harga","turunnya harga barang","naiknya nilai uang"] },
  { q: "Bursa saham Indonesia?", a: ["bei","bursa efek indonesia","idx"] },
  { q: "Perusahaan teknologi terbesar di dunia berdasarkan market cap?", a: ["apple","microsoft","nvidia"] },
  { q: "Siapa orang terkaya di dunia (2024)?", a: ["elon musk","bernard arnault","jeff bezos"] },
  { q: "Apa singkatan dari OJK?", a: ["otoritas jasa keuangan"] },
  { q: "Apa itu saham?", a: ["kepemilikan perusahaan","surat berharga","bukti kepemilikan"] },
  { q: "Apa itu obligasi?", a: ["surat utang","bond","surat berharga utang"] },
  { q: "Negara dengan GDP terbesar di dunia?", a: ["Amerika Serikat","AS","USA"] },
  { q: "Negara dengan GDP terbesar di Asia Tenggara?", a: ["indonesia"] },
  { q: "Apa kepanjangan BUMN?", a: ["badan usaha milik negara"] },
  { q: "Apa kepanjangan UMKM?", a: ["usaha mikro kecil dan menengah"] },
  { q: "Berapa planet di tata surya yang memiliki cincin?", a: ["4","empat","saturnus uranus neptunus jupiter"] },
  { q: "Bulan adalah satelit alami dari?", a: ["bumi","planet bumi"] },
  { q: "Planet merah adalah sebutan untuk?", a: ["mars"] },
  { q: "Planet biru adalah sebutan untuk?", a: ["neptunus","bumi"] },
  { q: "Bintang terbesar yang diketahui?", a: ["uy scuti","stephenson 2-18"] },
  { q: "Lubang hitam pertama yang difoto?", a: ["m87","messier 87"] },
  { q: "Berapa tahun cahaya jarak bumi ke Alpha Centauri?", a: ["4.37","4","4 tahun cahaya"] },
  { q: "Apa nama bulan terbesar Jupiter?", a: ["ganymede"] },
  { q: "Berapa banyak bulan yang dimiliki Mars?", a: ["2","dua"] },
  { q: "Planet yang paling dekat ukurannya dengan bumi?", a: ["venus"] },
  { q: "Komet terkenal yang terlihat tiap 75 tahun?", a: ["halley","komet halley"] },
  { q: "Sabuk asteroid terletak antara planet mana?", a: ["mars dan jupiter"] },
  { q: "Benda langit terbesar di tata surya selain matahari?", a: ["jupiter"] },
  { q: "Soto Betawi berasal dari?", a: ["jakarta","betawi","DKI jakarta"] },
  { q: "Rawon adalah masakan khas dari?", a: ["jawa timur","surabaya"] },
  { q: "Pempek adalah makanan khas dari?", a: ["palembang","sumatera selatan"] },
  { q: "Papeda adalah makanan khas dari?", a: ["papua","maluku"] },
  { q: "Coto Makassar berasal dari?", a: ["makassar","sulawesi selatan"] },
  { q: "Mie Aceh berasal dari?", a: ["aceh"] },
  { q: "Tahu Sumedang berasal dari?", a: ["sumedang","jawa barat"] },
  { q: "Kerak telor adalah makanan khas?", a: ["betawi","jakarta"] },
  { q: "Dodol Garut berasal dari?", a: ["garut","jawa barat"] },
  { q: "Makanan fermentasi dari Sumatera yang populer?", a: ["tempoyak","durian fermentasi"] },
  { q: "Pizza berasal dari negara?", a: ["italia","italy"] },
  { q: "Sushi berasal dari negara?", a: ["jepang"] },
  { q: "Kimchi berasal dari negara?", a: ["korea","korea selatan"] },
  { q: "Croissant berasal dari negara?", a: ["prancis","perancis","france"] },
  { q: "Buah yang mengandung vitamin C tertinggi?", a: ["jambu biji","kakadu plum","camu-camu"] },
  { q: "Bumbu dasar masakan Indonesia yang terdiri dari bawang merah, bawang putih, dan cabai?", a: ["bumbu merah","bumbu dasar merah"] },
  { q: "Minuman tradisional Jawa berbahan jahe?", a: ["wedang jahe","wedang","STMJ"] },
  { q: "Jamu tradisional untuk stamina dari kunyit asam?", a: ["jamu kunyit asam","kunyit asam"] },
  { q: "Ilmu yang mempelajari hukum disebut?", a: ["ilmu hukum","jurisprudensi"] },
  { q: "Ilmu yang mempelajari manusia dan budayanya?", a: ["antropologi"] },
  { q: "Ilmu yang mempelajari perilaku manusia?", a: ["psikologi"] },
  { q: "Ilmu yang mempelajari masyarakat?", a: ["sosiologi"] },
  { q: "Ilmu yang mempelajari tanah dan pertanian?", a: ["agronomi","ilmu pertanian"] },
  { q: "Ilmu yang mempelajari laut?", a: ["oseanografi","ilmu kelautan"] },
  { q: "Ilmu yang mempelajari gunung berapi?", a: ["vulkanologi"] },
  { q: "Ilmu yang mempelajari iklim jangka panjang?", a: ["klimatologi"] },
  { q: "Dokter yang ahli dalam bidang saraf?", a: ["neurolog","neurologi","dokter saraf"] },
  { q: "Dokter yang ahli dalam bidang jantung?", a: ["kardiolog","kardiologi","dokter jantung"] },
  { q: "Dokter yang ahli dalam bidang tulang?", a: ["ortopedi","dokter tulang","orthopedi"] },
  { q: "Dokter yang ahli dalam bidang mata?", a: ["oftalmologi","dokter mata"] },
  { q: "Dokter yang ahli dalam bidang jiwa?", a: ["psikiater","psikiatri","dokter jiwa"] },
  { q: "Gas rumah kaca utama penyebab pemanasan global?", a: ["karbon dioksida","co2","karbon dioksid"] },
  { q: "Lapisan bumi dari luar ke dalam yang pertama?", a: ["kerak","kerak bumi","litosfer"] },
  { q: "Lapisan bumi terdalam?", a: ["inti dalam","inner core"] },
  { q: "Proses siklus air di alam?", a: ["siklus hidrologi","siklus air","water cycle"] },
  { q: "Hutan yang mengandung keanekaragaman tertinggi?", a: ["hutan tropis","hutan hujan tropis","rainforest"] },
  { q: "Apa nama bencana alam yang disebabkan oleh gerakan lempeng bumi?", a: ["gempa bumi","earthquake"] },
  { q: "Apa nama proses naiknya air laut sehingga menenggelamkan pantai?", a: ["abrasi","erosi pantai","kenaikan muka air laut"] },
  { q: "Gas apa yang membuat bumi makin panas?", a: ["gas rumah kaca","co2","metana","karbon dioksida"] },
  { q: "Fenomena El Nino menyebabkan?", a: ["kekeringan","musim kering panjang","panas ekstrem"] },
  { q: "Apa nama hutan mangrove dalam bahasa Indonesia?", a: ["hutan bakau","bakau"] },
  { q: "Terumbu karang terbesar di dunia?", a: ["great barrier reef","great barrier","terumbu karang australia"] },
  { q: "Apa nama singkatan untuk kawasan hutan yang dilindungi?", a: ["cagar alam","taman nasional","suaka marga satwa"] },
  { q: "Negara dengan penduduk terbanyak?", a: ["india"] },
  { q: "Kota terpadat di dunia?", a: ["tokyo","shanghai","jakarta","mumbai"] },
  { q: "Negara dengan wilayah terbesar ke-2?", a: ["kanada","canada"] },
  { q: "Berapa jumlah negara di dunia (anggota PBB)?", a: ["193","195"] },
  { q: "Benua manakah yang tidak berpenghuni tetap?", a: ["antartika"] },
  { q: "Siapa wanita pertama yang terbang ke luar angkasa?", a: ["valentina tereshkova","tereshkova"] },
  { q: "Apa nama planet yang paling mirip kondisinya dengan bumi?", a: ["mars","venus"] },
  { q: "Bahasa dengan penutur asli terbanyak di dunia?", a: ["mandarin","china","chinese"] },
  { q: "Apa ibukota negara terbesar di dunia?", a: ["moskow","moscow"] },
  { q: "Siapa penyanyi dengan album terlaris sepanjang masa?", a: ["michael jackson","beatles","eagles"] },
  { q: "Apa warna hitam dalam bahasa Jepang?", a: ["kuro"] },
  { q: "Apa warna putih dalam bahasa Jepang?", a: ["shiro"] },
  { q: "Apa arti 'sayonara' dalam bahasa Jepang?", a: ["selamat tinggal","sampai jumpa","goodbye"] },
  { q: "Apa arti 'arigato' dalam bahasa Jepang?", a: ["terima kasih","thank you"] },
  { q: "Apa arti 'annyeong' dalam bahasa Korea?", a: ["halo","hai","selamat","goodbye"] },
  { q: "Apa arti 'merci' dalam bahasa Prancis?", a: ["terima kasih"] },
  { q: "Apa arti 'por favor' dalam bahasa Spanyol?", a: ["tolong","please"] },
  { q: "Huruf terakhir alfabet?", a: ["z"] },
  { q: "Berapa jumlah huruf alfabet?", a: ["26"] },
  { q: "Berapa huruf vokal dalam alfabet Indonesia?", a: ["5","lima","a e i o u"] },

  // === BATCH 3 ===
  { q: "Berapa 33 × 33?", a: ["1089"] },
  { q: "Berapa akar kuadrat dari 196?", a: ["14"] },
  { q: "Berapa 9 pangkat 3?", a: ["729"] },
  { q: "Berapa 6 pangkat 3?", a: ["216"] },
  { q: "Berapa 1234 + 5678?", a: ["6912"] },
  { q: "Berapa 2000 − 777?", a: ["1223"] },
  { q: "Berapa 45 × 45?", a: ["2025"] },
  { q: "Berapa 1/4 dari 1000?", a: ["250"] },
  { q: "Berapa 2/5 dari 250?", a: ["100"] },
  { q: "Jika harga barang Rp80.000 diskon 25%, harganya jadi?", a: ["60000","rp60000","60.000"] },
  { q: "Berapa luas segitiga dengan alas 10 dan tinggi 8?", a: ["40"] },
  { q: "Berapa luas trapesium dengan sisi sejajar 6 dan 10, tinggi 4?", a: ["32"] },
  { q: "Berapa diameter lingkaran jika kelilingnya 44? (π=22/7)", a: ["14","14 cm"] },
  { q: "Berapa jumlah sudut dalam segi enam?", a: ["720","720 derajat"] },
  { q: "Berapa jumlah sudut dalam segi delapan?", a: ["1080","1080 derajat"] },
  { q: "Berapa bilangan prima antara 50 dan 60?", a: ["53 dan 59","53,59"] },
  { q: "Berapa 999 × 2?", a: ["1998"] },
  { q: "Berapa 111 × 9?", a: ["999"] },
  { q: "Berapa faktor dari 12?", a: ["1 2 3 4 6 12","1,2,3,4,6,12"] },
  { q: "Berapa 10% dari 1500?", a: ["150"] },
  { q: "Satuan gaya dalam Sistem Internasional?", a: ["newton"] },
  { q: "Satuan energi dalam Sistem Internasional?", a: ["joule"] },
  { q: "Satuan daya dalam Sistem Internasional?", a: ["watt"] },
  { q: "Satuan tekanan dalam Sistem Internasional?", a: ["pascal"] },
  { q: "Satuan frekuensi dalam Sistem Internasional?", a: ["hertz"] },
  { q: "Satuan muatan listrik?", a: ["coulomb"] },
  { q: "Satuan hambatan listrik?", a: ["ohm"] },
  { q: "Satuan tegangan listrik?", a: ["volt"] },
  { q: "Satuan arus listrik?", a: ["ampere"] },
  { q: "Hukum Ohm: V = ?", a: ["ir","i kali r","arus kali hambatan"] },
  { q: "Cahaya merambat paling cepat melalui?", a: ["vakum","ruang hampa"] },
  { q: "Cermin cekung digunakan pada?", a: ["lampu sorot","teleskop","dokter gigi"] },
  { q: "Cermin cembung digunakan pada?", a: ["kaca spion","kaca pengaman"] },
  { q: "Lensa cembung sifatnya?", a: ["konvergen","mengumpulkan cahaya"] },
  { q: "Lensa cekung sifatnya?", a: ["divergen","menyebarkan cahaya"] },
  { q: "Benda bergerak dengan kecepatan sama disebut?", a: ["gerak lurus beraturan","glb"] },
  { q: "Benda jatuh bebas mengalami percepatan berapa m/s²?", a: ["9.8","10","9.81"] },
  { q: "Rumus luas menggunakan rumus E = mc², m adalah?", a: ["massa","mass"] },
  { q: "Gelombang suara termasuk gelombang?", a: ["mekanik","longitudinal"] },
  { q: "Gelombang cahaya termasuk gelombang?", a: ["elektromagnetik","transversal"] },
  { q: "Reaksi antara asam dan basa menghasilkan?", a: ["garam dan air","garam","garam + air"] },
  { q: "pH larutan asam kurang dari?", a: ["7"] },
  { q: "pH larutan basa lebih dari?", a: ["7"] },
  { q: "pH larutan netral adalah?", a: ["7"] },
  { q: "Rumus kimia garam dapur?", a: ["nacl"] },
  { q: "Rumus kimia asam klorida?", a: ["hcl"] },
  { q: "Rumus kimia asam sulfat?", a: ["h2so4"] },
  { q: "Rumus kimia karbon dioksida?", a: ["co2"] },
  { q: "Rumus kimia amonia?", a: ["nh3"] },
  { q: "Rumus kimia glukosa?", a: ["c6h12o6"] },
  { q: "Logam cair pada suhu kamar?", a: ["raksa","merkuri","mercury"] },
  { q: "Unsur paling melimpah di kerak bumi?", a: ["oksigen","o"] },
  { q: "Unsur paling melimpah di alam semesta?", a: ["hidrogen","h"] },
  { q: "Plastik terbuat dari bahan dasar?", a: ["polimer","minyak bumi","petrokimia"] },
  { q: "Bahan yang mudah terbakar disebut?", a: ["flammable","flamable","mudah terbakar","bahan bakar"] },
  { q: "Apa nama proses memisahkan campuran dengan titik didih berbeda?", a: ["distilasi","penyulingan"] },
  { q: "Apa nama proses memisahkan campuran padat-cair dengan kertas saring?", a: ["filtrasi","penyaringan"] },
  { q: "Apa nama proses besi berkarat?", a: ["oksidasi","korosi","perkaratan"] },
  { q: "Apa nama proses fotosintesis yang menghasilkan glukosa?", a: ["siklus calvin","reaksi gelap"] },
  { q: "Katalis dalam tubuh manusia disebut?", a: ["enzim"] },
  { q: "Sel yang tidak memiliki inti disebut?", a: ["sel prokariot","prokariotik","prokariota"] },
  { q: "Sel yang memiliki inti sejati disebut?", a: ["sel eukariot","eukariotik","eukariota"] },
  { q: "Organel sel yang berfungsi sebagai pusat energi?", a: ["mitokondria"] },
  { q: "Organel sel yang berfungsi untuk fotosintesis?", a: ["kloroplas"] },
  { q: "Organel sel yang disebut 'dapur sel'?", a: ["retikulum endoplasma","ribosom"] },
  { q: "Pigmen hijau pada daun disebut?", a: ["klorofil","chlorophyll"] },
  { q: "Bakteri yang menguntungkan untuk membuat yogurt?", a: ["lactobacillus","streptococcus"] },
  { q: "Jamur yang dipakai membuat tempe?", a: ["rhizopus","rhizopus oligosporus"] },
  { q: "Tanaman karnivora yang paling terkenal?", a: ["venus flytrap","kantong semar"] },
  { q: "Berapa kromosom dalam sel sperma manusia?", a: ["23"] },
  { q: "Golongan darah yang bisa menerima dari semua golongan?", a: ["ab"] },
  { q: "Golongan darah yang bisa mendonorkan ke semua golongan?", a: ["o"] },
  { q: "Rantai makanan dimulai dari?", a: ["produsen","tumbuhan","tanaman"] },
  { q: "Hewan herbivora adalah hewan yang memakan?", a: ["tumbuhan","tanaman","herbivora"] },
  { q: "Hewan omnivora adalah hewan yang memakan?", a: ["segala","tumbuhan dan hewan","daging dan tumbuhan"] },
  { q: "Jaringan saraf terdiri dari sel-sel disebut?", a: ["neuron"] },
  { q: "Reseptor cahaya pada mata disebut?", a: ["sel batang dan kerucut","retina","sel fotoreseptor"] },
  { q: "Bagian mata yang mengatur banyaknya cahaya masuk?", a: ["iris","pupil"] },
  { q: "Tulang yang melindungi otak?", a: ["tengkorak","kranium"] },
  { q: "Sistem imun tubuh utama adalah?", a: ["sel darah putih","leukosit","limfosit"] },
  { q: "Siapa yang mendirikan kerajaan Majapahit?", a: ["raden wijaya","wijaya"] },
  { q: "Siapa mahapatih Majapahit yang terkenal?", a: ["gajah mada"] },
  { q: "Sumpah Palapa diucapkan oleh?", a: ["gajah mada"] },
  { q: "Kerajaan Islam pertama di Indonesia?", a: ["samudra pasai","perlak","samudera pasai"] },
  { q: "Siapa pendiri Kerajaan Mataram Islam?", a: ["panembahan senopati","sutawijaya"] },
  { q: "Peristiwa Rengasdengklok terjadi tanggal?", a: ["16 agustus 1945","16 agustus"] },
  { q: "BPUPKI diketuai oleh?", a: ["radjiman wedyodiningrat","dr radjiman"] },
  { q: "PPKI diketuai oleh?", a: ["soekarno","sukarno"] },
  { q: "Pahlawan yang dijuluki Bapak Pendidikan Indonesia?", a: ["ki hajar dewantara","ki hadjar dewantara"] },
  { q: "Tanggal Hari Pendidikan Nasional?", a: ["2 mei","2 mei setiap tahun"] },
  { q: "Tanggal Hari Pahlawan Indonesia?", a: ["10 november","10 november setiap tahun"] },
  { q: "Peristiwa Surabaya tanggal 10 November dipimpin oleh?", a: ["bung tomo","sutomo"] },
  { q: "Konferensi Meja Bundar diadakan di kota?", a: ["den haag","the hague"] },
  { q: "Indonesia diterima menjadi anggota PBB tahun?", a: ["1950"] },
  { q: "Gerakan Non-Blok pertama kali diinisiasi di?", a: ["bandung","konferensi bandung","bandung 1955"] },
  { q: "Orde Baru dipimpin oleh?", a: ["soeharto","suharto"] },
  { q: "Presiden Soeharto mundur karena tekanan?", a: ["reformasi","demonstrasi","mahasiswa"] },
  { q: "Ibu Kota baru Indonesia?", a: ["nusantara","ikn nusantara"] },
  { q: "Di pulau mana IKN Nusantara dibangun?", a: ["kalimantan","kalimantan timur"] },
  { q: "Tahun berapa Indonesia menjadi tuan rumah Asian Games?", a: ["1962","2018"] },
  { q: "Apa mata uang yang paling banyak digunakan di dunia?", a: ["dolar","usd","dollar"] },
  { q: "Apa singkatan ORI dalam investasi?", a: ["obligasi ritel indonesia"] },
  { q: "Apa kepanjangan BEI?", a: ["bursa efek indonesia"] },
  { q: "Apa kepanjangan BI?", a: ["bank indonesia"] },
  { q: "Apa kepanjangan OJK?", a: ["otoritas jasa keuangan"] },
  { q: "Reksa dana saham risikonya?", a: ["tinggi","high risk"] },
  { q: "Apa kepanjangan SBI?", a: ["sertifikat bank indonesia"] },
  { q: "Pasar modal tempat saham diperdagangkan?", a: ["bursa efek","stock exchange"] },
  { q: "Apa istilah untuk harga saham naik terus?", a: ["bull market","bullish","uptrend"] },
  { q: "Apa istilah untuk harga saham turun terus?", a: ["bear market","bearish","downtrend"] },
  { q: "Sektor ekonomi primer meliputi?", a: ["pertanian pertambangan kehutanan","pertanian","pertambangan"] },
  { q: "Sektor ekonomi tersier meliputi?", a: ["jasa","layanan","service"] },
  { q: "GDP per kapita artinya?", a: ["gdp dibagi jumlah penduduk","pendapatan rata-rata per orang"] },
  { q: "Indeks Harga Saham Gabungan disingkat?", a: ["ihsg"] },
  { q: "Apa itu diversifikasi dalam investasi?", a: ["menyebar investasi","tidak taruh telur satu keranjang","beragam investasi"] },
  { q: "Siapa pelukis Monalisa?", a: ["leonardo da vinci","da vinci"] },
  { q: "Siapa pelukis 'The Starry Night'?", a: ["vincent van gogh","van gogh"] },
  { q: "Siapa pelukis 'The Persistence of Memory'?", a: ["salvador dali","dali"] },
  { q: "Siapa pematung 'David'?", a: ["michelangelo"] },
  { q: "Museum terbesar di dunia?", a: ["louvre","museum louvre","british museum"] },
  { q: "Siapa komposer 'Fur Elise'?", a: ["beethoven","ludwig van beethoven"] },
  { q: "Siapa komposer 'The Four Seasons'?", a: ["vivaldi","antonio vivaldi"] },
  { q: "Siapa komposer Symphony No. 5?", a: ["beethoven"] },
  { q: "Opera terkenal 'Rigoletto' diciptakan oleh?", a: ["verdi","giuseppe verdi"] },
  { q: "Siapa pengarang novel '1984'?", a: ["george orwell","orwell"] },
  { q: "Siapa pengarang 'Pride and Prejudice'?", a: ["jane austen","austen"] },
  { q: "Siapa pengarang 'Sherlock Holmes'?", a: ["arthur conan doyle","conan doyle"] },
  { q: "Siapa pengarang novel 'Laskar Pelangi'?", a: ["andrea hirata"] },
  { q: "Siapa pengarang novel 'Bumi Manusia'?", a: ["pramoedya ananta toer","pram"] },
  { q: "Siapa pengarang puisi 'Aku'?", a: ["chairil anwar"] },
  { q: "Siapa pengarang lagu 'Rayuan Pulau Kelapa'?", a: ["ismail marzuki"] },
  { q: "Film Indonesia pertama tentang kemerdekaan?", a: ["darah dan doa","bung karno"] },
  { q: "Siapa sutradara Avengers: Endgame?", a: ["russo bersaudara","anthony russo","joe russo","russo brothers"] },
  { q: "Penghargaan film tertinggi di dunia?", a: ["oscar","academy award"] },
  { q: "Festival film internasional paling bergengsi?", a: ["cannes","venice","berlin","toronto"] },
  { q: "UUD 1945 disahkan tanggal?", a: ["18 agustus 1945","18 agustus"] },
  { q: "Berapa jumlah anggota DPR RI?", a: ["575","580"] },
  { q: "Berapa tahun masa jabatan presiden Indonesia?", a: ["5 tahun","lima tahun"] },
  { q: "Presiden Indonesia maksimal menjabat berapa periode?", a: ["2 periode","dua periode","10 tahun"] },
  { q: "Lembaga negara yang memutus perkara konstitusi?", a: ["mahkamah konstitusi","mk"] },
  { q: "Lembaga negara yang mengawasi pengadilan?", a: ["komisi yudisial","ky"] },
  { q: "Lembaga anti korupsi Indonesia?", a: ["kpk","komisi pemberantasan korupsi"] },
  { q: "Ombudsman Indonesia bertugas untuk?", a: ["mengawasi pelayanan publik","laporan masyarakat"] },
  { q: "Berapa jumlah menteri dalam kabinet Indonesia?", a: ["34","37","38"] },
  { q: "Kementerian yang mengurus pendidikan tinggi Indonesia?", a: ["kemdikbud","kemendikbud ristek","kementerian pendidikan"] },
  { q: "Apa kepanjangan KPK?", a: ["komisi pemberantasan korupsi"] },
  { q: "Apa kepanjangan BNN?", a: ["badan narkotika nasional"] },
  { q: "Apa kepanjangan BNPB?", a: ["badan nasional penanggulangan bencana"] },
  { q: "Apa kepanjangan BPOM?", a: ["badan pengawas obat dan makanan"] },
  { q: "Pemilihan presiden Indonesia diadakan setiap?", a: ["5 tahun","lima tahun"] },
  { q: "Klub sepak bola tersukses di Indonesia?", a: ["persib","persija","arema"] },
  { q: "Stadion sepak bola terbesar di Indonesia?", a: ["gbk","stadion utama gelora bung karno"] },
  { q: "Siapa atlet bulu tangkis Indonesia legendaris juara All England?", a: ["rudy hartono","liem swie king","kevin sanjaya"] },
  { q: "Indonesia pertama kali meraih medali emas Olimpiade tahun?", a: ["1992"] },
  { q: "Siapa atlet yang memenangkan emas olimpiade pertama Indonesia?", a: ["susi susanti","alan budikusuma"] },
  { q: "Siapa perenang Indonesia yang terkenal di SEA Games?", a: ["siman sudartawa","i gede siman"] },
  { q: "Bulu tangkis Indonesia mendominasi di turnamen?", a: ["thomas cup","uber cup","bwf","piala thomas"] },
  { q: "Siapa petinju Indonesia yang meraih gelar dunia?", a: ["ellyas pical","yohannes vlijmen"] },
  { q: "Olahraga pencak silat berasal dari?", a: ["indonesia","melayu","nusantara"] },
  { q: "Tim basket nasional Indonesia biasa disebut?", a: ["timnas basket","garuda","indonesia basketball"] },
  { q: "PON adalah kepanjangan dari?", a: ["pekan olahraga nasional"] },
  { q: "SEA Games adalah pesta olahraga negara-negara di?", a: ["asia tenggara","southeast asia"] },
  { q: "Berapa tahun sekali SEA Games diadakan?", a: ["2 tahun","dua tahun"] },
  { q: "Asian Games pertama diadakan di?", a: ["new delhi","india","1951"] },
  { q: "Indonesia tuan rumah Asian Games berapa kali?", a: ["2","dua"] },
  { q: "Apa bahasa Inggris dari 'kupu-kupu'?", a: ["butterfly"] },
  { q: "Apa bahasa Inggris dari 'laba-laba'?", a: ["spider"] },
  { q: "Apa bahasa Inggris dari 'bintang laut'?", a: ["starfish","sea star"] },
  { q: "Apa bahasa Inggris dari 'ubur-ubur'?", a: ["jellyfish"] },
  { q: "Apa bahasa Inggris dari 'lumba-lumba'?", a: ["dolphin"] },
  { q: "Apa bahasa Inggris dari 'kelelawar'?", a: ["bat"] },
  { q: "Apa bahasa Inggris dari 'lebah'?", a: ["bee"] },
  { q: "Apa bahasa Inggris dari 'pelangi'?", a: ["rainbow"] },
  { q: "Apa bahasa Inggris dari 'petir'?", a: ["thunder","lightning"] },
  { q: "Apa bahasa Inggris dari 'banjir'?", a: ["flood"] },
  { q: "Apa bahasa Inggris dari 'gempa bumi'?", a: ["earthquake"] },
  { q: "Apa bahasa Inggris dari 'gunung berapi'?", a: ["volcano"] },
  { q: "Apa bahasa Inggris dari 'hujan es'?", a: ["hail","hailstorm"] },
  { q: "Apa bahasa Inggris dari 'angin topan'?", a: ["hurricane","typhoon","cyclone"] },
  { q: "Apa bahasa Inggris dari 'kekeringan'?", a: ["drought"] },
  { q: "Apa bahasa Inggris dari 'pertanian'?", a: ["agriculture","farming"] },
  { q: "Apa bahasa Inggris dari 'perdagangan'?", a: ["trade","commerce","trading"] },
  { q: "Apa bahasa Inggris dari 'keadilan'?", a: ["justice","fairness"] },
  { q: "Apa bahasa Inggris dari 'kebijaksanaan'?", a: ["wisdom"] },
  { q: "Apa bahasa Inggris dari 'keberanian'?", a: ["courage","bravery"] },
  { q: "Berapa persen tubuh manusia terdiri dari air?", a: ["60","60%","55-60%","60-70%"] },
  { q: "Organ tubuh manusia yang bisa tumbuh kembali?", a: ["hati","liver"] },
  { q: "Berapa kecepatan cahaya dalam satu detik (km)?", a: ["300000","299792"] },
  { q: "Buah apa yang bisa mengapung di air?", a: ["apel","jeruk","semangka"] },
  { q: "Benua mana yang tidak punya reptil asli?", a: ["antartika","antarctica"] },
  { q: "Burung apa yang terbang tertinggi?", a: ["bangau","griffon vulture","bar-headed goose"] },
  { q: "Hewan apa yang punya jantung terbesar?", a: ["paus biru","blue whale"] },
  { q: "Ikan apa yang bisa berubah jenis kelamin?", a: ["clownfish","ikan badut","nemo"] },
  { q: "Tumbuhan apa yang paling tinggi?", a: ["pohon sequoia","sequoia","redwood"] },
  { q: "Makhluk apa yang paling banyak di bumi?", a: ["semut","bakteri","nematoda"] },
  { q: "Planet apa yang rotasinya paling lambat?", a: ["venus"] },
  { q: "Berapa lama satu hari di Venus (dalam hari bumi)?", a: ["243 hari","243"] },
  { q: "Hewan darat apa yang larinya paling cepat?", a: ["cheetah","gepard"] },
  { q: "Berapa kecepatan maksimum cheetah (km/jam)?", a: ["110","120","112"] },
  { q: "Tumbuhan berbunga terbesar di dunia?", a: ["rafflesia arnoldii","rafflesia","padma raksasa"] },
  { q: "Tumbuhan tertinggi yang bukan pohon?", a: ["bambu"] },
  { q: "Berapa usia rata-rata gajah di alam liar?", a: ["60-70 tahun","70 tahun","60 tahun"] },
  { q: "Hewan apa yang memiliki sidik jari seperti manusia?", a: ["koala","simpanse","gorila"] },
  { q: "Negara dengan hutan hujan terluas di dunia?", a: ["brasil","brazil"] },
  { q: "Berapa persen oksigen dihasilkan hutan Amazon?", a: ["20%","20"] },
  { q: "Universitas tertua di Indonesia?", a: ["ui","universitas indonesia","universitas gadjah mada"] },
  { q: "Universitas tertua di dunia?", a: ["al-qarawiyyin","bologna","oxford"] },
  { q: "Siapa penemu kalkulus?", a: ["newton dan leibniz","newton","leibniz"] },
  { q: "Siapa penemu teori evolusi?", a: ["darwin","charles darwin"] },
  { q: "Siapa ilmuwan wanita pertama meraih Nobel dua kali?", a: ["marie curie","curie"] },
  { q: "Pada bidang apa Marie Curie meraih Nobel pertamanya?", a: ["fisika"] },
  { q: "Pada bidang apa Marie Curie meraih Nobel keduanya?", a: ["kimia"] },
  { q: "Siapa ilmuwan yang menemukan hukum termodinamika?", a: ["carnot","kelvin","clausius"] },
  { q: "Siapa ilmuwan yang menemukan proton?", a: ["rutherford","ernest rutherford"] },
  { q: "Siapa ilmuwan yang menemukan neutron?", a: ["james chadwick","chadwick"] },
  { q: "Apa nama teori yang menyatakan alam semesta bermula dari ledakan besar?", a: ["big bang","ledakan besar"] },
  { q: "Apa nama teori yang menyatakan bumi bukan pusat semesta?", a: ["heliosentrisme","heliosentris"] },
  { q: "Siapa yang pertama kali mengemukakan teori heliosentris?", a: ["copernicus","nicolaus copernicus"] },
  { q: "Siapa yang membuktikan teori heliosentris dengan teleskop?", a: ["galileo","galileo galilei"] },
  { q: "Apa nama alat yang digunakan Galileo untuk mengamati bintang?", a: ["teleskop"] },
  { q: "Instagram dimiliki oleh perusahaan?", a: ["meta","facebook","meta platforms"] },
  { q: "WhatsApp dimiliki oleh perusahaan?", a: ["meta","facebook","meta platforms"] },
  { q: "YouTube dimiliki oleh perusahaan?", a: ["google","alphabet"] },
  { q: "LinkedIn adalah media sosial untuk?", a: ["profesional","karir","networking kerja"] },
  { q: "Twitter sekarang berganti nama menjadi?", a: ["x","eks"] },
  { q: "Snapchat terkenal dengan fitur?", a: ["pesan menghilang","story","filter"] },
  { q: "Pinterest adalah platform untuk?", a: ["gambar","inspirasi visual","foto","pin"] },
  { q: "Discord adalah platform untuk?", a: ["gaming","komunitas","voice chat","chat"] },
  { q: "Twitch adalah platform untuk?", a: ["streaming game","live gaming","game streaming"] },
  { q: "Netflix adalah layanan?", a: ["streaming film","video streaming","ott"] },
  { q: "Spotify adalah layanan?", a: ["streaming musik","music streaming"] },
  { q: "Zoom terkenal untuk?", a: ["video call","meeting online","video conference"] },
  { q: "GitHub digunakan untuk?", a: ["code repository","simpan kode","version control"] },
  { q: "Wikipedia adalah?", a: ["ensiklopedia online","ensiklopedia bebas","wiki"] },
  { q: "Google Maps digunakan untuk?", a: ["peta","navigasi","arah jalan"] },
  { q: "Pasta berasal dari negara?", a: ["italia"] },
  { q: "Paella berasal dari negara?", a: ["spanyol","spain"] },
  { q: "Schnitzel berasal dari negara?", a: ["austria","jerman"] },
  { q: "Gyros berasal dari negara?", a: ["yunani","greece"] },
  { q: "Pho berasal dari negara?", a: ["vietnam"] },
  { q: "Pad thai berasal dari negara?", a: ["thailand"] },
  { q: "Nasi biryani berasal dari negara?", a: ["india","pakistan"] },
  { q: "Tom yum adalah sup dari negara?", a: ["thailand"] },
  { q: "Peking duck berasal dari kota?", a: ["beijing","peking","tiongkok"] },
  { q: "Falafel adalah makanan dari negara?", a: ["timur tengah","israel","palestina","mesir","lebanon"] },
  { q: "Hummus terbuat dari bahan utama?", a: ["kacang arab","kacang chickpea","buncis"] },
  { q: "Tacos berasal dari negara?", a: ["meksiko","mexico"] },
  { q: "Burger berasal dari kota?", a: ["hamburg","jerman"] },
  { q: "Hot dog berasal dari negara?", a: ["jerman","Amerika Serikat"] },
  { q: "Baguette adalah roti khas dari?", a: ["prancis","france"] },
  { q: "Churros berasal dari negara?", a: ["spanyol","portugal"] },
  { q: "Tiramisu berasal dari negara?", a: ["italia","italy"] },
  { q: "Makaron (macaron) berasal dari negara?", a: ["prancis","france"] },
  { q: "Kebab berasal dari negara?", a: ["turki","timur tengah"] },
  { q: "Dim sum berasal dari negara?", a: ["china","tiongkok","hong kong"] },
  { q: "VR adalah singkatan dari?", a: ["virtual reality"] },
  { q: "AR adalah singkatan dari?", a: ["augmented reality"] },
  { q: "IoT adalah singkatan dari?", a: ["internet of things"] },
  { q: "NFT adalah singkatan dari?", a: ["non-fungible token"] },
  { q: "Blockchain adalah teknologi yang digunakan untuk?", a: ["cryptocurrency","desentralisasi","bitcoin","transaksi digital"] },
  { q: "Siapa yang mendirikan OpenAI?", a: ["elon musk dan sam altman","sam altman","elon musk"] },
  { q: "ChatGPT dibuat oleh perusahaan?", a: ["openai","open ai"] },
  { q: "Generasi jaringan seluler saat ini?", a: ["5g"] },
  { q: "Kendaraan listrik Tesla pertama yang populer?", a: ["tesla roadster","model s","model 3"] },
  { q: "Drone pertama kali digunakan untuk?", a: ["militer","pengintaian","perang"] },
  { q: "3D printing juga disebut?", a: ["additive manufacturing","cetak tiga dimensi"] },
  { q: "Quantum computing menggunakan unit komputasi disebut?", a: ["qubit","kubit"] },
  { q: "Self-driving car terdepan dikembangkan oleh?", a: ["tesla","waymo","google"] },
  { q: "Siapa yang meluncurkan roket Falcon 9?", a: ["spacex","elon musk"] },
  { q: "Siapa pesaing SpaceX dalam bisnis roket?", a: ["blue origin","boeing","nasa","virgin galactic"] },
  { q: "Tanaman yang menjadi bahan utama tempe?", a: ["kedelai","soya","kacang kedelai"] },
  { q: "Rempah berharga yang pernah menjadi rebutan bangsa Eropa?", a: ["cengkeh","pala","lada","rempah"] },
  { q: "Pulau penghasil pala terbesar di dunia?", a: ["banda","kepulauan banda","maluku"] },
  { q: "Pohon yang disebut 'pohon kehidupan' di Indonesia?", a: ["kelapa","pohon kelapa"] },
  { q: "Kopi robusta banyak tumbuh di daerah?", a: ["lampung","bengkulu","sumatera"] },
  { q: "Kopi arabika terbaik dari Indonesia berasal dari?", a: ["gayo","aceh","toraja","kintamani"] },
  { q: "Tanaman yang menghasilkan bahan baku karet?", a: ["pohon karet","hevea","para"] },
  { q: "Bambu termasuk dalam keluarga tanaman?", a: ["rumput","poaceae","gramineae"] },
  { q: "Buah durian dijuluki?", a: ["raja buah","king of fruits"] },
  { q: "Manggis dijuluki?", a: ["ratu buah","queen of fruits"] },
  { q: "Indonesia beriklim?", a: ["tropis","iklim tropis"] },
  { q: "Musim di Indonesia ada berapa?", a: ["2","dua","kemarau dan hujan"] },
  { q: "Angin yang membawa hujan ke Indonesia?", a: ["angin muson barat","monsun barat"] },
  { q: "Fenomena alam yang menyebabkan cuaca ekstrem di Pasifik?", a: ["el nino","la nina"] },
  { q: "Angin kencang berputar yang merusak disebut?", a: ["tornado","puting beliung"] },
  { q: "Badai tropis di Samudera Hindia disebut?", a: ["siklon","cyclone"] },
  { q: "Badai tropis di Samudera Pasifik disebut?", a: ["topan","typhoon","hurikan"] },
  { q: "Hujan asam disebabkan oleh?", a: ["polusi udara","so2","no2","sulfur dioksida"] },
  { q: "Lapisan ozon berfungsi untuk?", a: ["melindungi dari sinar uv","menyaring radiasi ultraviolet"] },
  { q: "Efek rumah kaca menyebabkan?", a: ["pemanasan global","global warming","bumi memanas"] },

  // === BATCH 4 ===
{ q: "Apa nama unsur kimia dengan simbol Fe?", a: ["besi","iron"] },
  { q: "Apa nama unsur kimia dengan simbol Pb?", a: ["timbal","lead"] },
  { q: "Apa nama unsur kimia dengan simbol Zn?", a: ["seng","zinc"] },
  { q: "Berapa gram dalam 1 kilogram?", a: ["1000"] },
  { q: "Berapa menit dalam 1 hari?", a: ["1440"] },
  { q: "Berapa detik dalam 1 jam?", a: ["3600"] },
  { q: "Berapa minggu dalam 1 tahun?", a: ["52","52 minggu"] },
  { q: "Berapa hari dalam bulan Februari tahun kabisat?", a: ["29","29 hari"] },
  { q: "Berapa cm dalam 1 meter?", a: ["100"] },
  { q: "Berapa mm dalam 1 cm?", a: ["10"] },
  { q: "Berapa km dalam 1 mil?", a: ["1.6","1.609"] },
  { q: "Berapa liter dalam 1 m³?", a: ["1000"] },
  { q: "Berapa gram dalam 1 ons?", a: ["100"] },
  { q: "Berapa kg dalam 1 ton?", a: ["1000"] },
  { q: "Berapa derajat Fahrenheit setara 100 derajat Celsius?", a: ["212","212 f"] },
  { q: "Huruf pertama alfabet Yunani?", a: ["alfa","alpha"] },
  { q: "Huruf terakhir alfabet Yunani?", a: ["omega"] },
  { q: "Apa simbol matematika untuk tak terhingga?", a: ["∞","infinity"] },
  { q: "Apa nilai Pi (π) sampai 2 desimal?", a: ["3.14"] },
  { q: "Segitiga dengan semua sisi sama panjang disebut?", a: ["segitiga sama sisi","equilateral"] },
  { q: "Segitiga dengan dua sisi sama panjang disebut?", a: ["segitiga sama kaki","isosceles"] },
  { q: "Apa nama sudut yang lebih dari 180 derajat?", a: ["sudut refleks","sudut reflex"] },
  { q: "Apa nama sudut kurang dari 90 derajat?", a: ["sudut lancip","acute angle"] },
  { q: "Apa nama sudut lebih dari 90 dan kurang dari 180?", a: ["sudut tumpul","obtuse angle"] },
  { q: "Dua garis yang tidak berpotongan disebut?", a: ["sejajar","parallel"] },
  { q: "Siapa pencipta lagu 'Indonesia Raya'?", a: ["wr supratman","wage rudolf supratman"] },
  { q: "Lagu 'Hari Merdeka' diciptakan oleh?", a: ["husein mutahar"] },
  { q: "Siapa penulis buku 'Siti Nurbaya'?", a: ["marah rusli"] },
  { q: "Siapa penulis buku 'Tenggelamnya Kapal Van der Wijck'?", a: ["hamka","buya hamka"] },
  { q: "Siapa pencipta 'Taman Siswa'?", a: ["ki hajar dewantara","ki hadjar dewantara"] },
  { q: "Hari Guru Nasional diperingati tanggal?", a: ["25 november","25 november setiap tahun"] },
  { q: "Hari Kartini diperingati tanggal?", a: ["21 april","21 april setiap tahun"] },
  { q: "Siapa pahlawan wanita yang berjuang lewat tulisan?", a: ["kartini","ra kartini","raden ajeng kartini"] },
  { q: "Hari Sumpah Pemuda diperingati tanggal?", a: ["28 oktober","28 oktober setiap tahun"] },
  { q: "Hari Batik Nasional diperingati tanggal?", a: ["2 oktober","2 oktober setiap tahun"] },
  { q: "Hari Anak Nasional diperingati tanggal?", a: ["23 juli"] },
  { q: "Hari Ibu diperingati tanggal?", a: ["22 desember"] },
  { q: "Hari Ayah Nasional diperingati tanggal?", a: ["12 november"] },
  { q: "Hari Lingkungan Hidup Sedunia diperingati tanggal?", a: ["5 juni"] },
  { q: "Hari AIDS Sedunia diperingati tanggal?", a: ["1 desember"] },
  { q: "Hari HAM Sedunia diperingati tanggal?", a: ["10 desember"] },
  { q: "Hari Bumi diperingati tanggal?", a: ["22 april"] },
  { q: "Hari Kesehatan Sedunia diperingati tanggal?", a: ["7 april"] },
  { q: "WHO singkatan dari?", a: ["world health organization","organisasi kesehatan dunia"] },
  { q: "PBB singkatan dari?", a: ["perserikatan bangsa-bangsa","united nations"] },
  { q: "NATO singkatan dari?", a: ["north atlantic treaty organization"] },
  { q: "ASEAN singkatan dari?", a: ["association of southeast asian nations"] },
  { q: "ASEAN didirikan tahun?", a: ["1967"] },
  { q: "ASEAN didirikan di kota?", a: ["bangkok"] },
  { q: "Berapa negara anggota ASEAN?", a: ["10","sepuluh"] },
  { q: "Sekretariat ASEAN berkedudukan di?", a: ["jakarta"] },
  { q: "G20 adalah forum dari berapa negara?", a: ["20","dua puluh"] },
  { q: "IMF singkatan dari?", a: ["international monetary fund","dana moneter internasional"] },
  { q: "WTO singkatan dari?", a: ["world trade organization","organisasi perdagangan dunia"] },
  { q: "UNICEF adalah badan PBB yang mengurus?", a: ["anak-anak","kesejahteraan anak"] },
  { q: "UNESCO mengurus bidang?", a: ["pendidikan ilmu pengetahuan budaya","kebudayaan"] },
  { q: "Berapa km² luas wilayah Indonesia?", a: ["1905000","1.905.000","1.9 juta km2"] },
  { q: "Indonesia adalah negara kepulauan terbesar ke berapa di dunia?", a: ["1","pertama","terbesar"] },
  { q: "Populasi Indonesia terbesar ke berapa di dunia?", a: ["4","keempat"] },
  { q: "Bahasa Indonesia resmi menjadi bahasa negara sejak?", a: ["1945","proklamasi","17 agustus 1945"] },
  { q: "Bendera Indonesia terdiri dari dua warna yaitu?", a: ["merah dan putih"] },
  { q: "Arti warna merah pada bendera Indonesia?", a: ["berani","keberanian"] },
  { q: "Arti warna putih pada bendera Indonesia?", a: ["suci","kesucian"] },
  { q: "Jam tangan pertama di dunia dibuat di negara?", a: ["swiss","jerman","inggris"] },
  { q: "Kacamata pertama kali ditemukan di negara?", a: ["italia"] },
  { q: "Siapa yang menemukan toilet modern?", a: ["thomas crapper","john harington","crapper"] },
  { q: "Internet pertama kali dikembangkan sebagai proyek?", a: ["arpanet","militer","departemen pertahanan as"] },
  { q: "Apa nama protokol yang mengatur internet?", a: ["tcp/ip","tcpip"] },
  { q: "Email pertama dikirim tahun?", a: ["1971"] },
  { q: "Website pertama di dunia dibuat oleh?", a: ["tim berners-lee","berners lee"] },
  { q: "Siapa yang menemukan telepon?", a: ["alexander graham bell","graham bell","bell"] },
  { q: "Siapa yang menemukan televisi?", a: ["john logie baird","baird","philo farnsworth"] },
  { q: "Siapa yang menemukan sinar X?", a: ["wilhelm rontgen","rontgen"] },
  { q: "Siapa yang menemukan dinamit?", a: ["alfred nobel","nobel"] },
  { q: "Hadiah Nobel pertama kali diberikan tahun?", a: ["1901"] },
  { q: "Ada berapa kategori hadiah Nobel?", a: ["6","enam"] },
  { q: "Siapa penerima Nobel Perdamaian dari Indonesia?", a: ["east timor","jose ramos horta","carlos filipe ximenes belo"] },
  { q: "Apa warna rompi pengaman di lapangan konstruksi?", a: ["jingga","oranye","kuning","orange"] },
  { q: "Apa warna tanda larangan dalam rambu lalu lintas?", a: ["merah"] },
  { q: "Apa warna tanda peringatan dalam rambu lalu lintas?", a: ["kuning"] },
  { q: "Apa warna tanda perintah dalam rambu lalu lintas?", a: ["biru"] },
  { q: "Berapa warna dalam pelangi?", a: ["7","tujuh"] },
  { q: "Urutan warna pelangi dari atas ke bawah?", a: ["mejikuhibiniu","merah jingga kuning hijau biru nila ungu"] },
  { q: "Warna primer dalam cat adalah?", a: ["merah kuning biru","red yellow blue"] },
  { q: "Warna primer cahaya adalah?", a: ["merah hijau biru","rgb","red green blue"] },
  { q: "Campuran merah dan biru menghasilkan?", a: ["ungu","violet","purple"] },
  { q: "Campuran merah dan kuning menghasilkan?", a: ["jingga","orange"] },
  { q: "Campuran biru dan kuning menghasilkan?", a: ["hijau","green"] },
  { q: "Siapa penemu vaksin polio?", a: ["jonas salk","salk","albert sabin"] },
  { q: "Penyakit yang hampir musnah karena vaksin?", a: ["cacar","polio","cacar air"] },
  { q: "Masker medis berbentuk N95 efektif menyaring berapa persen partikel?", a: ["95%","95"] },
  { q: "Apa nama penyakit pandemi tahun 2020?", a: ["covid-19","covid","coronavirus"] },
  { q: "Virus penyebab COVID-19 adalah?", a: ["sars-cov-2","coronavirus","corona"] },
  { q: "Vaksin COVID-19 pertama yang mendapat izin darurat?", a: ["pfizer","biontech pfizer"] },
  { q: "Apa singkatan PCR dalam tes COVID?", a: ["polymerase chain reaction"] },
  { q: "Cuci tangan yang baik minimal berapa detik?", a: ["20","20 detik"] },
  { q: "Apa itu herd immunity?", a: ["kekebalan kelompok","kekebalan kawanan","imunitas kawanan"] },
  { q: "Berapa persen alkohol efektif untuk disinfektan tangan?", a: ["60-70%","60%","70%"] },
  { q: "Siapa presiden Amerika Serikat ke-44?", a: ["barack obama","obama"] },
  { q: "Siapa presiden Amerika Serikat pertama yang berkulit hitam?", a: ["barack obama","obama"] },
  { q: "Siapa perdana menteri Inggris yang terkenal saat Perang Dunia II?", a: ["winston churchill","churchill"] },
  { q: "Siapa pemimpin India yang terkenal dengan gerakan non-kekerasan?", a: ["mahatma gandhi","gandhi"] },
  { q: "Siapa Nelson Mandela?", a: ["presiden Afrika Selatan","pejuang apartheid","aktivis","anti apartheid"] },
  { q: "Siapa yang memimpin revolusi komunis di Rusia?", a: ["vladimir lenin","lenin"] },
  { q: "Siapa pemimpin China pertama setelah revolusi 1949?", a: ["mao zedong","mao tse tung"] },
  { q: "Negara apa yang pertama kali menggunakan nuklir dalam perang?", a: ["Amerika Serikat","as","usa"] },
  { q: "Piagam HAM internasional pertama disebut?", a: ["magna carta","deklarasi universal hak asasi manusia"] },
  { q: "PBB didirikan tahun berapa?", a: ["1945"] },
  { q: "Markas besar PBB berada di kota?", a: ["new york","new york city"] },
  { q: "Berapa anggota tetap Dewan Keamanan PBB?", a: ["5","lima"] },
  { q: "Negara mana saja yang jadi anggota tetap DK PBB?", a: ["as china rusia inggris prancis","p5","lima negara besar"] },
  { q: "Siapa sekjen PBB saat ini?", a: ["antonio guterres","guterres"] },
  { q: "IMF berpusat di kota?", a: ["washington dc","washington"] },
  { q: "Bank Dunia berpusat di kota?", a: ["washington dc","washington"] },
  { q: "ADB (Asian Development Bank) berpusat di?", a: ["manila","filipina"] },
  { q: "Siapa Gubernur Bank Indonesia saat ini?", a: ["perry warjiyo","perry"] },
  { q: "Sistem pembayaran digital Indonesia?", a: ["qris","gopay","ovo","dana"] },
  { q: "Mata uang digital milik pemerintah Indonesia akan disebut?", a: ["rupiah digital","e-rupiah"] },
  { q: "Apa nama teknologi sidik jari di smartphone?", a: ["fingerprint sensor","sensor sidik jari"] },
  { q: "Apa nama teknologi pengenal wajah di smartphone?", a: ["face id","face recognition","pengenal wajah"] },
  { q: "GPS singkatan dari?", a: ["global positioning system"] },
  { q: "Satelit komunikasi pertama milik Indonesia?", a: ["palapa","satelit palapa"] },
  { q: "Roket milik Indonesia yang sedang dikembangkan?", a: ["roket r han","rhan","lapan"] },
  { q: "BRIN adalah singkatan dari?", a: ["badan riset dan inovasi nasional"] },
  { q: "LAPAN sebelum jadi BRIN adalah singkatan dari?", a: ["lembaga penerbangan dan antariksa nasional"] },
  { q: "Apa nama stasiun ruang angkasa internasional?", a: ["iss","international space station"] },
  { q: "Misi Apollo yang pertama mendarat di bulan adalah?", a: ["apollo 11"] },
  { q: "Wahana luar angkasa yang sudah meninggalkan tata surya?", a: ["voyager 1","voyager"] },
  { q: "Teleskop luar angkasa yang paling terkenal sebelum James Webb?", a: ["hubble","teleskop hubble"] },
  { q: "Apa nama program NASA yang mengirim manusia ke bulan?", a: ["apollo","program apollo"] },
  { q: "Wahana yang berhasil mendarat di Mars?", a: ["perseverance","curiosity","mars rover"] },
  { q: "Apa nama planet kerdil yang dulunya dianggap planet ke-9?", a: ["pluto"] },
  { q: "Tahun berapa Pluto diturunkan statusnya?", a: ["2006"] },
  { q: "Apa nama badan yang menentukan klasifikasi planet?", a: ["iau","international astronomical union"] },
  { q: "Berapa jarak antara bumi dan matahari dalam satuan astronomis?", a: ["1 au","1","satu au"] },
  { q: "Apa nama fenomena ketika bulan menutupi matahari?", a: ["gerhana matahari","solar eclipse"] },
  { q: "Apa nama fenomena ketika bumi menutupi bulan?", a: ["gerhana bulan","lunar eclipse"] },
  { q: "Pasang surut air laut dipengaruhi oleh gravitasi?", a: ["bulan","bulan dan matahari"] },
  { q: "Apa nama angin laut yang bertiup dari laut ke darat pada siang hari?", a: ["angin laut","sea breeze"] },
  { q: "Apa nama angin yang bertiup dari darat ke laut pada malam hari?", a: ["angin darat","land breeze"] },
  { q: "Apa nama angin kencang di puncak gunung yang turun ke lembah?", a: ["angin fohn","fohn","föhn"] },
  { q: "Badai Katrina tahun 2005 melanda kota?", a: ["new orleans","louisiana"] },
  { q: "Letusan gunung berapi terbesar dalam sejarah modern?", a: ["tambora","krakatau","mt pinatubo"] },
  { q: "Letusan Gunung Tambora terjadi tahun?", a: ["1815"] },
  { q: "Letusan Gunung Krakatau besar terjadi tahun?", a: ["1883"] },
  { q: "Bencana tsunami terbesar tahun 2004 berpusat di?", a: ["samudera hindia","sumatera","aceh"] },
  { q: "Gempa terbesar yang tercatat dalam sejarah terjadi di?", a: ["chile","valdivia","1960"] },
  { q: "Zona gempa paling aktif di dunia disebut?", a: ["ring of fire","cincin api pasifik"] },
  { q: "Indonesia berada di zona ring of fire, berapa gunung berapi aktif?", a: ["127","130","129"] },
  { q: "Apa nama gunung berapi paling aktif di dunia?", a: ["kilauea","etna","merapi"] },
  { q: "Gunung berapi paling aktif di Indonesia?", a: ["merapi","semeru","sinabung"] },
  { q: "Letusan Gunung Merapi terakhir besar?", a: ["2010","2021"] },
  { q: "Gejala awal akan terjadi gempa bumi yang bisa dirasakan hewan?", a: ["perilaku aneh hewan","hewan gelisah"] },
  // === BATCH 5 (penutup 1000) ===
  { q: "Apa nama alat musik tiup tradisional Papua?", a: ["tifa","fu"] },
  { q: "Siapa penemu hukum Archimedes?", a: ["archimedes"] },
  { q: "Hukum Archimedes berbunyi tentang?", a: ["gaya apung","benda dalam cairan","benda yang tercelup"] },
  { q: "Apa nama proses pengolahan biji kakao menjadi cokelat?", a: ["fermentasi","pengolahan cokelat"] },
  { q: "Apa nama gunung tertinggi di Jawa Barat?", a: ["ceremai","ciremai"] },
  { q: "Kota di Indonesia yang dijuluki 'Kota Kembang'?", a: ["bandung"] },
  { q: "Kota di Indonesia yang dijuluki 'Kota Pahlawan'?", a: ["surabaya"] },
  { q: "Kota di Indonesia yang dijuluki 'Kota Pelajar'?", a: ["yogyakarta"] },
  { q: "Kota di Indonesia yang dijuluki 'Kota Seribu Candi'?", a: ["magelang","yogyakarta","solo"] },
  { q: "Apa nama danau vulkanik di Sumatera Utara?", a: ["danau toba","toba"] },
  { q: "Berapa meter panjang lapangan bola standar FIFA?", a: ["100-110 meter","105 meter","100 sampai 110"] },
  { q: "Siapa pencipta permainan basket?", a: ["james naismith","naismith"] },
  { q: "Siapa pencipta permainan voli?", a: ["william morgan","morgan"] },
  { q: "Olahraga apa yang menggunakan raket dan net tapi bola berbulu?", a: ["bulu tangkis","badminton"] },
  { q: "Apa nama teknik berenang paling cepat?", a: ["gaya kupu-kupu","butterfly"] },
  { q: "Apa nama gerakan dasar bela diri yang bukan tendangan?", a: ["pukulan","tangkisan","kuncian","bantingan"] },
  { q: "Sabuk warna apa yang tertinggi dalam karate?", a: ["hitam","black belt"] },
  { q: "Film animasi Disney tentang putri berambut panjang?", a: ["rapunzel","tangled"] },
  { q: "Karakter Disney yang terkenal adalah tikus bernama?", a: ["mickey mouse"] },
  { q: "Siapa nama pacar Mickey Mouse?", a: ["minnie mouse","minnie"] },

];

let quizQuestions  = [...DEFAULT_QUESTIONS];
let quizState = {
  isActive      : false,
  question      : null,  // { q, a[] }
  questionIndex : 0,
  answers       : [],    // { userId, username, nickname, avatar, answer, correct, timestamp }
  winner        : null,  // user pertama yang benar
  roundEndTime  : null,
  tiktokUser    : "",
  connected     : false,
  leaderboard   : {},    // userId → { username, nickname, avatar, score }
  questionNumber: 0,
};

let quizTimer      = null;
let quizConnection = null;

function quizNormalize(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function quizCheckAnswer(input, answers) {
  const norm = quizNormalize(input);
  return answers.some(a => quizNormalize(a) === norm);
}

function quizNextQuestion() {
  if (quizTimer) { clearTimeout(quizTimer); quizTimer = null; }
  if (quizQuestions.length === 0) return;

  const idx = quizState.questionNumber % quizQuestions.length;
  quizState.question      = quizQuestions[idx];
  quizState.answers       = [];
  quizState.winner        = null;
  quizState.isActive      = true;
  quizState.roundEndTime  = Date.now() + QUESTION_DURATION * 1000;
  quizState.questionNumber++;
  quizState.questionIndex = idx;

  console.log(`❓ [QUIZ] Q${quizState.questionNumber}: "${quizState.question.q}" → ${quizState.question.a.join("/")}`);

  broadcast({ game: "quiz", type: "NEW_QUESTION",
    question      : quizState.question.q,
    questionNumber: quizState.questionNumber,
    duration      : QUESTION_DURATION,
    roundEndTime  : quizState.roundEndTime,
  });

  quizTimer = setTimeout(() => {
    if (!quizState.isActive) return;
    quizState.isActive = false;
    console.log(`⏰ [QUIZ] Waktu habis — jawaban: ${quizState.question.a[0]}`);
    broadcast({ game: "quiz", type: "QUESTION_TIMEOUT",
      answer    : quizState.question.a[0],
      leaderboard: quizGetLeaderboard(),
    });
    setTimeout(quizNextQuestion, 5000);
  }, QUESTION_DURATION * 1000);
}

function quizProcessAnswer(userId, username, raw, nickname, avatar) {
  if (!quizState.isActive) return;
  if (quizState.winner) return; // sudah ada yang benar, tunggu soal berikutnya

  const answer  = raw.trim();
  const correct = quizCheckAnswer(answer, quizState.question.a);

  const answerData = { userId, username, nickname: nickname||username, avatar, answer, correct, timestamp: Date.now() };
  quizState.answers.push(answerData);

  console.log(`  ${correct?"✅":"❌"} [QUIZ] ${username}: "${answer}"`);

  broadcast({ game: "quiz", type: "NEW_ANSWER", answer: answerData });

  if (correct) {
    quizState.winner   = username;
    quizState.isActive = false;
    if (quizTimer) { clearTimeout(quizTimer); quizTimer = null; }

    // Update leaderboard
    if (!quizState.leaderboard[userId]) {
      quizState.leaderboard[userId] = { username, nickname: nickname||username, avatar, score: 0 };
    }
    quizState.leaderboard[userId].score++;

    broadcast({ game: "quiz", type: "CORRECT_ANSWER",
      winner      : username,
      nickname    : nickname||username,
      avatar,
      answer      : quizState.question.a[0],
      leaderboard : quizGetLeaderboard(),
    });

    setTimeout(quizNextQuestion, 6000);
  }
}

function quizGetLeaderboard() {
  return Object.values(quizState.leaderboard)
    .sort((a,b) => b.score - a.score)
    .slice(0, 10);
}

// ============================================================
// TIKTOK — shared handler, tapi game terpisah
// ============================================================
async function connectTikTok(game, username, sessionId = "") {
  // Putuskan koneksi lama kalau ada
  const oldConn = game === "wordle" ? wordleConnection
               : game === "contexto" ? contextoConnection
               : quizConnection;
  if (oldConn) { try { oldConn.disconnect(); } catch(e) {} }

  const options = {
    processInitialData    : false,
    enableExtendedGiftInfo: false,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    clientParams: { app_language: "id-ID", device_platform: "web" },
  };
  if (sessionId && sessionId.trim()) options.sessionId = sessionId.trim();

  const conn = new WebcastPushConnection(username, options);

  if (game === "wordle") {
    wordleConnection = conn;
    wordleState.tiktokUser = username;
    wordleState.connected  = false;
  } else if (game === "contexto") {
    contextoConnection = conn;
    contextoState.tiktokUser = username;
    contextoState.connected  = false;
  } else {
    quizConnection = conn;
    quizState.tiktokUser = username;
    quizState.connected  = false;
  }

  conn.on("connect", () => {
    console.log(`✅ [${game.toUpperCase()}] Connected ke @${username}`);
    if (game === "wordle") wordleState.connected = true;
    else sekataState.connected = true;
    broadcast({ game, type: "TIKTOK_CONNECTED", username });
  });

  conn.on("disconnect", () => {
    console.log(`❌ [${game.toUpperCase()}] Disconnect`);
    if (game === "wordle") wordleState.connected = false;
    else sekataState.connected = false;
    broadcast({ game, type: "TIKTOK_DISCONNECTED" });
  });

  conn.on("error", err => {
    broadcast({ game, type: "TIKTOK_ERROR", message: err.message });
  });

  conn.on("chat", data => {
    const comment  = (data.comment || "").trim();
    if (!comment) return;

    const userId   = String(data.uniqueId || (data.userId && Number(data.userId) > 0 ? data.userId : null) || `guest_${Date.now()}`);
    const username = String(data.uniqueId || data.userId || "anon");
    const nickname = String(data.nickname || username);
    const avatar   = String(data.profilePictureUrl || "");

    const cleaned = comment.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, "").toLowerCase();

    const isGuess = game === "quiz" ? comment.trim().length >= 1 : cleaned.length >= 2;
    broadcast({ game, type: "CHAT_MESSAGE", username, nickname, avatar, message: comment, isGuess });

    if (game === "wordle") {
      const upper = cleaned.toUpperCase();
      if (upper.length === 5) wordleProcessGuess(userId, username, upper, nickname, avatar);
    } else if (game === "contexto") {
      if (cleaned.length >= 2) contextoProcessGuess(userId, username, cleaned, nickname, avatar);
    } else if (game === "quiz") {
      quizProcessAnswer(userId, username, comment.trim(), nickname, avatar);
    }
  });

  try {
    await conn.connect();
    if (game === "wordle") wordleStartRound();
    else if (game === "contexto") await contextoStartRound();
    else quizNextQuestion();
  } catch (err) {
    console.error(`Gagal connect [${game}]:`, err.message);
    broadcast({ game, type: "TIKTOK_ERROR", message: `Gagal connect: ${err.message}` });
  }
}

// ============================================================
// API — WORDLE
// ============================================================
app.post("/api/wordle/connect", async (req, res) => {
  const { username, sessionId } = req.body;
  if (!username) return res.json({ success: false, message: "Username diperlukan" });
  connectTikTok("wordle", username.replace("@",""), sessionId||"");
  res.json({ success: true });
});

app.post("/api/wordle/disconnect", (req, res) => {
  if (wordleConnection) { try { wordleConnection.disconnect(); } catch(e) {} wordleConnection = null; }
  if (wordleTimer)      { clearTimeout(wordleTimer); wordleTimer = null; }
  wordleState.connected = false; wordleState.isActive = false;
  res.json({ success: true });
});

app.post("/api/wordle/new-round",  (req, res) => { wordleStartRound(); res.json({ success: true }); });

app.post("/api/wordle/test-guess", (req, res) => {
  const { username, word } = req.body;
  wordleProcessGuess(`test_${Date.now()}`, username||"tester", (word||"").toUpperCase(), "Tester", "");
  res.json({ success: true });
});

app.get("/api/wordle/state", (req, res) => {
  res.json({ ...wordleState, secretWord: wordleState.isActive ? "?????" : wordleState.secretWord, totalWords: WORDLE_WORDS.length, duration: ROUND_DURATION_WORDLE });
});

// ============================================================
// API — CONTEXTO
// ============================================================
app.post("/api/contexto/connect", async (req, res) => {
  const { username, sessionId } = req.body;
  if (!username) return res.json({ success: false, message: "Username diperlukan" });
  connectTikTok("contexto", username.replace("@",""), sessionId||"");
  res.json({ success: true });
});

app.post("/api/contexto/disconnect", (req, res) => {
  if (contextoConnection) { try { contextoConnection.disconnect(); } catch(e) {} contextoConnection = null; }
  if (contextoTimer)      { clearTimeout(contextoTimer); contextoTimer = null; }
  contextoState.connected = false; contextoState.isActive = false;
  res.json({ success: true });
});

app.post("/api/contexto/new-round",  (req, res) => { contextoStartRound(); res.json({ success: true }); });

app.post("/api/contexto/test-guess", (req, res) => {
  const { username, word } = req.body;
  contextoProcessGuess(`test_${Date.now()}`, username||"tester", (word||"").toLowerCase(), "Tester", "");
  res.json({ success: true });
});

app.get("/api/contexto/state", (req, res) => {
  res.json({ ...contextoState, secretWord: contextoState.isActive ? "?????" : contextoState.secretWord, duration: ROUND_DURATION_CONTEXTO });
});

// ============================================================
// API — QUIZ
// ============================================================
app.post("/api/quiz/connect", async (req, res) => {
  const { username, sessionId } = req.body;
  if (!username) return res.json({ success: false, message: "Username diperlukan" });
  connectTikTok("quiz", username.replace("@",""), sessionId||"");
  res.json({ success: true });
});

app.post("/api/quiz/disconnect", (req, res) => {
  if (quizConnection) { try { quizConnection.disconnect(); } catch(e) {} quizConnection = null; }
  if (quizTimer)      { clearTimeout(quizTimer); quizTimer = null; }
  quizState.connected = false; quizState.isActive = false;
  res.json({ success: true });
});

app.post("/api/quiz/next",   (req, res) => { quizNextQuestion(); res.json({ success: true }); });
app.post("/api/quiz/reset",  (req, res) => {
  quizState.leaderboard = {};
  quizState.questionNumber = 0;
  res.json({ success: true });
});

// Streamer bisa kirim soal custom: POST /api/quiz/questions [{q, a:[...]}, ...]
app.post("/api/quiz/questions", (req, res) => {
  const qs = req.body;
  if (!Array.isArray(qs) || qs.length === 0) return res.json({ success: false, message: "Format salah" });
  quizQuestions = qs.map(item => ({ q: item.q, a: Array.isArray(item.a) ? item.a : [item.a] }));
  quizState.questionNumber = 0;
  console.log(`📝 [QUIZ] ${quizQuestions.length} soal custom di-set`);
  res.json({ success: true, count: quizQuestions.length });
});

app.get("/api/quiz/state", (req, res) => {
  res.json({
    ...quizState,
    question: quizState.isActive ? quizState.question?.q : null,
    leaderboard: quizGetLeaderboard(),
    duration: QUESTION_DURATION,
  });
});

// ============================================================
// WEBSOCKET
// ============================================================
wss.on("connection", ws => {
  console.log("🌐 Browser connected");
  // Kirim state kedua game sekaligus
  ws.send(JSON.stringify({ type: "INIT",
    wordle  : { ...wordleState,  secretWord: wordleState.isActive  ? "?????" : wordleState.secretWord,  totalWords: WORDLE_WORDS.length, duration: ROUND_DURATION_WORDLE },
    contexto: { ...contextoState, secretWord: contextoState.isActive ? "?????" : contextoState.secretWord, duration: ROUND_DURATION_CONTEXTO },
  }));
});

// ============================================================
// START
// ============================================================
const PORT = process.env.PORT || 3000;

(async () => {
  await sekataLoadVectors();
  server.listen(PORT, () => {
    console.log(`\n🎮 Game Hub — Port ${PORT}`);
    console.log(`   Wordle : ${WORDLE_WORDS.length} kata`);
    console.log(`   Vectors : ${sekata_vocab.length} kata`);
    console.log(`   Buka   : http://localhost:${PORT}\n`);
  });
})();
