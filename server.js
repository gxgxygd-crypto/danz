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
// WORD LIST (1000+ kata)
// =============================================
const WORD_LIST = [
  // === INDONESIA - ALAM ===
  "HUTAN", "GUNUNG","PANTAI","SUNGAI","KOLAM", "SAWAH", "KEBUN",
  "BUKIT", "DANAU", "PADANG","LERENG","JURANG","TEBING","PASIR",
  "TANAH", "KARANG","OMBAK", "ANGIN", "HUJAN", "PETIR", "TOPAN",
  "BADAI", "KABUT", "EMBUN", "FAJAR", "SENJA", "MALAM", "SUBUH",
  "SIANG", "UDARA", "RUMPUT","LUMUT", "PAKIS", "BUNGA", "POHON",

  // === INDONESIA - HEWAN ===
  "KUDA",  "SAPI",  "KAMBING","ANJING","KUCING","TIKUS", "KELINCI",
  "BEBEK", "ITIK",  "ELANG", "BANGAU","MERAK", "BUAYA", "KATAK",
  "KODOK", "LEBAH", "KUPU",  "SEMUT", "LALAT", "HARIMAU","GAJAH",
  "ULAR",  "MONYET","KERBAU","DOMBA", "BABI",  "SINGA", "RUSA",
  "BERUANG","MACAN","SERIGALA","RUBAH","LANDAK","TUPAI","MUSANG",

  // === INDONESIA - MAKANAN ===
  "NASI",  "ROTI",  "BUBUR", "SOTO",  "SATE",  "BAKSO", "GULAI",
  "OPOR",  "RAWON", "PEMPEK","TEMPE", "TAHU",  "TERASI","KECAP",
  "SAMBAL","BUMBU", "DAGING","TELUR", "SUSU",  "KEJU",  "GARAM",
  "GULA",  "MERICA","JAHE",  "KUNYIT","SERAI",  "MADU",  "SANTAN",
  "MANGGA","PEPAYA","PISANG","JERUK","SEMANGKA","MELON","NANAS",
  "DURIAN","MANGGIS","SALAK","JAMBU","KELAPA","ALPUKAT","LEMON",
  "KOPI",  "TEH",   "JAMU",  "SIRUP", "SODA",  "RENDANG","LODEH",
  "GADO",  "TONGSENG","SEMUR","BALADO","DENDENG","PECEL","RUJAK",
  "LONTONG","KETUPAT","LEPET","LUPIS","KLEPON","ONDE","LEMPER",

  // === INDONESIA - TUBUH ===
  "HIDUNG","MULUT", "TELINGA","PIPI", "DAHI",  "DAGU",  "LEHER",
  "BAHU",  "LENGAN","TANGAN","JARI",  "KUKU",  "DADA",  "PERUT",
  "KAKI",  "LUTUT", "BETIS", "TUMIT", "TULANG","OTOT",  "DARAH",
  "JANTUNG","PARU", "HATI",  "GINJAL","OTAK",  "KULIT", "RAMBUT",
  "BIBIR", "GIGI",  "LIDAH", "NAFAS", "ALIS",  "BULU",  "TELAPAK",

  // === INDONESIA - RUMAH & BENDA ===
  "KURSI", "MEJA",  "LEMARI","KASUR", "BANTAL","TIKAR", "KARPET",
  "PINTU", "ATAP",  "LANTAI","DINDING","TIANG","TANGGA","DAPUR",
  "KAMAR", "TERAS", "GARASI","SUMUR", "PAGAR", "PIRING","GELAS",
  "SENDOK","GARPU", "PISAU", "WAJAN", "PANCI", "EMBER", "GAYUNG",
  "SABUN", "SIKAT", "SAPU",  "KAIN",  "BENANG","JARUM", "LAMPU",
  "KIPAS", "KULKAS","MESIN", "POMPA", "KUNCI", "GEMBOK","TALI",
  "BUKU",  "PENSIL","PENA",  "GUNTING","LEM",  "KERTAS","AMPLOP",
  "CERMIN","SISIR", "BEDAK", "PARFUM","PAYUNG","TONGKAT","TANGGA",

  // === INDONESIA - PAKAIAN ===
  "BAJU",  "CELANA","KEMEJA","KAOS",  "JAKET", "MANTEL","SEPATU",
  "SANDAL","TOPI",  "JILBAB","KERUDUNG","IKAT","SABUK", "DOMPET",
  "CINCIN","GELANG","KALUNG","ANTING","KACAMATA","SARUNG","BLUS",
  "GAUN",  "SYAL",  "SELENDANG","ROMPI","KAUS", "BARET","HELM",

  // === INDONESIA - PEKERJAAN ===
  "GURU",  "DOKTER","POLISI","PETANI","NELAYAN","SOPIR","PILOT",
  "HAKIM", "JAKSA", "INSINYUR","ARSITEK","AKUNTAN","BIDAN","PERAWAT",
  "ARTIS", "AKTOR", "MUSISI","PELUKIS","PENULIS","EDITOR","DESAINER",
  "JURNALIS","PENELITI","ILMUWAN","PENGUSAHA","PEDAGANG","BURUH","PEGAWAI",

  // === INDONESIA - TRANSPORTASI ===
  "MOBIL", "MOTOR", "SEPEDA","TRUK",  "BAJAJ", "BECAK", "KAPAL",
  "PERAHU","SAMPAN","KERETA","METRO", "PESAWAT","HELIKOPTER","ROKET",

  // === INDONESIA - SIFAT ===
  "BESAR", "KECIL", "PANJANG","PENDEK","TINGGI","RENDAH","LEBAR",
  "BERAT", "RINGAN","TEBAL",  "TIPIS", "KASAR", "HALUS", "KERAS",
  "PANAS", "DINGIN","HANGAT", "SEJUK", "KERING","BASAH", "CEPAT",
  "LAMBAT","TERANG","GELAP",  "CERAH", "BERSIH","KOTOR", "BAGUS",
  "JELEK", "CANTIK","TAMPAN", "INDAH", "BARU",  "LAMA",  "MAHAL",
  "MURAH", "KAYA",  "MISKIN", "GEMUK", "KURUS", "SEHAT", "SAKIT",
  "PINTAR","BODOH", "RAJIN",  "MALAS", "BERANI","TAKUT", "BAIK",
  "JAHAT", "JUJUR", "SETIA",  "RAMAH", "SOMBONG","MEWAH","KUNO",
  "MODERN","ANTIK", "ASLI",   "PALSU", "UTUH",  "RUSAK", "PENUH",
  "KOSONG","TAJAM", "TUMPUL", "LICIN", "KASAR", "LEMBUT","KERAS",
  "RAPUH", "KUAT",  "LEMAH",  "AKTIF", "PASIF", "SIBUK", "SANTAI",
  "TENANG","RIBUT", "GELISAH","BAHAGIA","SEDIH","MARAH", "SENANG",

  // === INDONESIA - KATA UMUM ===
  "KEREN", "DALAM", "DEPAN", "UTARA", "SELATAN","TIMUR","BARAT",
  "SUDAH", "BELUM", "TIDAK", "HARUS", "BOLEH",  "MUNGKIN","SELALU",
  "SERING","KADANG","SANGAT","AGAK",  "CUKUP",  "TERLALU","PALING",
  "SEMUA", "BANYAK","SEDIKIT","SETIAP","MASING", "LEBIH","KURANG",
  "SAMA",  "BEDA",  "MIRIP",  "DEKAT", "JAUH",   "CINTA","KASIH",
  "SAYANG","RINDU", "BANGGA", "MALU",  "TAKUT",  "BERANI","YAKIN",
  "RAGU",  "HARAP", "IMPIAN", "NYATA", "MIMPI",  "WAKTU","ZAMAN",
  "TAHUN", "BULAN", "MINGGU", "HARI",  "MENIT",  "DETIK","MASA",
  "DUNIA", "ALAM",  "BUMI",   "LANGIT","LAUT",   "DARAT","UDARA",
  "RAKYAT","BANGSA","NEGARA", "KOTA",  "DESA",   "KAMPUNG","PULAU",

  // === ENGLISH - A ===
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT",
  "AFTER", "AGAIN", "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM",
  "ALERT", "ALIKE", "ALIVE", "ALLEY", "ALLOW", "ALONE", "ALONG",
  "ALTAR", "ALTER", "ANGEL", "ANGER", "ANGLE", "ANGRY", "ANKLE",
  "APART", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARMED",
  "ARMOR", "ARRAY", "ARROW", "ASIDE", "ASSET", "ATLAS", "AVOID",
  "ABBEY", "ADORE", "AGILE", "AMPLE", "AUDIO", "AZURE", "AISLE",
  "ALOFT", "AMONG", "ANTIC", "APRON", "APTLY", "ARDOR", "AROMA",
  "ARTSY", "ASCOT", "ATTIC", "AUGUR", "AWAKE", "AWARE", "AWFUL",

  // === ENGLISH - B ===
  "BADGE", "BASIC", "BASIS", "BATCH", "BEACH", "BEARD", "BEAST",
  "BEGIN", "BEING", "BELOW", "BENCH", "BIRTH", "BLACK", "BLADE",
  "BLAME", "BLAND", "BLANK", "BLAST", "BLAZE", "BLEED", "BLEND",
  "BLESS", "BLIND", "BLOCK", "BLOOD", "BLOOM", "BLOWN", "BOARD",
  "BONUS", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BRAVE",
  "BREAD", "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF", "BRING",
  "BROAD", "BROKE", "BROWN", "BRUSH", "BUDDY", "BUILT", "BUNCH",
  "BURST", "BUYER", "BAKER", "BATHE", "BANJO", "BAYOU", "BEFOG",
  "BIRCH", "BISON", "BLIMP", "BLISS", "BLOAT", "BLUNT", "BLURB",
  "BOGUS", "BORAX", "BOTCH", "BOXER", "BRACE", "BRAID", "BRASH",
  "BRAWL", "BRAWN", "BRAZE", "BRINK", "BRISK", "BROIL", "BROOK",
  "BROTH", "BROWS", "BRUTE", "BUDGE", "BULGE", "BULLY", "BUMPY",
  "BUOY",  "BURNS", "BUSHY", "BUSTY",

  // === ENGLISH - C ===
  "CABIN", "CABLE", "CANDY", "CARRY", "CATCH", "CAUSE", "CHAIN",
  "CHAIR", "CHALK", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP",
  "CHECK", "CHEEK", "CHESS", "CHEST", "CHIEF", "CHILD", "CHOIR",
  "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF",
  "CLIMB", "CLOCK", "CLONE", "CLOSE", "CLOTH", "CLOUD", "COACH",
  "COAST", "COMET", "COMIC", "CORAL", "COURT", "COVER", "CRACK",
  "CRAFT", "CRANE", "CRASH", "CRAZY", "CREAM", "CREEK", "CRIME",
  "CRISP", "CROSS", "CROWD", "CROWN", "CRUEL", "CRUSH", "CURVE",
  "CYCLE", "CAMEO", "CARGO", "CEDAR", "CHAMP", "CHILL", "CIVIC",
  "CIVIL", "CLAMP", "CLASH", "CLASP", "CLING", "CLINK", "CORAL",
  "COUCH", "COUGH", "COULD", "CRAMP", "CRAVE", "CRIMP", "CRISP",
  "CRUDE", "CRUST", "CRYPT", "CUBIC", "CURLY", "CUTIE",

  // === ENGLISH - D ===
  "DAILY", "DANCE", "DEATH", "DELAY", "DELTA", "DENSE", "DEPOT",
  "DEPTH", "DEVIL", "DIRTY", "DITCH", "DIZZY", "DODGE", "DOING",
  "DONOR", "DOUBT", "DOUGH", "DRAFT", "DRAIN", "DRAMA", "DRANK",
  "DRAWN", "DREAD", "DREAM", "DRIFT", "DRINK", "DRIVE", "DROWN",
  "DRUNK", "DWARF", "DWELL", "DADDY", "DANDY", "DATED", "DEBUT",
  "DECOR", "DEEDS", "DEITY", "DISCO", "DITTY", "DODGY", "DOGMA",
  "DOLLY", "DOWDY", "DOWNY", "DUSKY", "DUSTY", "DUTCH",

  // === ENGLISH - E ===
  "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY",
  "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "ESSAY", "EVENT",
  "EVERY", "EXACT", "EXIST", "EXTRA", "EASEL", "EERIE", "ELBOW",
  "EMBER", "EMOTE", "EPOCH", "ETHIC", "EVOKE", "EXERT", "EXILE",
  "EXULT", "ENVY",  "EXPEL", "EXTOL",

  // === ENGLISH - F ===
  "FABLE", "FAINT", "FAIRY", "FAITH", "FALSE", "FANCY", "FATAL",
  "FEAST", "FEVER", "FIBER", "FIELD", "FIERY", "FIFTH", "FIGHT",
  "FINAL", "FIRST", "FIXED", "FLAME", "FLASH", "FLASK", "FLESH",
  "FLOAT", "FLOOD", "FLOOR", "FLOUR", "FLUID", "FOCUS", "FORCE",
  "FORGE", "FORTH", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD",
  "FRESH", "FRONT", "FROST", "FRUIT", "FULLY", "FUNNY", "FURRY",
  "FADED", "FLAIR", "FLARE", "FLOCK", "FLORA", "FLUSH", "FOGGY",
  "FOLLY", "FRAIL", "FREED", "FRISK", "FROTH", "FROZE", "FINCH",
  "FJORD", "FIZZY", "FLAKY", "FLANK", "FLAPS", "FLUNG", "FLUTE",
  "FOAMY", "FONDLY","FORTE", "FORTY", "FROND", "FRONT",

  // === ENGLISH - G ===
  "GAMMA", "GHOST", "GIANT", "GIVEN", "GLASS", "GLOBE", "GLOOM",
  "GLORY", "GLOVE", "GOING", "GRACE", "GRADE", "GRAIN", "GRAND",
  "GRANT", "GRAPE", "GRASP", "GRASS", "GRAVE", "GREAT", "GREED",
  "GREEN", "GREET", "GRIEF", "GRIND", "GROAN", "GROOM", "GROSS",
  "GROUP", "GROVE", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE",
  "GUILD", "GUILT", "GAUZE", "GAVEL", "GLEAM", "GLEAN", "GLIDE",
  "GLINT", "GLOAT", "GNOME", "GORGE", "GOURD", "GRIMY", "GRIPE",
  "GRUFF", "GUISE", "GULCH", "GULLY", "GUSTO", "GUSTY",

  // === ENGLISH - H ===
  "HABIT", "HARSH", "HASTE", "HAVEN", "HEART", "HEAVY", "HEDGE",
  "HINGE", "HOUSE", "HUMAN", "HUMID", "HUMOR", "HAZEL", "HEIST",
  "HELIX", "HIPPO", "HITCH", "HOARD", "HORDE", "HOUND", "HYPER",
  "HANDY", "HARDY", "HASTY", "HAUNT", "HEADY", "HIPPY", "HOMER",
  "HONEY", "HOPPY", "HORNY", "HOTLY", "HUSKY",

  // === ENGLISH - I ===
  "IDEAL", "IMAGE", "INDEX", "INPUT", "ISSUE", "IVORY", "IMPEL",
  "INEPT", "INFER", "INNER", "INTER", "INTRO", "IONIC", "IRATE",

  // === ENGLISH - J ===
  "JEWEL", "JOINT", "JUDGE", "JUICE", "JUMBO", "JAZZY", "JEANS",
  "JERKY", "JOKER", "JOLLY", "JOUST", "JUMPY", "JUICY",

  // === ENGLISH - K ===
  "KARMA", "KNIFE", "KNOCK", "KNOWN", "KAYAK", "KNEEL", "KNELT",
  "KNOBS", "KNOLL", "KINKY", "KOOKY",

  // === ENGLISH - L ===
  "LABEL", "LANCE", "LARGE", "LASER", "LATER", "LAUGH", "LAYER",
  "LEARN", "LEGAL", "LEVEL", "LIGHT", "LIMIT", "LIVER", "LOCAL",
  "LODGE", "LOGIC", "LOOSE", "LOVER", "LOWER", "LOYAL", "LUCKY",
  "LUNAR", "LANKY", "LARVA", "LATCH", "LEAFY", "LEAPT", "LEVER",
  "LIMBO", "LINGO", "LITHE", "LLAMA", "LOFTY", "LUMPY", "LYRIC",
  "LEMON", "LUSTY", "LACEY", "LAFFY", "LAKESIDE","LAUD","LEERY",
  "LINGO", "LINTY", "LOFTY", "LOUSY", "LOWLY",

  // === ENGLISH - M ===
  "MAGIC", "MAJOR", "MAKER", "MANOR", "MAPLE", "MARCH", "MARSH",
  "MATCH", "MAYOR", "MEANT", "MEDAL", "MEDIA", "MERCY", "MERIT",
  "METAL", "MIGHT", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL",
  "MOTOR", "MOTTO", "MOUNT", "MOUSE", "MOUTH", "MOVED", "MUSIC",
  "MANGO", "MAXIM", "MELEE", "MESSY", "MICRO", "MILKY", "MINTY",
  "MISER", "MISTY", "MOCHA", "MOODY", "MOSSY", "MOUSY", "MUGGY",
  "MURKY", "MUSHY", "MANLY", "MARBLE", "MANIA","MIRTH","MUTED",

  // === ENGLISH - N ===
  "NAIVE", "NERVE", "NEVER", "NEWER", "NIGHT", "NINJA", "NOBLE",
  "NORTH", "NOTED", "NOVEL", "NYMPH", "NIFTY", "NIPPY", "NITRO",
  "NOISY", "NOOSE", "NOTCH", "NUTTY", "NASTY", "NERDY", "NETTLE",

  // === ENGLISH - O ===
  "OCEAN", "OFFER", "OLIVE", "ONSET", "OPERA", "ORBIT", "ORDER",
  "OUTER", "OASIS", "OMBRE", "OPTIC", "OVATE", "ODDLY",

  // === ENGLISH - P ===
  "PAINT", "PANEL", "PAPER", "PARTY", "PASTA", "PATCH", "PAUSE",
  "PEACE", "PEARL", "PEDAL", "PENNY", "PHASE", "PHONE", "PHOTO",
  "PIANO", "PILOT", "PITCH", "PIXEL", "PIZZA", "PLACE", "PLAIN",
  "PLANE", "PLANT", "PLATE", "PLAZA", "POINT", "POKER", "POLAR",
  "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT",
  "PRIZE", "PROBE", "PROOF", "PROUD", "PROVE", "PROXY", "PULSE",
  "PURGE", "PANSY", "PASTY", "PEAKY", "PERKY", "PETTY", "PITHY",
  "PLAID", "PLUMB", "POUTY", "PRAWN", "PRIVY", "PSALM", "PUTTY",
  "PADDY", "PEPPY", "PIGGY", "PINKY", "PIVOT", "PLAZA", "PLUCK",
  "PLUME", "POUFY", "PRANK", "PRISM", "PROWL", "PRUNE",

  // === ENGLISH - Q ===
  "QUEEN", "QUEST", "QUICK", "QUIET", "QUOTA", "QUOTE", "QUAFF",
  "QUALM", "QUART", "QUASI", "QUIRK",

  // === ENGLISH - R ===
  "RADAR", "RADIO", "RAISE", "RALLY", "RANGE", "RAPID", "RATIO",
  "REACH", "READY", "REALM", "REBEL", "REIGN", "RELAX", "REPAY",
  "REPLY", "RESET", "RIGHT", "RIGID", "RISKY", "RIVAL", "RIVER",
  "ROBOT", "ROCKY", "ROUGH", "ROUND", "ROYAL", "RULER", "RURAL",
  "RUSTY", "RAVEN", "REGAL", "REMIX", "REPEL", "RESIN", "RETRO",
  "RIDER", "ROGUE", "ROOMY", "ROWDY", "RUDDY", "RASPY", "RATTY",
  "READY", "REEDY", "RISKY", "RITZY", "ROCKY", "ROOMY", "RUSTIC",

  // === ENGLISH - S ===
  "SAINT", "SAUCE", "SCALE", "SCARE", "SCENE", "SCOPE", "SCORE",
  "SCOUT", "SEIZE", "SENSE", "SEVEN", "SHADE", "SHAFT", "SHAKE",
  "SHALL", "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP", "SHEEP",
  "SHEER", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK",
  "SHORE", "SHORT", "SHOUT", "SIGHT", "SILLY", "SINCE", "SIXTH",
  "SKILL", "SKULL", "SLATE", "SLAVE", "SLEEP", "SLICE", "SLIDE",
  "SLOPE", "SLOTH", "SMART", "SMOKE", "SNAKE", "SOLAR", "SOLID",
  "SOLVE", "SONIC", "SORRY", "SOUTH", "SPARE", "SPEAK", "SPEAR",
  "SPEED", "SPELL", "SPEND", "SPICE", "SPIKE", "SPINE", "SPLIT",
  "SPOON", "SPORT", "SPRAY", "SQUAD", "STACK", "STAFF", "STAGE",
  "STAIN", "STAMP", "STAND", "STARE", "START", "STATE", "STEAM",
  "STEEL", "STEER", "STICK", "STILL", "STING", "STOCK", "STONE",
  "STORE", "STORM", "STORY", "STRAP", "STRIP", "STUCK", "STUDY",
  "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER", "SURGE", "SWAMP",
  "SWEAR", "SWEEP", "SWEET", "SWIFT", "SWIPE", "SWORD", "SAVVY",
  "SERUM", "SHADY", "SHEEN", "SHRUB", "SILKY", "SIREN", "SKIMP",
  "SKUNK", "SLINK", "SOGGY", "SOOTY", "SPANK", "SPAWN", "SPOOK",
  "SPUNK", "SQUAT", "SQUID", "STAID", "STEAK", "STEED", "STOMP",
  "STOIC", "STOUT", "STRAY", "STRUM", "STRUT", "SUEDE", "SULKY",
  "SUNNY", "SURLY", "SWANK", "SWARM", "SWOON", "SAUCY", "SCALY",
  "SCANT", "SCARY", "SEEDY", "SHAKY", "SHINY", "SLOPPY","SMOKY",
  "SNAKY", "SNAPPY","SNOWY", "SOFTY", "SORE",  "SPEWY", "SPICY",
  "SPIKY", "SPINY", "SPOOKY","STONY", "STUFFY","SUDSY", "SUNNY",
  "SWAMPY",

  // === ENGLISH - T ===
  "TABLE", "TASTE", "TEACH", "TEMPO", "TENSE", "TENTH", "TERMS",
  "THORN", "THREE", "THREW", "THROW", "THUMB", "TIMER", "TIRED",
  "TITLE", "TOKEN", "TOUGH", "TOWEL", "TOWER", "TRACK", "TRADE",
  "TRAIL", "TRAIN", "TRAIT", "TRICK", "TROOP", "TROVE", "TRUCK",
  "TRULY", "TRUNK", "TRUST", "TRUTH", "TULIP", "TUTOR", "TWICE",
  "TWIST", "TACKY", "TAFFY", "TALON", "TANGY", "TAUNT", "TAWNY",
  "TEPID", "TERSE", "TIDAL", "TIMID", "TIPSY", "TITAN", "TOTEM",
  "TRUCE", "TUBBY", "TUNIC", "TURBO", "TWILL", "TARDY", "TASTY",
  "TEARY", "TESTY", "THICK", "THORNY","TINNY", "TIPPY", "TIRED",
  "TOASTY","TOPSY", "TOTAL", "TOXIC", "TRENDY",

  // === ENGLISH - U ===
  "ULTRA", "UNCLE", "UNDER", "UNION", "UNITY", "UNTIL", "UPPER",
  "USAGE", "ULCER", "UNIFY", "UNLIT", "UNMET", "UNZIP",

  // === ENGLISH - V ===
  "VALID", "VALUE", "VALVE", "VAPOR", "VAULT", "VIBES", "VIDEO",
  "VIGOR", "VIRAL", "VIRUS", "VISIT", "VISTA", "VITAL", "VIVID",
  "VOCAL", "VOTER", "VAGUE", "VALET", "VAUNT", "VEGAN", "VENOM",
  "VERGE", "VERSE", "VEXED", "VILLA", "VISOR", "VIXEN", "VYING",

  // === ENGLISH - W ===
  "WATER", "WEARY", "WEAVE", "WEDGE", "WEIRD", "WHALE", "WHEEL",
  "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WIDER",
  "WITCH", "WOMAN", "WORLD", "WORSE", "WORST", "WORTH", "WOULD",
  "WOUND", "WRATH", "WRIST", "WROTE", "WACKY", "WAGED", "WAGER",
  "WAGON", "WARTY", "WASTE", "WATCH", "WIMPY", "WINDY", "WISPY",
  "WITTY", "WOOZY", "WRECK", "WRING", "WAFER", "WAKEY", "WANLY",
  "WARTY", "WASHY", "WEEDY", "WELLY", "WETLY", "WHINY", "WORMY",

  // === ENGLISH - X Y Z ===
  "XENON", "XYLEM", "YACHT", "YIELD", "YOUNG", "YOUTH", "ZEAL",
  "ZEBRA", "ZESTY", "ZILCH", "ZONAL",
];

// Filter hanya kata 5 huruf & hapus duplikat
const FILTERED_WORDS = [...new Set(WORD_LIST.filter(w => w.length === 5))];
console.log(`📚 Total kata valid: ${FILTERED_WORDS.length}`);

// =============================================
// GAME STATE
// =============================================
const ROUND_DURATION = 120; // 2 menit

let gameState = {
  secretWord: "",
  guesses: [],
  isActive: false,
  roundNumber: 0,
  winner: null,
  tiktokUser: "",
  connected: false,
  roundEndTime: null,
};

let roundTimer = null;

let tiktokConnection = null;

function getRandomWord() {
  return FILTERED_WORDS[Math.floor(Math.random() * FILTERED_WORDS.length)];
}

function checkGuess(guess, secret) {
  const result = [];
  const secretArr = secret.split("");
  const guessArr = guess.split("");
  const secretUsed = Array(5).fill(false);
  const guessUsed = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "correct";
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

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
  // Clear timer lama
  if (roundTimer) { clearTimeout(roundTimer); roundTimer = null; }

  gameState.secretWord = getRandomWord();
  gameState.guesses = [];
  gameState.isActive = true;
  gameState.winner = null;
  gameState.roundNumber++;
  gameState.roundEndTime = Date.now() + ROUND_DURATION * 1000;

  console.log(`🎮 Round ${gameState.roundNumber} started! Word: ${gameState.secretWord} (${ROUND_DURATION}s)`);

  broadcast({
    type: "NEW_ROUND",
    roundNumber: gameState.roundNumber,
    wordLength: gameState.secretWord.length,
    duration: ROUND_DURATION,
    roundEndTime: gameState.roundEndTime,
  });

  // Timer habis → game over
  roundTimer = setTimeout(() => {
    if (!gameState.isActive) return;
    gameState.isActive = false;
    broadcast({
      type: "GAME_OVER",
      word: gameState.secretWord,
      totalGuesses: gameState.guesses.length,
      reason: "timeout"
    });
    setTimeout(() => startNewRound(), 8000);
  }, ROUND_DURATION * 1000);
}

function processGuess(userId, username, word, nickname = "", avatar = "") {
  if (!gameState.isActive) return;
  if (word.length !== 5) return;

  const upperWord = word.toUpperCase();

  // Cek duplikat: userId yang sama + kata yang sama → skip
  // Beda userId boleh nebak kata yang sama
  const alreadyGuessed = gameState.guesses.some(
    g => g.userId === userId && g.word === upperWord
  );
  if (alreadyGuessed) {
    console.log(`⏭️  Skip: [${username}|${userId}] sudah nebak "${upperWord}"`);
    return;
  }
  
  console.log(`✅ Proses: [${username}|${userId}] "${upperWord}" (#${gameState.guesses.length + 1})`);

  const result = checkGuess(upperWord, gameState.secretWord);
  const isWinner = result.every(r => r === "correct");

  const guessData = {
    userId,
    username,
    nickname: nickname || username,
    avatar,
    word: upperWord,
    result,
    timestamp: Date.now(),
    guessNumber: gameState.guesses.length + 1
  };

  gameState.guesses.push(guessData);
  console.log(`💬 [${username}] ${upperWord} → ${result.join(",")}${isWinner ? " 🏆 WINNER!" : ""}`);

  broadcast({ type: "NEW_GUESS", guess: guessData, totalGuesses: gameState.guesses.length });

  if (isWinner) {
    gameState.winner = username;
    gameState.isActive = false;
    if (roundTimer) { clearTimeout(roundTimer); roundTimer = null; }
    setTimeout(() => {
      broadcast({ type: "GAME_WON", winner: username, nickname, avatar, word: gameState.secretWord, totalGuesses: gameState.guesses.length });
    }, 500);
    setTimeout(() => startNewRound(), 8000);
  }
}

// =============================================
// TIKTOK LIVE CONNECTION
// =============================================
async function connectTikTok(username, sessionId = "") {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch(e) {}
    tiktokConnection = null;
  }

  gameState.tiktokUser = username;
  gameState.connected = false;

  const options = {
    processInitialData: false,
    enableExtendedGiftInfo: false,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    clientParams: { app_language: "id-ID", device_platform: "web" }
  };

  // Tambah sessionId kalau ada — diperlukan untuk akun yang privat atau butuh autentikasi
  if (sessionId && sessionId.trim()) {
    options.sessionId = sessionId.trim();
    console.log("🔑 Menggunakan Session ID untuk autentikasi");
  }

  const connection = new WebcastPushConnection(username, options);

  tiktokConnection = connection;

  connection.on("connect", () => {
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
    const comment = (data.comment || "").trim();
    if (!comment) return;

    // uniqueId = @handle TikTok, SELALU unik per akun, tidak pernah "0"
    // Ini identifier terbaik dan paling konsisten
    const uniqueId = data.uniqueId ? String(data.uniqueId) : null;

    // userId numerik dari TikTok — hati-hati: bisa bernilai 0 untuk guest
    // Jadi hanya pakai kalau > 0
    const numericId = (data.userId && Number(data.userId) > 0) ? String(data.userId) : null;

    // Pilih identifier: uniqueId (@handle) > numericId > random
    // Jangan pakai "0" sebagai identifier karena semua guest share nilai yang sama
    const userId   = uniqueId || numericId || `guest_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const username = uniqueId || numericId || "anon";
    const nickname = data.nickname ? String(data.nickname) : username;
    const avatar   = data.profilePictureUrl ? String(data.profilePictureUrl) : "";

    // Bersihkan komentar: hapus emoji, aksen, spasi, simbol — sisakan huruf saja
    const cleaned = comment
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")   // hapus aksen
      .replace(/[^a-zA-Z]/g, "")          // hanya huruf A-Z
      .toUpperCase();

    const isGuess = cleaned.length === 5;

    console.log(`💬 @${username} (id:${userId}): "${comment}"${isGuess ? ` → "${cleaned}" ✅` : ` (${cleaned.length} huruf, skip)`}`);

    broadcast({ type: "CHAT_MESSAGE", username, nickname, avatar, message: comment, isGuess });

    if (isGuess) processGuess(userId, username, cleaned, nickname, avatar);
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
  const { username, sessionId } = req.body;
  if (!username) return res.json({ success: false, message: "Username diperlukan" });
  try {
    connectTikTok(username.replace("@", ""), sessionId || "");
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
  // Pakai timestamp agar test bisa berulang dengan kata yang sama
  const testId = `test_${Date.now()}`;
  processGuess(testId, username || "test_user", word, username || "test_user", "");
  res.json({ success: true });
});

app.get("/api/state", (req, res) => {
  res.json({
    ...gameState,
    totalWords: FILTERED_WORDS.length,
    duration: ROUND_DURATION,
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
    state: { ...gameState, secretWord: gameState.isActive ? "?????" : gameState.secretWord }
  }));
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎮 TikTok Live WORDLE - ${FILTERED_WORDS.length} kata - Port ${PORT}\n`);
});
