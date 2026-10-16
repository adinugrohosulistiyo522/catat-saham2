CATATSAHAM APPS SCRIPT — QUICK SETUP
1. Buat project baru di https://script.google.com/
2. Tempel seluruh Code.gs dari folder ini ke editor Apps Script.
3. Run fungsi setupCatatSaham() dan setujui izin.
4. Lihat Execution log untuk URL spreadsheet dan apiKey (CATATSAHAM_SETUP_RESULT).
5. Deploy > New deployment > Web app; Execute as Me; Who has access Anyone.
6. Masukkan URL /exec dan apiKey ke Cloudflare Worker Settings > Variables and Secrets > Production.
Peringatan: jangan bagikan apiKey dan jangan simpan di HTML/GitHub.
