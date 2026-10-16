import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

for (const file of ['wrangler.jsonc','package.json','index.js','api.js','index.html','build-assets.mjs','Code.gs']) {
  assert.ok(existsSync(file), `File wajib tidak ada di root: ${file}`);
}
const config = JSON.parse(readFileSync('wrangler.jsonc','utf8'));
assert.equal(config.name, 'catat-saham2');
assert.equal(config.main, 'index.js');
assert.equal(config.assets.directory, './dist');
assert.equal(config.assets.binding, 'ASSETS');
assert.ok(readFileSync('index.js','utf8').includes("'./api.js'"));
for (const f of ['index.js','api.js','build-assets.mjs']) {
 const r = spawnSync(process.execPath,['--check',f],{encoding:'utf8'});
 assert.equal(r.status,0,`Sintaks JS error ${f}: ${r.stderr}`);
}
console.log('PASS: flat repo structure, Wrangler config, root API import, and JS syntax.');
