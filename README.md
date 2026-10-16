# CatatSaham v5 — Cloudflare Worker (root entrypoint, pola Kliktiva)

Paket ini merapikan deployment CatatSaham dengan mengikuti pola Worker yang ada pada `Kliktiva-Cloudflare-v3.1.zip` yang telah ditetapkan sebagai baseline: handler API ada di `functions/api.js`, entrypoint produksi berada di root `index.js`, dan aset statis disajikan dari `public/`. entrypoint tersebut meneruskan rute API ke handler bersama di `functions/api.js`; aset statis disajikan melalui binding `ASSETS` dari `public/`.

## Perbaikan spesifik dari build gagal v4

Screenshot terbaru memperlihatkan error `The entry-point file at "src/index.js" was not found` pada Worker bernama `catat-saham1`. Paket v4 memiliki `src/index.js`, tetapi log build menunjukkan Cloudflare tidak menemukannya pada direktori kerja saat deployment. Untuk menghilangkan ketergantungan pada subfolder `src/`, v5 menaruh entrypoint produksi `index.js` langsung di root dan mengubah `main` Wrangler menjadi `index.js`. Nama Worker dalam konfigurasi disamakan dengan layanan yang tampil pada screenshot, yaitu `catat-saham1`.

## Perubahan dari paket CatatSaham v3

- Mengganti entrypoint `worker.js` dengan pola `index.js` (root) seperti Kliktiva.
- Menggunakan `functions/api.js` sebagai handler API, dengan `GET /api` untuk diagnosis dan `POST /api` untuk operasi backend.
- Membatasi `run_worker_first` pada `/api`, `/api/*`, dan `/healthz` alih-alih mengambil alih seluruh permintaan sebelum menyajikan aset.
- Menyamakan `wrangler.jsonc` dengan nama Worker Dashboard: `catat-saham`.
- Menambahkan endpoint `/healthz` yang tidak menghubungi Apps Script, agar status runtime bisa diisolasi dari masalah Google.
- Menambahkan tes otomatis dan GitHub Actions untuk memeriksa kontrak route, sintaks, action, UI sticky, dan scroll analisis.
- Mempertahankan `public/index.html`, database demo dan `appsscript/Code.gs` dari paket v3, termasuk revisi filter Statistik sticky dan scroll mandiri panel analisis.

## Struktur yang wajib berada di root repository GitHub

```text
wrangler.jsonc
package.json
index.js
src/index.js (referensi kompatibilitas)
functions/api.js
public/index.html
appsscript/Code.gs
scripts/check-package.mjs
test/worker.test.mjs
.github/workflows/validate.yml
```

Jangan unggah folder pembungkus ZIP sebagai subfolder di dalam repository. Ekstrak ZIP lalu unggah seluruh ISI paket ke root repository, sehingga `wrangler.jsonc` tampak langsung di root.

## Cloudflare Workers Builds

Screenshot build terbaru Anda menunjukkan service bernama `catat-saham1`. Paket ini menargetkan service tersebut agar build tidak menerbitkan Worker berbeda. Jika Anda justru ingin memakai service lama `catat-saham`, jangan gunakan paket ini tanpa menyesuaikan `name` di `wrangler.jsonc` dan target build ke service lama.

- Production branch: branch utama repo (contoh `main`)
- Root directory: kosong (root repository)
- Build command: kosong
- Deploy command: `npx wrangler deploy`
- `wrangler.jsonc` harus dibaca dari root; nama dalam config diset `catat-saham1` sesuai service pada screenshot.

Setelah mengganti file di GitHub, buat satu commit dan tunggu build/deployment Production selesai. Jangan mengandalkan status GitHub Actions saja: workflow memvalidasi source code, bukan bukti runtime sudah dipublikasikan ke domain Cloudflare.

## Tes berurutan setelah deploy

1. Buka `https://catat-saham1.adinugrohosulistiyo.workers.dev/healthz`.
2. Buka `https://catat-saham1.adinugrohosulistiyo.workers.dev/api`.
3. Pastikan keduanya mengembalikan JSON `ok: true` dengan `workerVersion: "5.0.0"`.
4. Buka URL root `/`; halaman login CatatSaham harus tampil.
5. Jika `/healthz`, `/api`, dan `/` semuanya `ERR_CONNECTION_TIMED_OUT`, Apps Script dan isi API key belum terlibat. Periksa domain/route `workers.dev` di **Worker `catat-saham1` itu sendiri**, dan status deployment Production. Halaman timeout pada seluruh path tidak dapat diperbaiki dengan mengganti API key.
6. Jika `/healthz` merespons JSON tetapi halaman root gagal, periksa log aset/binding. Jika `/api` merespons JSON tetapi login gagal, lanjutkan ke environment dan Apps Script.

> Perlu diketahui: dari paket kode saja saya tidak dapat mengaktifkan atau memverifikasi setting domain/route pada akun Cloudflare Anda. `/healthz` adalah alat diagnosis untuk memisahkan error domain/runtime dari error backend.

## Environment Production

Isi hanya setelah `/healthz` dan GET `/api` merespons.

| Variable/Secret | Jenis | Nilai |
|---|---|---|
| `APPS_SCRIPT_URL` | Variable | URL Web App Apps Script lengkap yang berakhiran `/exec` |
| `CATATSAHAM_API_KEY` | Secret | API key dari hasil setup Apps Script |

Setelah menyimpan, jalankan deployment baru agar runtime mengambil nilai environment terbaru. Secret tidak disertakan dalam HTML atau source repository. Worker menambahkan `apiKey` saat server mengirim request ke Apps Script.

## Setup Apps Script

Backend ada di `appsscript/Code.gs`. Jika database CatatSaham sudah dibuat dari paket sebelumnya, jangan menjalankan fungsi setup lagi hanya untuk memperbaiki timeout domain Worker. Jalankan setup hanya pada instalasi baru. Untuk kode baru, pertahankan URL deployment `/exec` yang dipakai environment apabila Anda mengedit deployment Apps Script yang sudah berjalan.

## API contract

- `GET /healthz`: runtime check, tidak menghubungi Apps Script dan tidak memerlukan environment.
- `GET /api`: diagnostic `appsScriptUrlConfigured` dan `apiKeyConfigured`; tidak membocorkan nilai secret.
- `POST /api`: hanya actions `health`, `login`, `getState`, `saveState`, `changePassword`; proxy menyisipkan `apiKey` di sisi server.
- Semua path selain API dan health check disajikan melalui `ASSETS.fetch()` ke folder `public/`.

## Validasi lokal

Memerlukan Node.js 20+.

```bash
npm install
npm run check:all
npm run dev
```

`npm run check:all` memeriksa konfigurasi, action frontend/backend, sintaks JavaScript inline, dan tes proxy memakai mocked Apps Script. Ini bukan end-to-end test akun Cloudflare/Google sungguhan.

## Keamanan

- Jangan commit `.dev.vars`, credential, atau API key.
- `CATATSAHAM_API_KEY` wajib disimpan sebagai Secret jika jenis Secret tersedia.
- Jangan mengubah nama Worker di `wrangler.jsonc` kecuali Anda juga memang ingin membuat layanan Worker baru.
