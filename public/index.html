<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Who's The Spy — Online</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #080810;
  --surface: #0f0f1a;
  --s2: #161625;
  --s3: #1e1e32;
  --accent: #00e5b0;
  --accent2: #6d28d9;
  --danger: #ff3b57;
  --warn: #f59e0b;
  --text: #eeeef5;
  --muted: #62628a;
  --border: rgba(255,255,255,0.07);
  --glow-g: 0 0 28px rgba(0,229,176,0.22);
  --glow-r: 0 0 28px rgba(255,59,87,0.25);
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}
body{
  background:var(--bg);
  color:var(--text);
  font-family:'DM Sans',sans-serif;
  background-image:
    radial-gradient(ellipse 70% 50% at 50% -5%,rgba(109,40,217,.18) 0%,transparent 60%),
    radial-gradient(ellipse 40% 30% at 90% 110%,rgba(0,229,176,.08) 0%,transparent 50%);
}
body::after{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  opacity:.6;
}

/* ── LAYOUT ── */
.screen{
  display:none;position:fixed;inset:0;z-index:1;
  overflow-y:auto;overflow-x:hidden;
  padding:24px 16px 32px;
  align-items:flex-start;justify-content:center;
}
.screen.active{display:flex;animation:fu .35s ease both;}
@keyframes fu{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
.wrap{width:100%;max-width:480px;}

/* ── TYPOGRAPHY ── */
.logo{
  font-family:'Bebas Neue',sans-serif;
  background:linear-gradient(135deg,#fff 20%,var(--accent));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  letter-spacing:3px;line-height:1;text-align:center;
}
.subtitle{text-align:center;color:var(--muted);font-size:12px;letter-spacing:2.5px;text-transform:uppercase;}

/* ── CARDS ── */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:18px;padding:20px;margin-bottom:14px;
}
.card-label{font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px;}

/* ── INPUTS ── */
input,select{
  width:100%;background:var(--s2);border:1px solid var(--border);
  border-radius:12px;padding:14px 16px;color:var(--text);
  font-family:'DM Sans',sans-serif;font-size:15px;outline:none;
  transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;
}
input:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,229,176,.12);}
input::placeholder{color:var(--muted);}
select option{background:#161625;}

.input-row{display:flex;gap:10px;align-items:center;}
.input-row input{margin:0;}

/* ── BUTTONS ── */
.btn{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;padding:15px;border-radius:13px;border:none;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;
  transition:all .2s;letter-spacing:.2px;
}
.btn-p{
  background:linear-gradient(135deg,var(--accent),#00b88c);
  color:#080810;box-shadow:0 4px 22px rgba(0,229,176,.3);
}
.btn-p:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,229,176,.4);}
.btn-p:active:not(:disabled){transform:none;}
.btn-p:disabled{opacity:.38;cursor:not-allowed;}
.btn-g{background:var(--s2);color:var(--text);border:1px solid var(--border);}
.btn-g:hover{border-color:var(--accent);color:var(--accent);}
.btn-d{background:linear-gradient(135deg,var(--danger),#c0392b);color:#fff;box-shadow:0 4px 18px rgba(255,59,87,.25);}
.btn-d:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,59,87,.38);}
.btn-sm{padding:10px 16px;font-size:13px;width:auto;border-radius:10px;}
.btn-group{display:flex;flex-direction:column;gap:10px;}

/* ── ROOM CODE ── */
.room-code-display{
  font-family:'Bebas Neue',sans-serif;
  font-size:56px;letter-spacing:8px;text-align:center;
  color:var(--accent);text-shadow:var(--glow-g);
  background:var(--s2);border:1px solid rgba(0,229,176,.2);
  border-radius:16px;padding:16px;margin-bottom:4px;cursor:pointer;
  user-select:all;transition:all .2s;
}
.room-code-display:active{transform:scale(.97);}
.copy-hint{text-align:center;font-size:11px;color:var(--muted);letter-spacing:1px;margin-bottom:16px;}

/* ── PLAYER LIST ── */
.player-list{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
.player-row{
  display:flex;align-items:center;gap:12px;
  background:var(--s2);border-radius:12px;padding:11px 14px;
  border:1px solid var(--border);animation:fu .25s ease;
}
.avatar{
  width:34px;height:34px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:13px;color:#080810;
}
.player-name-t{flex:1;font-size:14px;font-weight:500;}
.host-badge{
  font-size:10px;letter-spacing:1px;padding:3px 8px;border-radius:20px;
  background:rgba(0,229,176,.12);color:var(--accent);
  border:1px solid rgba(0,229,176,.25);font-weight:600;text-transform:uppercase;
}
.remove-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px;border-radius:6px;transition:color .2s;}
.remove-btn:hover{color:var(--danger);}

/* ── SETTINGS ── */
.setting-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 0;border-bottom:1px solid var(--border);
}
.setting-row:last-child{border-bottom:none;}
.setting-lbl{font-size:13.5px;}
.setting-sub{font-size:11px;color:var(--muted);margin-top:2px;}
.setting-row select{width:auto;min-width:88px;padding:8px 12px;font-size:13px;}

/* ── STATUS BAR ── */
.status-bar{
  display:flex;align-items:center;gap:10px;
  background:var(--s2);border-radius:12px;padding:12px 14px;
  border:1px solid var(--border);margin-bottom:14px;
}
.pulse-dot{
  width:9px;height:9px;border-radius:50%;
  background:var(--accent);box-shadow:0 0 8px var(--accent);
  animation:pulse 2s infinite;flex-shrink:0;
}
.pulse-dot.red{background:var(--danger);box-shadow:0 0 8px var(--danger);}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.3);opacity:.7;}}
.status-txt{font-size:13px;color:var(--muted);}
.status-txt strong{color:var(--text);}

/* ── 3D CARD FLIP ── */
.card-wrap{perspective:1000px;width:100%;max-width:340px;margin:0 auto 20px;cursor:pointer;}
.card-3d{
  width:100%;aspect-ratio:3/2;
  position:relative;transform-style:preserve-3d;
  transition:transform .75s cubic-bezier(.4,0,.2,1);border-radius:18px;
}
.card-3d.flipped{transform:rotateY(180deg);}
.card-face{
  position:absolute;inset:0;border-radius:18px;
  backface-visibility:hidden;
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;
}
.card-back{
  background:linear-gradient(145deg,var(--s2),var(--surface));
  border:1px solid var(--border);
}
.card-back::before{
  content:'';position:absolute;inset:0;border-radius:18px;
  background:repeating-linear-gradient(45deg,rgba(0,229,176,.025) 0,rgba(0,229,176,.025) 1px,transparent 1px,transparent 18px);
}
.lock-icon{font-size:44px;filter:drop-shadow(0 0 10px rgba(0,229,176,.45));position:relative;z-index:1;}
.tap-hint{font-size:12px;color:var(--muted);letter-spacing:1.5px;position:relative;z-index:1;}
.card-front{transform:rotateY(180deg);padding:24px;text-align:center;}
.card-front.civ{
  background:linear-gradient(135deg,#071e1a 0%,#0c2e28 50%,#071e1a 100%);
  border:1px solid rgba(0,229,176,.3);box-shadow:inset 0 0 40px rgba(0,229,176,.07),var(--glow-g);
}
.card-front.spy-c{
  background:linear-gradient(135deg,#1a0010 0%,#2a0018 50%,#1a0010 100%);
  border:1px solid rgba(255,59,87,.35);box-shadow:inset 0 0 40px rgba(255,59,87,.09),var(--glow-r);
}
.role-badge-c{font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:30px;font-weight:700;}
.civ .role-badge-c{background:rgba(0,229,176,.13);color:var(--accent);border:1px solid rgba(0,229,176,.28);}
.spy-c .role-badge-c{background:rgba(255,59,87,.13);color:var(--danger);border:1px solid rgba(255,59,87,.28);}
.role-icon-c{font-size:32px;}
.word-big{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(26px,8vw,42px);
  letter-spacing:2px;color:var(--accent);text-shadow:0 0 18px rgba(0,229,176,.4);
}
.spy-c .word-big{color:var(--danger);text-shadow:0 0 18px rgba(255,59,87,.4);font-size:20px;line-height:1.4;}
.word-tiny{font-size:11px;color:var(--muted);letter-spacing:.5px;}

/* ── TIMER ── */
.timer-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;}
.timer-svg{transform:rotate(-90deg);}
.t-bg{fill:none;stroke:var(--s2);stroke-width:6;}
.t-fill{fill:none;stroke-width:6;stroke-linecap:round;transition:stroke-dashoffset 1s linear,stroke .5s;}
.timer-num{
  position:absolute;font-family:'Bebas Neue',sans-serif;
  font-size:40px;letter-spacing:2px;text-align:center;
}

/* ── VOTE BTNS ── */
.vote-list{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
.vote-btn{
  display:flex;align-items:center;gap:14px;
  background:var(--s2);border:1px solid var(--border);
  border-radius:13px;padding:13px 15px;
  cursor:pointer;transition:all .2s;width:100%;
  font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);font-weight:500;
}
.vote-btn:hover{border-color:var(--accent);background:rgba(0,229,176,.05);}
.vote-btn.sel{border-color:var(--accent);background:rgba(0,229,176,.09);color:var(--accent);}
.vc{margin-left:auto;background:var(--surface);border-radius:20px;padding:3px 10px;font-size:12px;color:var(--muted);border:1px solid var(--border);}
.vote-btn.sel .vc{color:var(--accent);border-color:var(--accent);}

/* ── RESULT ── */
.result-hero{text-align:center;border-radius:18px;padding:28px 20px;margin-bottom:14px;position:relative;overflow:hidden;}
.result-hero.win{background:linear-gradient(135deg,rgba(0,229,176,.1),rgba(0,188,140,.04));border:1px solid rgba(0,229,176,.22);}
.result-hero.lose{background:linear-gradient(135deg,rgba(255,59,87,.1),rgba(192,57,43,.04));border:1px solid rgba(255,59,87,.22);}
.res-emoji{font-size:56px;display:block;margin-bottom:12px;}
.res-title{font-family:'Bebas Neue',sans-serif;font-size:46px;letter-spacing:3px;}
.win .res-title{color:var(--accent);text-shadow:0 0 28px rgba(0,229,176,.5);}
.lose .res-title{color:var(--danger);text-shadow:0 0 28px rgba(255,59,87,.5);}
.res-sub{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.6;}
.roles-list{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
.role-row{
  display:flex;align-items:center;gap:10px;
  background:var(--s2);border-radius:12px;padding:11px 14px;border:1px solid var(--border);
}
.role-row.is-spy{border-color:rgba(255,59,87,.3);background:rgba(255,59,87,.05);}
.rbadge{font-size:10px;letter-spacing:1px;padding:3px 9px;border-radius:20px;font-weight:700;white-space:nowrap;}
.rbadge-spy{background:rgba(255,59,87,.18);color:var(--danger);}
.rbadge-civ{background:rgba(0,229,176,.13);color:var(--accent);}
.vtally{margin-left:auto;font-size:12px;color:var(--muted);}

/* ── SPY GUESS ── */
.guess-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;}
.guess-btn{
  background:var(--s2);border:1px solid var(--border);border-radius:10px;
  padding:13px;color:var(--text);font-family:'DM Sans',sans-serif;
  font-size:14px;cursor:pointer;transition:all .2s;font-weight:500;
}
.guess-btn:hover{border-color:var(--danger);background:rgba(255,59,87,.06);color:var(--danger);}
.guess-btn.correct{border-color:var(--accent);background:rgba(0,229,176,.09);color:var(--accent);}
.guess-btn.wrong{border-color:var(--danger);background:rgba(255,59,87,.09);color:var(--danger);}
.guess-btn:disabled{cursor:not-allowed;}

/* ── MISC ── */
.tag{display:inline-flex;align-items:center;justify-content:center;background:rgba(0,229,176,.12);color:var(--accent);border-radius:20px;padding:2px 10px;font-size:12px;font-weight:700;border:1px solid rgba(0,229,176,.22);}
.mt12{margin-top:12px;} .mt16{margin-top:16px;} .mt20{margin-top:20px;} .mt24{margin-top:24px;}
.tc{text-align:center;} .muted{color:var(--muted);font-size:13px;}
.divider{height:1px;background:var(--border);margin:14px 0;}
.waiting-anim{text-align:center;padding:24px 0;color:var(--muted);font-size:14px;}
.waiting-anim .dots span{animation:blink 1.4s infinite;opacity:0;}
.waiting-anim .dots span:nth-child(2){animation-delay:.2s;}
.waiting-anim .dots span:nth-child(3){animation-delay:.4s;}
@keyframes blink{0%,80%,100%{opacity:0;}40%{opacity:1;}}
.big-icon{font-size:56px;text-align:center;display:block;margin-bottom:12px;}
.confetti-piece{position:absolute;width:8px;height:8px;border-radius:2px;animation:cf 1.5s ease-in forwards;}
@keyframes cf{0%{opacity:1;transform:translateY(0) rotate(0deg);}100%{opacity:0;transform:translateY(90px) rotate(720deg);}}
.error-txt{color:var(--danger);font-size:13px;margin-top:8px;text-align:center;min-height:20px;}
.phase-step{display:flex;gap:8px;margin-bottom:20px;}
.step{flex:1;height:4px;border-radius:2px;background:var(--s2);}
.step.done{background:var(--accent);}
.step.active{background:var(--accent2);}
.reveal-who{font-size:18px;font-weight:700;text-align:center;margin-bottom:16px;}
.seen-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.seen-pill{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;background:var(--s2);border:1px solid var(--border);color:var(--muted);}
.seen-pill.done{background:rgba(0,229,176,.1);border-color:rgba(0,229,176,.25);color:var(--accent);}
.voter-who{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:8px;}
</style>
</head>
<body>

<!-- ══ HOME ══ -->
<div id="s-home" class="screen active">
<div class="wrap">
  <div style="margin:36px 0 40px;">
    <div class="logo" style="font-size:clamp(48px,15vw,80px);">WHO'S<br>THE SPY?</div>
    <div class="subtitle" style="margin-top:6px;">🌐 Online Multiplayer</div>
  </div>
  <div class="card">
    <div class="card-label">Namamu</div>
    <input type="text" id="myName" placeholder="Masukkan namamu..." maxlength="14" autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false">
    <div id="nameError" class="error-txt"></div>
  </div>
  <div class="btn-group mt12">
    <button class="btn btn-p" onclick="createRoom()">🚀 Buat Room</button>
    <div style="display:flex;gap:10px;align-items:center;">
      <input type="text" id="joinCode" placeholder="Kode room (4 huruf)" maxlength="4" style="text-transform:uppercase;letter-spacing:4px;font-family:'Bebas Neue',sans-serif;font-size:22px;text-align:center;" onkeydown="if(event.key==='Enter')joinRoom()">
      <button class="btn btn-g btn-sm" onclick="joinRoom()" style="flex-shrink:0;">Join</button>
    </div>
    <div id="joinError" class="error-txt"></div>
  </div>
  <div style="margin-top:14px;padding:14px 16px;background:rgba(245,158,11,.07);border-radius:14px;border:1px solid rgba(245,158,11,.25);">
    <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#f59e0b;font-weight:700;margin-bottom:6px;">💡 Mode Bermain</div>
    <div style="font-size:12.5px;color:var(--text);line-height:1.75;">
      <strong>1 perangkat:</strong> Buka beberapa tab browser, tiap pemain buka tab sendiri<br>
      <strong>Banyak perangkat:</strong> Semua buka file HTML ini, pakai kode room yang sama
    </div>
  </div>
  <div style="margin-top:14px;padding:16px;background:var(--s2);border-radius:14px;border:1px solid var(--border);">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:700;margin-bottom:10px;">Cara Bermain</div>
    <div style="font-size:13px;color:var(--text);line-height:1.8;">
      1. Satu orang <strong>Buat Room</strong>, bagikan kode ke teman<br>
      2. Teman lain <strong>Join</strong> pakai kode yang sama<br>
      3. Host atur setting & mulai game<br>
      4. Civilian dapat kata rahasia, Spy tidak tahu!<br>
      5. Diskusi → Vote → Tangkap spy! 🕵️
    </div>
  </div>
</div>
</div>

<!-- ══ LOBBY ══ -->
<div id="s-lobby" class="screen">
<div class="wrap">
  <div style="margin-bottom:20px;">
    <div class="logo" style="font-size:34px;margin-bottom:4px;">LOBBY</div>
    <div class="subtitle">Bagikan kode ke teman!</div>
  </div>
  <div id="roomCodeDisplay" class="room-code-display" onclick="copyCode()">----</div>
  <div class="copy-hint" id="copyHint">Tap untuk copy kode</div>

  <div class="card" id="hostSettings" style="display:none;">
    <div class="card-label">⚙️ Pengaturan</div>
    <div class="setting-row">
      <div><div class="setting-lbl">Jumlah Spy</div><div class="setting-sub">Sesuai jumlah pemain</div></div>
      <select id="spyCount"><option value="1">1 Spy</option><option value="2">2 Spy</option></select>
    </div>
    <div class="setting-row">
      <div><div class="setting-lbl">Waktu Diskusi</div></div>
      <select id="timerDur"><option value="180">3 Min</option><option value="240" selected>4 Min</option><option value="300">5 Min</option><option value="420">7 Min</option></select>
    </div>
    <div class="setting-row">
      <div><div class="setting-lbl">Kategori</div></div>
      <select id="catSelect">
        <option value="random">🎲 Acak</option>
        <option value="food">🍔 Makanan</option>
        <option value="place">🏖️ Tempat</option>
        <option value="activity">⚽ Aktivitas</option>
        <option value="movie">🎬 Hiburan</option>
        <option value="thing">🔧 Benda</option>
      </select>
    </div>
  </div>

  <div class="card">
    <div class="card-label">👥 Pemain <span class="tag" id="lobbyCount">0</span></div>
    <div class="player-list" id="lobbyPlayers"></div>
  </div>

  <div id="hostBtns" class="btn-group" style="display:none;">
    <button class="btn btn-p" id="startGameBtn" onclick="hostStartGame()" disabled>▶ Mulai Game</button>
    <button class="btn btn-g" onclick="leaveRoom()">← Keluar</button>
  </div>
  <div id="guestBtns" class="btn-group" style="display:none;">
    <div class="waiting-anim">Nunggu host mulai game<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
    <button class="btn btn-g" onclick="leaveRoom()">← Keluar</button>
  </div>
</div>
</div>

<!-- ══ MY CARD ══ -->
<div id="s-mycard" class="screen">
<div class="wrap">
  <div style="margin-bottom:16px;">
    <div class="logo" style="font-size:32px;margin-bottom:4px;">KARTU MU</div>
    <div class="subtitle">Lihat diam-diam, jangan ketauan!</div>
  </div>

  <div class="status-bar">
    <div class="pulse-dot"></div>
    <div class="status-txt" id="seenStatus">Menunggu semua pemain melihat kartu...</div>
  </div>

  <div id="cardWrap">
    <div class="reveal-who" id="revealWho"></div>
    <div class="card-wrap" onclick="flipMyCard()">
      <div class="card-3d" id="myCard3d">
        <div class="card-face card-back">
          <div class="lock-icon">🔒</div>
          <div class="tap-hint">TAP UNTUK BUKA</div>
        </div>
        <div class="card-face card-front" id="myCardFront">
          <div class="role-badge-c" id="myRoleBadge"></div>
          <div class="role-icon-c" id="myRoleIcon"></div>
          <div class="word-big" id="myCardWord"></div>
          <div class="word-tiny" id="myCardHint"></div>
        </div>
      </div>
    </div>
    <div style="margin-top:14px;">
      <button class="btn btn-p" id="seenBtn" onclick="markSeen()" style="display:none;">✓ Sudah Lihat</button>
    </div>
  </div>

  <div id="waitingOthers" style="display:none;">
    <div class="waiting-anim" style="margin-top:16px;">
      ✅ Sudah dilihat. Nunggu yang lain<span class="dots"><span>.</span><span>.</span><span>.</span></span>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="card-label">Siapa yang sudah lihat?</div>
    <div class="seen-pills" id="seenPills"></div>
  </div>
</div>
</div>

<!-- ══ DISCUSS ══ -->
<div id="s-discuss" class="screen">
<div class="wrap">
  <div style="margin-bottom:20px;text-align:center;">
    <div class="logo" style="font-size:32px;margin-bottom:4px;">DISKUSI</div>
    <div class="subtitle">Siapa yang mencurigakan?</div>
  </div>
  <div style="display:flex;justify-content:center;margin-bottom:16px;">
    <div class="timer-wrap">
      <svg class="timer-svg" width="130" height="130" viewBox="0 0 130 130">
        <circle class="t-bg" cx="65" cy="65" r="56"/>
        <circle class="t-fill" id="tCircle" cx="65" cy="65" r="56" stroke-dasharray="352" stroke-dashoffset="0"/>
      </svg>
      <div class="timer-num" id="tDisplay">4:00</div>
    </div>
  </div>
  <div class="muted tc" id="tStatus">Berdiskusi dan beri petunjuk satu-satu!</div>
  <div class="card mt16">
    <div class="card-label">👥 Pemain dalam game</div>
    <div id="discussPlayers" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;"></div>
  </div>
  <div class="card" style="border-color:rgba(0,229,176,.15);background:rgba(0,229,176,.03);">
    <div class="card-label">Peranmu</div>
    <div style="display:flex;align-items:center;gap:12px;">
      <div class="avatar" id="myRoleRemind" style="width:40px;height:40px;font-size:16px;"></div>
      <div>
        <div id="myRoleRemindBadge" style="font-size:14px;font-weight:600;"></div>
        <div id="myRoleRemindWord" style="font-size:12px;color:var(--muted);margin-top:2px;"></div>
      </div>
    </div>
  </div>
  <div class="btn-group" id="hostVoteBtn" style="display:none;">
    <button class="btn btn-p" onclick="hostStartVote()">🗳️ Mulai Voting</button>
  </div>
  <div id="guestVoteWait" style="display:none;">
    <div class="waiting-anim" style="margin-top:8px;">Tunggu host mulai voting<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  </div>
</div>
</div>

<!-- ══ VOTE ══ -->
<div id="s-vote" class="screen">
<div class="wrap">
  <div style="margin-bottom:20px;">
    <div class="logo" style="font-size:32px;margin-bottom:4px;">VOTING</div>
    <div class="subtitle">Siapa yang spy?</div>
  </div>

  <div class="status-bar" id="voteStatusBar">
    <div class="pulse-dot" id="voteStatusDot"></div>
    <div class="status-txt" id="voteStatusTxt"></div>
  </div>

  <div class="card" id="myVoteCard">
    <div class="voter-who" id="currentVoterWho"></div>
    <div class="muted" style="margin-bottom:12px;">Pilih satu orang yang kamu curigai sebagai spy</div>
    <div class="vote-list" id="voteList"></div>
  </div>

  <div class="btn-group" id="confirmVoteBtnWrap">
    <button class="btn btn-p" id="confirmVoteBtn" onclick="submitVote()" disabled>Konfirmasi Pilihan</button>
  </div>

  <div id="voteWaitMsg" style="display:none;">
    <div class="waiting-anim mt12">Menunggu giliran votingmu<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  </div>
  <div id="votedMsg" style="display:none;">
    <div class="waiting-anim mt12">✅ Kamu sudah voting! Menunggu yang lain<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  </div>

  <div class="muted tc mt16">Voting ke <span id="voteIdx">1</span> dari <span id="voteTot">0</span></div>
</div>
</div>

<!-- ══ SPY GUESS ══ -->
<div id="s-spyguess" class="screen">
<div class="wrap">
  <div style="text-align:center;margin-bottom:24px;">
    <span class="big-icon">🕵️</span>
    <div class="logo" style="font-size:38px;color:var(--danger);-webkit-text-fill-color:var(--danger);">TERTANGKAP!</div>
    <div class="muted mt12" id="caughtName"></div>
  </div>
  <div style="background:rgba(255,59,87,.07);border:1px solid rgba(255,59,87,.25);border-radius:14px;padding:18px;margin-bottom:16px;text-align:center;">
    <div style="font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--danger);font-weight:700;margin-bottom:8px;">🎯 Tebak Kata — Spy Masih Bisa Menang!</div>
    <div class="muted">Jika spy menebak kata yang benar, spy menang!</div>
  </div>
  <div class="card" id="spyGuessSection">
    <div class="card-label">Pilih kata yang menurutmu benar</div>
    <div class="guess-grid" id="guessGrid"></div>
  </div>
  <div id="guestGuessWait" style="display:none;">
    <div class="waiting-anim">Spy sedang menebak kata<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
  </div>
</div>
</div>

<!-- ══ RESULT ══ -->
<div id="s-result" class="screen">
<div class="wrap">
  <div class="result-hero" id="resHero">
    <span class="res-emoji" id="resEmoji"></span>
    <div class="res-title" id="resTitle"></div>
    <div class="res-sub" id="resSub"></div>
  </div>
  <div class="card">
    <div class="card-label">🎯 Kata Rahasia</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:3px;color:var(--accent);text-shadow:var(--glow-g);" id="resWord"></div>
    <div class="muted" id="resCat" style="margin-top:4px;font-size:12px;"></div>
  </div>
  <div class="card">
    <div class="card-label">👥 Peran Semua Pemain</div>
    <div class="roles-list" id="resRoles"></div>
  </div>
  <div class="card">
    <div class="card-label">🗳️ Hasil Voting</div>
    <div class="roles-list" id="resVotes"></div>
  </div>
  <div class="btn-group mt16">
    <button class="btn btn-p" id="playAgainBtn" onclick="playAgain()" style="display:none;">🔄 Main Lagi (Kata Baru)</button>
    <button class="btn btn-g" onclick="leaveRoom()">🚪 Keluar Room</button>
  </div>
</div>
</div>

<script>
// ══════════════════════════════════════════════
// WORD DATA
// ══════════════════════════════════════════════
const WORDS = {
  food:[["Pizza","Sushi"],["Rendang","Sate"],["Es Krim","Es Teh"],["Burger","Hot Dog"],["Mie Goreng","Nasi Goreng"],["Bakso","Siomay"],["Steak","Ayam Goreng"],["Donat","Croissant"],["Kopi","Teh Susu"],["Martabak","Terang Bulan"],["Gado-gado","Pecel"],["Pempek","Tekwan"]],
  place:[["Pantai","Kolam Renang"],["Gunung","Bukit"],["Mall","Pasar"],["Museum","Perpustakaan"],["Bioskop","Teater"],["Café","Restoran"],["Bandara","Stasiun"],["Taman","Kebun Binatang"],["Kampus","Sekolah"],["Hotel","Hostel"],["Masjid","Gereja"],["Pasar Malam","Festival"]],
  activity:[["Berenang","Menyelam"],["Sepak Bola","Futsal"],["Jogging","Jalan Kaki"],["Memasak","Memanggang"],["Membaca","Menulis"],["Gaming","Streaming"],["Yoga","Pilates"],["Menyanyi","Karaoke"],["Bersepeda","Skateboard"],["Traveling","Hiking"],["Fotografi","Vlogging"],["Berkebun","Merawat Tanaman"]],
  movie:[["Avengers","Justice League"],["K-Drama","K-Pop"],["Anime","Manga"],["TikTok","Instagram Reels"],["YouTube","Netflix"],["Konser","Festival Musik"],["Stand Up Comedy","Talk Show"],["Reality Show","Game Show"],["Podcast","Audiobook"],["Webtoon","Komik"]],
  thing:[["Handphone","Tablet"],["Laptop","Komputer"],["Mobil","Motor"],["Payung","Jas Hujan"],["Kacamata","Lensa Kontak"],["Jam Tangan","Gelang"],["Tas","Dompet"],["Sepatu","Sandal"],["Bantal","Guling"],["Kipas Angin","AC"],["Kamera","Tripod"],["Headphone","Earbuds"]]
};

const AV_COLORS = ['#00e5b0','#6d28d9','#f59e0b','#3b82f6','#ec4899','#10b981','#f97316','#8b5cf6'];

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let myName = '';
let roomCode = '';
let isHost = false;
let myRole = null;
let myWord = null;
let hasSeen = false;
let hasVoted = false;
let selectedVote = null;
let pollTimer = null;
let lastStateStr = '';
let localTimerInterval = null;
let localTimerLeft = 0;
let timerPaused = false;
let currentScreen = 'home';

const POLL_MS = 2000;

// ══════════════════════════════════════════════
// SERVER HELPERS — fetch API + WebSocket
// ══════════════════════════════════════════════
// Deteksi URL server otomatis (same origin)
const SERVER_URL = window.location.origin;
let ws = null;
let wsReady = false;

function connectWS(code) {
  if (ws) { try { ws.close(); } catch(e) {} }
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${location.host}`);
  ws.onopen = () => {
    wsReady = true;
    ws.send(JSON.stringify({ type: 'subscribe', room: code }));
  };
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'state' && msg.data) {
        handleStateUpdate(msg.data);
      } else if (msg.type === 'deleted') {
        stopPoll(); goTo('s-home');
      }
    } catch(err) {}
  };
  ws.onclose = () => { wsReady = false; };
  ws.onerror = () => { wsReady = false; };
}

async function getState() {
  try {
    const res = await fetch(`${SERVER_URL}/room/${roomCode}`);
    if (!res.ok) return null;
    return await res.json();
  } catch(e) { return null; }
}

async function setState(st) {
  try {
    const res = await fetch(`${SERVER_URL}/room/${roomCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(st)
    });
    return res.ok;
  } catch(e) { return false; }
}

async function updateState(fn) {
  const st = await getState();
  if (!st) return null;
  const updated = fn(st);
  if (updated === false) return null;
  await setState(updated);
  return updated;
}

// Dipanggil saat WS push update masuk
function handleStateUpdate(st) {
  if (!st) return;
  const stStr = JSON.stringify(st);
  if (stStr === lastStateStr) return;
  lastStateStr = stStr;
  applyState(st);
}
function genCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({length:4}, ()=>c[Math.floor(Math.random()*c.length)]).join('');
}

// ══════════════════════════════════════════════
// SCREEN
// ══════════════════════════════════════════════
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  currentScreen = id;
  window.scrollTo(0,0);
}
function avColor(name) { let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))&0xffffffff; return AV_COLORS[Math.abs(h)%AV_COLORS.length]; }

// ══════════════════════════════════════════════
// HOME → CREATE / JOIN
// ══════════════════════════════════════════════
async function createRoom() {
  const n = document.getElementById('myName').value.trim();
  if (!n) { document.getElementById('nameError').textContent = 'Masukkan namamu dulu!'; return; }
  myName = n;
  isHost = true;
  roomCode = genCode();

  const st = {
    status: 'lobby',
    host: myName,
    players: [myName],
    settings: { spyCount:1, duration:240, category:'random' },
    word: null, category: null, decoyWords: [],
    roles: {}, cardsSeen: [],
    timerStart: null,
    currentVoterIdx: 0,
    votes: {}, tally: {},
    eliminatedPlayer: null,
    winner: null,
    spyGuessedWord: null,
    _createdAt: Date.now(),
  };
  await setState(st);
  enterLobby(st);
}

async function joinRoom() {
  const n = document.getElementById('myName').value.trim();
  const code = document.getElementById('joinCode').value.trim().toUpperCase();
  if (!n) { document.getElementById('nameError').textContent = 'Masukkan namamu dulu!'; return; }
  if (code.length !== 4) { document.getElementById('joinError').textContent = 'Kode harus 4 huruf!'; return; }
  myName = n;
  isHost = false;
  roomCode = code;

  let st = await getState();
  if (!st) { document.getElementById('joinError').textContent = 'Room tidak ditemukan!'; return; }
  if (st.status !== 'lobby') { document.getElementById('joinError').textContent = 'Game sudah dimulai!'; return; }
  if (st.players.includes(myName)) { document.getElementById('joinError').textContent = 'Nama sudah dipakai di room ini!'; return; }
  if (st.players.length >= 10) { document.getElementById('joinError').textContent = 'Room penuh (max 10)!'; return; }

  st = await updateState(s => { s.players.push(myName); return s; });
  enterLobby(st);
}

// ══════════════════════════════════════════════
// LOBBY
// ══════════════════════════════════════════════
function enterLobby(st) {
  goTo('s-lobby');
  document.getElementById('roomCodeDisplay').textContent = roomCode;
  document.getElementById('hostSettings').style.display = isHost ? 'block' : 'none';
  document.getElementById('hostBtns').style.display = isHost ? 'flex' : 'none';
  document.getElementById('guestBtns').style.display = !isHost ? 'flex' : 'none';
  renderLobby(st);
  connectWS(roomCode); // Connect WebSocket untuk real-time sync
  startPoll();         // Polling sebagai fallback
}

function renderLobby(st) {
  document.getElementById('lobbyCount').textContent = st.players.length;
  const el = document.getElementById('lobbyPlayers');
  el.innerHTML = st.players.map((p,i) => `
    <div class="player-row">
      <div class="avatar" style="background:${avColor(p)}">${p[0].toUpperCase()}</div>
      <div class="player-name-t">${p}</div>
      ${p === st.host ? '<div class="host-badge">HOST</div>' : ''}
    </div>
  `).join('');
  if (isHost) document.getElementById('startGameBtn').disabled = st.players.length < 3;
}

function copyCode() {
  navigator.clipboard?.writeText(roomCode).catch(()=>{});
  const h = document.getElementById('copyHint');
  h.textContent = '✓ Kode di-copy!';
  setTimeout(()=>{ h.textContent='Tap untuk copy kode'; }, 2000);
}

async function leaveRoom() {
  stopPoll();
  if (!isHost) {
    await updateState(s => { s.players = s.players.filter(p => p !== myName); return s; });
  } else {
    // Host keluar → hapus room dari server
    try { await fetch(`${SERVER_URL}/room/${roomCode}`, { method: 'DELETE' }); } catch(e) {}
  }
  if (ws) { try { ws.close(); } catch(e) {} ws = null; }
  myName=''; roomCode=''; isHost=false; myRole=null; myWord=null; hasSeen=false; hasVoted=false; selectedVote=null; lastStateStr='';
  goTo('s-home');
}

// ══════════════════════════════════════════════
// HOST: START GAME
// ══════════════════════════════════════════════
async function hostStartGame() {
  const st = await getState();
  if (!st || st.players.length < 3) return;

  const spyCount = parseInt(document.getElementById('spyCount').value);
  const duration = parseInt(document.getElementById('timerDur').value);
  const catSel = document.getElementById('catSelect').value;
  const cats = Object.keys(WORDS);
  const cat = catSel === 'random' ? cats[Math.floor(Math.random()*cats.length)] : catSel;
  const pair = WORDS[cat][Math.floor(Math.random()*WORDS[cat].length)];
  const word = pair[0];

  // Assign roles
  const shuffled = [...st.players].sort(()=>Math.random()-.5);
  const spies = shuffled.slice(0, spyCount);
  const roles = {};
  st.players.forEach(p => { roles[p] = spies.includes(p) ? 'spy' : 'civilian'; });

  // Decoy words
  const decoys = [];
  WORDS[cat].forEach(p => { p.forEach(w => { if(w!==word && !decoys.includes(w)) decoys.push(w); }); });
  const decoyWords = [word, ...decoys.sort(()=>Math.random()-.5).slice(0,5)].sort(()=>Math.random()-.5);

  await setState({
    ...st,
    status: 'mycard',
    settings: {spyCount, duration, category:cat},
    word, category:cat, decoyWords, roles,
    cardsSeen: [], timerStart: null,
    currentVoterIdx: 0, votes: {}, tally: {},
    eliminatedPlayer: null, winner: null, spyGuessedWord: null,
  });
}

// ══════════════════════════════════════════════
// CARD REVEAL SCREEN
// ══════════════════════════════════════════════
let cardFlipped = false;
function setupMyCard(st) {
  myRole = st.roles[myName];
  myWord = st.word;
  cardFlipped = false;
  hasSeen = st.cardsSeen.includes(myName);

  document.getElementById('revealWho').textContent = `Hai, ${myName}! 👋`;
  const card3d = document.getElementById('myCard3d');
  card3d.classList.remove('flipped');

  const front = document.getElementById('myCardFront');
  front.className = `card-face card-front ${myRole === 'spy' ? 'spy-c' : 'civ'}`;
  document.getElementById('myRoleBadge').textContent = myRole === 'spy' ? '🕵️ SPY' : '👤 CIVILIAN';
  document.getElementById('myRoleIcon').textContent = myRole === 'spy' ? '🔴' : '🟢';
  document.getElementById('myCardWord').textContent = myRole === 'spy' ? '???' : myWord.toUpperCase();
  document.getElementById('myCardHint').textContent = myRole === 'spy' ? 'Kamu tidak tahu kata rahasianya!' : 'Jangan sebut langsung!';

  if (hasSeen) {
    document.getElementById('cardWrap').style.display = 'none';
    document.getElementById('waitingOthers').style.display = 'block';
  } else {
    document.getElementById('cardWrap').style.display = 'block';
    document.getElementById('waitingOthers').style.display = 'none';
    document.getElementById('seenBtn').style.display = 'none';
  }
  renderSeenPills(st);
}

function flipMyCard() {
  if (cardFlipped || hasSeen) return;
  cardFlipped = true;
  document.getElementById('myCard3d').classList.add('flipped');
  setTimeout(() => { document.getElementById('seenBtn').style.display = 'flex'; }, 800);
}

async function markSeen() {
  hasSeen = true;
  document.getElementById('cardWrap').style.display = 'none';
  document.getElementById('waitingOthers').style.display = 'block';
  await updateState(s => { if(!s.cardsSeen.includes(myName)) s.cardsSeen.push(myName); return s; });
}

function renderSeenPills(st) {
  const el = document.getElementById('seenPills');
  el.innerHTML = st.players.map(p => `
    <div class="seen-pill ${st.cardsSeen.includes(p) ? 'done' : ''}">
      ${st.cardsSeen.includes(p) ? '✓' : '⌛'} ${p}
    </div>
  `).join('');
  const all = st.cardsSeen.length >= st.players.length;
  document.getElementById('seenStatus').textContent = all
    ? '✅ Semua sudah lihat! Masuk diskusi...'
    : `${st.cardsSeen.length}/${st.players.length} pemain sudah lihat kartu`;
}

// ══════════════════════════════════════════════
// DISCUSS SCREEN
// ══════════════════════════════════════════════
function setupDiscuss(st) {
  // Render players
  const el = document.getElementById('discussPlayers');
  el.innerHTML = st.players.map(p => `
    <div style="display:flex;align-items:center;gap:8px;background:var(--s2);border-radius:10px;padding:8px 12px;border:1px solid var(--border);">
      <div class="avatar" style="width:28px;height:28px;font-size:11px;background:${avColor(p)}">${p[0].toUpperCase()}</div>
      <span style="font-size:13px;font-weight:500;">${p}</span>
    </div>
  `).join('');

  // My role reminder
  const r = st.roles[myName];
  const col = r === 'spy' ? 'var(--danger)' : 'var(--accent)';
  document.getElementById('myRoleRemind').style.background = col;
  document.getElementById('myRoleRemind').textContent = myName[0].toUpperCase();
  document.getElementById('myRoleRemindBadge').textContent = r === 'spy' ? '🕵️ Kamu adalah SPY' : '👤 Kamu adalah CIVILIAN';
  document.getElementById('myRoleRemindWord').textContent = r === 'spy' ? 'Kamu tidak tahu kata rahasia!' : `Kata rahasia: ${st.word}`;

  document.getElementById('hostVoteBtn').style.display = isHost ? 'flex' : 'none';
  document.getElementById('guestVoteWait').style.display = isHost ? 'none' : 'block';

  // Timer
  if (st.timerStart) {
    const elapsed = Math.floor((Date.now() - st.timerStart) / 1000);
    localTimerLeft = Math.max(0, st.settings.duration - elapsed);
    startLocalTimer(st.settings.duration);
  }
}

function startLocalTimer(total) {
  clearInterval(localTimerInterval);
  updateTimerUI(total);
  localTimerInterval = setInterval(() => {
    if (!timerPaused) {
      localTimerLeft = Math.max(0, localTimerLeft - 1);
      updateTimerUI(total);
    }
  }, 1000);
}

function updateTimerUI(total) {
  const m = Math.floor(localTimerLeft/60);
  const s = localTimerLeft%60;
  document.getElementById('tDisplay').textContent = `${m}:${s.toString().padStart(2,'0')}`;
  const frac = localTimerLeft/total;
  const circ = 2*Math.PI*56;
  document.getElementById('tCircle').style.strokeDashoffset = circ*(1-frac);
  const col = frac > .5 ? 'var(--accent)' : frac > .25 ? 'var(--warn)' : 'var(--danger)';
  document.getElementById('tCircle').style.stroke = col;
  if (localTimerLeft === 0) document.getElementById('tStatus').textContent = '⏰ Waktu habis! Host bisa mulai voting.';
}

async function hostStartVote() {
  clearInterval(localTimerInterval);
  await updateState(s => { s.status = 'vote'; s.currentVoterIdx = 0; s.votes = {}; return s; });
}

// ══════════════════════════════════════════════
// VOTE SCREEN
// ══════════════════════════════════════════════
function setupVote(st) {
  const voters = st.players;
  const idx = st.currentVoterIdx;
  const currentVoter = voters[idx];
  const iAmVoter = currentVoter === myName;
  const alreadyVoted = hasVoted || (st.votes && st.votes[myName]);

  document.getElementById('voteIdx').textContent = idx + 1;
  document.getElementById('voteTot').textContent = voters.length;
  document.getElementById('voteStatusTxt').innerHTML = `<strong>${currentVoter}</strong> sedang memilih`;

  document.getElementById('myVoteCard').style.display = iAmVoter && !alreadyVoted ? 'block' : 'none';
  document.getElementById('confirmVoteBtnWrap').style.display = iAmVoter && !alreadyVoted ? 'flex' : 'none';
  document.getElementById('voteWaitMsg').style.display = !iAmVoter && !alreadyVoted ? 'block' : 'none';
  document.getElementById('votedMsg').style.display = alreadyVoted && !iAmVoter ? 'block' : 'none';

  if (iAmVoter && !alreadyVoted) {
    document.getElementById('currentVoterWho').textContent = `${myName}, giliran kamu memilih`;
    selectedVote = null;
    document.getElementById('confirmVoteBtn').disabled = true;
    const list = document.getElementById('voteList');
    list.innerHTML = voters.map((p,i) => {
      if (p === myName) return '';
      return `<button class="vote-btn" id="vbtn${i}" onclick="selectVote(${i},'${p}')">`+
        `<div class="avatar" style="width:30px;height:30px;font-size:11px;background:${avColor(p)}">${p[0].toUpperCase()}</div>`+
        `<span>${p}</span>`+
        `</button>`;
    }).join('');
  }
}

function selectVote(i, name) {
  document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('vbtn'+i)?.classList.add('sel');
  selectedVote = name;
  document.getElementById('confirmVoteBtn').disabled = false;
}

async function submitVote() {
  if (!selectedVote) return;
  hasVoted = true;
  await updateState(s => {
    s.votes[myName] = selectedVote;
    // Advance voter index if this was the current voter
    if (s.players[s.currentVoterIdx] === myName) {
      s.currentVoterIdx++;
      if (s.currentVoterIdx >= s.players.length) {
        processVotes(s);
      }
    }
    return s;
  });
}

function processVotes(s) {
  const tally = {};
  s.players.forEach(p => tally[p]=0);
  Object.values(s.votes).forEach(v => { if(tally[v]!==undefined) tally[v]++; });

  const maxV = Math.max(...Object.values(tally));
  const candidates = Object.keys(tally).filter(p => tally[p]===maxV);
  const elim = candidates[Math.floor(Math.random()*candidates.length)];
  const elimIdx = s.players.indexOf(elim);
  const isSpy = s.roles[elim] === 'spy';

  s.tally = tally;
  s.eliminatedPlayer = elim;

  if (isSpy && s.settings.spyCount === 1) {
    s.status = 'spyguess';
  } else {
    s.winner = isSpy ? 'civilians' : 'spy';
    s.status = 'result';
  }
  return s;
}

// ══════════════════════════════════════════════
// SPY GUESS SCREEN
// ══════════════════════════════════════════════
function setupSpyGuess(st) {
  const spy = st.eliminatedPlayer;
  const amISpy = myName === spy;
  document.getElementById('caughtName').textContent = `${spy} adalah Spy!`;
  document.getElementById('spyGuessSection').style.display = amISpy ? 'block' : 'none';
  document.getElementById('guestGuessWait').style.display = amISpy ? 'none' : 'block';

  if (amISpy) {
    const grid = document.getElementById('guessGrid');
    grid.innerHTML = st.decoyWords.map(w => `
      <button class="guess-btn" onclick="submitSpyGuess('${w}')">${w}</button>
    `).join('');
  }
}

async function submitSpyGuess(word) {
  document.querySelectorAll('.guess-btn').forEach(b => b.disabled=true);
  const st = await getState();
  const correct = word === st.word;

  // Highlight
  document.querySelectorAll('.guess-btn').forEach(b => {
    if(b.textContent===st.word) b.classList.add('correct');
    else if(b.textContent===word && !correct) b.classList.add('wrong');
  });

  setTimeout(async () => {
    await updateState(s => {
      s.spyGuessedWord = word;
      s.winner = correct ? 'spy' : 'civilians';
      s.status = 'result';
      return s;
    });
  }, 1400);
}

// ══════════════════════════════════════════════
// RESULT SCREEN
// ══════════════════════════════════════════════
function setupResult(st) {
  clearInterval(localTimerInterval);
  const civWin = st.winner === 'civilians';
  const catNames = {food:'Makanan',place:'Tempat',activity:'Aktivitas',movie:'Hiburan',thing:'Benda'};

  const hero = document.getElementById('resHero');
  hero.className = `result-hero ${civWin ? 'win' : 'lose'}`;
  document.getElementById('resEmoji').textContent = civWin ? '🎉' : '😈';
  document.getElementById('resTitle').textContent = civWin ? 'SPY TERTANGKAP!' : 'SPY MENANG!';

  const spyGuessRight = st.spyGuessedWord === st.word;
  let sub = '';
  if (civWin && !spyGuessRight && st.eliminatedPlayer) sub = `${st.eliminatedPlayer} adalah spy dan berhasil ditangkap!`;
  else if (civWin && !spyGuessRight) sub = `Warga berhasil menemukan spy!`;
  else if (!civWin && spyGuessRight) sub = `${st.eliminatedPlayer} tertangkap tapi berhasil menebak kata "${st.word}"!`;
  else sub = `Spy berhasil bersembunyi sampai akhir!`;
  document.getElementById('resSub').textContent = sub;

  document.getElementById('resWord').textContent = st.word ? st.word.toUpperCase() : '';
  document.getElementById('resCat').textContent = `Kategori: ${catNames[st.category] || st.category}`;

  const rEl = document.getElementById('resRoles');
  rEl.innerHTML = st.players.map(p => {
    const spy = st.roles[p]==='spy';
    return `<div class="role-row ${spy?'is-spy':''}">
      <div class="avatar" style="width:30px;height:30px;font-size:11px;background:${avColor(p)}">${p[0].toUpperCase()}</div>
      <div style="flex:1;font-size:13px;font-weight:500;">${p}</div>
      <div class="rbadge ${spy?'rbadge-spy':'rbadge-civ'}">${spy?'🕵️ SPY':'👤 Civilian'}</div>
    </div>`;
  }).join('');

  if (st.tally) {
    const vEl = document.getElementById('resVotes');
    const sorted = Object.entries(st.tally).sort((a,b)=>b[1]-a[1]);
    vEl.innerHTML = sorted.map(([p,v]) => {
      const elim = p===st.eliminatedPlayer;
      return `<div class="role-row ${elim?'is-spy':''}">
        <div class="avatar" style="width:30px;height:30px;font-size:11px;background:${avColor(p)}">${p[0].toUpperCase()}</div>
        <div style="flex:1;font-size:13px;font-weight:500;">${p}${elim?' ⬅️ dieliminasi':''}</div>
        <div class="vtally">${v} vote</div>
      </div>`;
    }).join('');
  }

  document.getElementById('playAgainBtn').style.display = isHost ? 'flex' : 'none';
  if (civWin) spawnConfetti();
}

function spawnConfetti() {
  const hero = document.getElementById('resHero');
  const colors = ['#00e5b0','#6d28d9','#f59e0b','#3b82f6','#ec4899'];
  for(let i=0;i<18;i++){
    const c=document.createElement('div');
    c.className='confetti-piece';
    c.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*50}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*.8}s;border-radius:${Math.random()>.5?'50%':'2px'};`;
    hero.appendChild(c);
  }
}

async function playAgain() {
  if (!isHost) return;
  myRole=null; myWord=null; hasSeen=false; hasVoted=false; selectedVote=null; cardFlipped=false;
  clearInterval(localTimerInterval);
  await updateState(s => {
    const cats=Object.keys(WORDS);
    const cat=s.settings.category==='random'?cats[Math.floor(Math.random()*cats.length)]:s.settings.category;
    const pair=WORDS[cat][Math.floor(Math.random()*WORDS[cat].length)];
    const word=pair[0];
    const shuffled=[...s.players].sort(()=>Math.random()-.5);
    const spies=shuffled.slice(0,s.settings.spyCount);
    const roles={};
    s.players.forEach(p=>{ roles[p]=spies.includes(p)?'spy':'civilian'; });
    const decoys=[];
    WORDS[cat].forEach(p=>p.forEach(w=>{if(w!==word&&!decoys.includes(w))decoys.push(w);}));
    const decoyWords=[word,...decoys.sort(()=>Math.random()-.5).slice(0,5)].sort(()=>Math.random()-.5);
    return {...s,status:'mycard',word,category:cat,decoyWords,roles,cardsSeen:[],timerStart:null,currentVoterIdx:0,votes:{},tally:{},eliminatedPlayer:null,winner:null,spyGuessedWord:null};
  });
}

// ══════════════════════════════════════════════
// POLLING — FALLBACK HEARTBEAT
// ══════════════════════════════════════════════
function startPoll() {
  stopPoll();
  pollTimer = setInterval(poll, POLL_MS);
  poll();
}
function stopPoll() { clearInterval(pollTimer); }

async function poll() {
  const st = await getState();
  if (!st) { if(currentScreen!=='s-home') { stopPoll(); goTo('s-home'); } return; }
  handleStateUpdate(st);
}

// applyState: inti logika render — dipanggil dari poll & WS push
async function applyState(st) {
  if (!st) { if(currentScreen!=='s-home') { stopPoll(); goTo('s-home'); } return; }

  // Check if kicked
  if (!st.players.includes(myName)) {
    stopPoll(); goTo('s-home'); return;
  }

  // HOST: auto-set timer when discuss starts
  if (isHost && st.status==='discuss' && !st.timerStart) {
    await updateState(s => { s.timerStart=Date.now(); return s; });
    return;
  }
  // HOST: auto-advance voter index when vote submitted
  if (isHost && st.status==='vote') {
    const cv = st.players[st.currentVoterIdx];
    if (cv && st.votes[cv] && st.currentVoterIdx < st.players.length) {
      const votedCount = Object.keys(st.votes).length;
      if (votedCount > st.currentVoterIdx) {
        if (votedCount >= st.players.length) {
          await updateState(s => { processVotes(s); return s; });
        } else {
          await updateState(s => { s.currentVoterIdx = votedCount; return s; });
        }
        return;
      }
    }
  }

  // Render correct screen
  switch(st.status) {
    case 'lobby':
      if (currentScreen !== 's-lobby') { goTo('s-lobby'); }
      renderLobby(st);
      break;
    case 'mycard':
      if (currentScreen !== 's-mycard') { goTo('s-mycard'); }
      setupMyCard(st);
      if (st.cardsSeen.length >= st.players.length && isHost) {
        await updateState(s => { s.status='discuss'; return s; });
      }
      break;
    case 'discuss':
      if (currentScreen !== 's-discuss') {
        goTo('s-discuss');
        setupDiscuss(st);
      } else {
        if (st.timerStart) {
          const elapsed = Math.floor((Date.now()-st.timerStart)/1000);
          localTimerLeft = Math.max(0, st.settings.duration - elapsed);
        }
      }
      break;
    case 'vote':
      if (currentScreen !== 's-vote') { goTo('s-vote'); }
      hasVoted = !!st.votes[myName];
      setupVote(st);
      break;
    case 'spyguess':
      if (currentScreen !== 's-spyguess') { goTo('s-spyguess'); setupSpyGuess(st); }
      break;
    case 'result':
      if (currentScreen !== 's-result') { goTo('s-result'); setupResult(st); }
      break;
  }
}

// ══════════════════════════════════════════════
// ENTER KEY
// ══════════════════════════════════════════════
document.getElementById('myName').addEventListener('keydown', e => {
  if(e.key==='Enter') createRoom();
});
</script>
</body>
</html>
