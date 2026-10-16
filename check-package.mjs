import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const mustExist = [
  'wrangler.jsonc', 'package.json', 'index.js', 'src/index.js', 'functions/api.js',
  'public/index.html', 'appsscript/Code.gs', 'test/worker.test.mjs'
];
for (const f of mustExist) assert.ok(existsSync(f), `File wajib tidak ada: ${f}`);
assert.ok(!existsSync('worker.js'), 'Hindari file entrypoint lama worker.js.');

const wranglerText = readFileSync('wrangler.jsonc', 'utf8');
const wrangler = JSON.parse(wranglerText);
assert.equal(wrangler.name, 'catat-saham1', 'Nama Wrangler harus sama persis dengan Worker yang sedang dituju (catat-saham1 sesuai screenshot).');
assert.equal(wrangler.main, 'index.js', 'Entrypoint harus file index.js yang berada langsung di root repository/build directory.');
assert.ok(existsSync(wrangler.main), `Entrypoint Wrangler tidak ada: ${wrangler.main}`);
assert.ok(readFileSync('index.js', 'utf8').includes("'./functions/api.js'"), 'Root index.js harus mengimpor handler API relatif dari root.');
assert.equal(wrangler.assets.directory, './public');
assert.equal(wrangler.assets.binding, 'ASSETS');
assert.ok(wrangler.assets.run_worker_first.includes('/api'));
assert.ok(wrangler.assets.run_worker_first.includes('/api/*'));
assert.ok(wrangler.assets.run_worker_first.includes('/healthz'));

for (const f of ['index.js', 'src/index.js', 'functions/api.js', 'test/worker.test.mjs', 'scripts/check-package.mjs']) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  assert.equal(r.status, 0, `Sintaks JS error pada ${f}:\n${r.stderr}`);
}

// Syntax-check every inline script in the production HTML, skipping external script tags.
const html = readFileSync('public/index.html', 'utf8');
assert.ok(html.includes("fetch('/api'"), 'Frontend wajib memanggil endpoint same-origin /api.');
const actions = new Set([...html.matchAll(/action\s*:\s*['"]([A-Za-z0-9_]+)['"]/g)].map(m => m[1]));
const allowed = new Set(['health', 'login', 'getState', 'saveState', 'changePassword']);
for (const action of actions) assert.ok(allowed.has(action), `Frontend memanggil action yang tidak diizinkan: ${action}`);
assert.ok(html.includes('#view-stats > section.panel:first-of-type'), 'CSS sticky filter Statistik hilang.');
assert.ok(html.includes('#view-stats .chart-content') && html.includes('overflow: auto'), 'Scroll internal panel analisis hilang.');

const tempDir = mkdtempSync(join(tmpdir(), 'catatsaham-inline-'));
try {
  const regex = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match, count = 0;
  while ((match = regex.exec(html))) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    count++;
    const file = join(tempDir, `inline-${count}.js`);
    writeFileSync(file, match[2]);
    const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    assert.equal(r.status, 0, `Sintaks inline JS #${count} error:\n${r.stderr}`);
  }
  assert.ok(count > 0, 'Tidak menemukan inline scripts untuk divalidasi.');
} finally { rmSync(tempDir, { recursive: true, force: true }); }

const appsScript = readFileSync('appsscript/Code.gs', 'utf8');
for (const action of ['health', 'login', 'getState', 'saveState', 'changePassword']) {
  assert.ok(appsScript.includes(`action === '${action}'`), `Apps Script tidak menangani action ${action}.`);
}
console.log(`PASS: root entrypoint, package structure, Wrangler config, ${actions.size} frontend actions, sticky/scroll UI, inline JS syntax and Apps Script action contract.`);
