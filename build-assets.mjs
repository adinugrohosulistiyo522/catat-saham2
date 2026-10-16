import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = resolve(root, 'index.html');
const dist = resolve(root, 'dist');
const target = resolve(dist, 'index.html');

try {
  const info = await stat(source);
  if (!info.isFile() || info.size < 1000) throw new Error('index.html tidak valid atau terlalu kecil.');
} catch {
  console.error('BUILD ERROR: file index.html tidak ditemukan di root repository.');
  console.error('Pastikan file index.html CatatSaham tetap berada di root GitHub.');
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(source, target);
console.log(`PASS: ${source} -> ${target}`);
console.log('Dist hanya berisi index.html; file backend dan konfigurasi tidak dipublikasikan sebagai aset.');
