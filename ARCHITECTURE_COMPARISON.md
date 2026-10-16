# CatatSaham v5 dibanding baseline Kliktiva Cloudflare v3.1

Paket Kliktiva v3.1 yang ditemukan di Library memakai:
- `wrangler.jsonc` -> `main: src/index.js`
- `assets.directory: ./public`
- `assets.binding: ASSETS`
- `run_worker_first` diarahkan ke `/api` dan `/api/*`
- `src/index.js` mengimpor handler dari `functions/api.js`, lalu seluruh request lain diberikan ke `env.ASSETS.fetch(request)`
- `functions/api.js` memberikan respons JSON diagnosis untuk GET `/api` serta proxy POST ke Apps Script.

CatatSaham v3 berbeda karena mengimplementasikan seluruh routing di `worker.js` dan mengatur `run_worker_first: true` untuk semua path. Pendekatan itu dapat valid secara teknis, tetapi tidak mengikuti pola deployment yang sudah dikenal pengguna dan membuat diagnosis/maintenance berbeda dari Kliktiva.

CatatSaham v4 sekarang menggunakan pola yang sama dengan Kliktiva, sambil mempertahankan kontrak backend CatatSaham:
- Actions: `health`, `login`, `getState`, `saveState`, `changePassword`.
- Payload frontend tetap berupa objek langsung; Worker menambahkan `apiKey` di server-side.
- API key tidak dikirim ke browser.
- `GET /healthz` dan `GET /api` tidak memerlukan akses Google sehingga bisa dipakai untuk memastikan route/runtime hidup.
- Nama Wrangler menggunakan `catat-saham`, mengikuti service yang dibuat di Dashboard.

Batasan: konfigurasi file tidak dapat menyalakan route/domain yang dinonaktifkan dari Dashboard. Jika seluruh hostname timeout sebelum ada response HTTP, pemeriksaan setting domain/deployment Cloudflare tetap diperlukan.


## Perbaikan v5 berdasarkan log Cloudflare pengguna

Log terbaru menyatakan `The entry-point file at "src/index.js" was not found` pada service `catat-saham1`. Meskipun ZIP v4 menyertakan `src/index.js`, build yang berjalan tidak menemukannya dalam direktori kerjanya. v5 menghilangkan ketergantungan folder tersebut: entrypoint aktif ditaruh di root `index.js`, Wrangler `main` menunjuk ke file root, dan `name` diatur `catat-saham1` agar sesuai service yang terlihat pada screenshot. Ini juga menghindari ketidakcocokan nama `catat-saham1` (service build) versus `catat-saham` (nama pada konfigurasi v4).
