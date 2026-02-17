# 🕵️ Who's The Spy — Panduan Deploy ke Railway

## Apa yang kamu dapat
- Server online gratis di Railway
- Game bisa dimainkan dari HP/laptop berbeda lewat internet
- Real-time sync pakai WebSocket

---

## Langkah-langkah (±10 menit)

### 1. Buat akun GitHub
> Kalau sudah punya, skip ke langkah 2.

- Buka https://github.com → klik **Sign up**
- Isi email, password, username → verifikasi

---

### 2. Upload project ke GitHub

1. Buka https://github.com/new
2. Isi **Repository name**: `whos-the-spy`
3. Pilih **Public** → klik **Create repository**
4. Di halaman repository yang baru dibuat, klik **uploading an existing file**
5. **Drag & drop** semua file dari folder ini:
   - `server.js`
   - `package.json`
   - folder `public/` berisi `index.html`
6. Klik **Commit changes**

---

### 3. Deploy ke Railway

1. Buka https://railway.app → klik **Login with GitHub**
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repo `whos-the-spy` yang baru kamu buat
4. Railway otomatis detect Node.js dan deploy!
5. Tunggu ~2 menit sampai status berubah jadi **Active** ✅

---

### 4. Dapatkan URL game kamu

1. Di Railway dashboard, klik project kamu
2. Klik tab **Settings** → **Domains**
3. Klik **Generate Domain**
4. Kamu dapat URL seperti: `https://whos-the-spy-xxx.up.railway.app`

---

### 5. Main!

- Buka URL tersebut di browser HP kamu
- Share URL ke teman
- Semua orang buka URL yang sama → Create/Join room → Mulai game! 🎮

---

## Biaya
Railway gratis sampai **500 jam/bulan** (sekitar 20 hari non-stop).
Untuk game kasual yang cuma dimainkan sesekali, gratis selamanya praktisnya.

## Kalau ada masalah
- **Error saat deploy**: pastikan semua 3 file sudah terupload ke GitHub
- **Game tidak bisa connect**: cek URL Railway sudah benar (https://)
- **Room tidak ketemu**: pastikan kode room diketik dengan benar (4 huruf kapital)
