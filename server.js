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
  const oldConn = game === "wordle" ? wordleConnection : sekataConnection;
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

    broadcast({ game, type: "CHAT_MESSAGE", username, nickname, avatar, message: comment, isGuess: cleaned.length >= 2 });

    if (game === "wordle") {
      const upper = cleaned.toUpperCase();
      if (upper.length === 5) wordleProcessGuess(userId, username, upper, nickname, avatar);
    } else if (game === "contexto") {
      if (cleaned.length >= 2) contextoProcessGuess(userId, username, cleaned, nickname, avatar);
    } else if (game === "quiz") {
      if (comment.trim().length >= 1) quizProcessAnswer(userId, username, comment.trim(), nickname, avatar);
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
    console.log(`   Sekata : ${sekata_vocab.length} kata`);
    console.log(`   Buka   : http://localhost:${PORT}\n`);
  });
})();
