# CatatSaham v6 — Patch untuk repository GitHub yang sudah terlanjur flat

## Diagnosis
Repository `adinugrohosulistiyo522/catat-saham2` saat ini menaruh `index.html`, `index.js`, `api.js`, dan `Code.gs` langsung di root. Konfigurasi v5 masih menunjuk ke `./public` dan entrypoint mengimpor `./functions/api.js`. Itu cocok untuk struktur folder ZIP asli, tetapi tidak cocok untuk repository yang sudah diratakan.

Patch ini sengaja mempertahankan struktur flat agar Anda tidak perlu memindahkan seluruh file ke folder.

## File yang harus diunggah ke root GitHub
Ganti file root `index.js`, `api.js`, `wrangler.jsonc`, `package.json`; tambahkan `build-assets.mjs`, `check-flat-layout.mjs`, dan `smoke.test.mjs`. Pertahankan `index.html` yang sudah ada di root; ZIP ini juga menyertakan salinan yang sama dari paket CatatSaham v5 agar bisa dipulihkan jika perlu. `Code.gs` juga disertakan, tetapi tidak perlu mengganti Apps Script aktif hanya untuk menyelesaikan build Cloudflare.

Jangan unggah file patch ini sebagai satu file ZIP ke GitHub. Ekstrak, lalu unggah masing-masing file ke root repository. GitHub tidak akan membuat folder dari struktur ZIP apabila Anda hanya mengunggah file satu per satu.

## Pengaturan Cloudflare Workers Builds
- Root directory: kosong (repository root)
- **Build command: `npm run build`**
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

Build command meng-copy root `index.html` ke `dist/index.html`. Wrangler hanya mengunggah folder `dist`, jadi `Code.gs`, handler, dan konfigurasi tidak ikut disajikan sebagai aset publik. Folder `dist` dibuat pada build; tidak perlu di-commit ke GitHub.

## Tes sesudah commit
1. Pastikan build sukses.
2. Buka `https://catat-saham2.adinugrohosulistiyo.workers.dev/healthz`. Hasilnya JSON `ok: true`, `workerVersion: 6.0.0`.
3. Buka `/api`, pastikan respons JSON `ok: true`.
4. Buka `/`, halaman CatatSaham tampil.
5. Baru setelah itu isi `APPS_SCRIPT_URL` dan `CATATSAHAM_API_KEY` sebagai runtime variable/secret Production.

Jangan jalankan ulang `setupCatatSaham()` hanya untuk memperbaiki konfigurasi Cloudflare.
