import { readFile } from 'node:fs/promises';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '..', 'dist');

const BUDGETS: Record<string, { gzip: number }> = {
  'accessibility-widget-loader.min.js': { gzip: 5 * 1024 },
  'accessibility-widget-core.min.js': { gzip: 12 * 1024 },
  'accessibility-widget.min.css': { gzip: 3 * 1024 },
};

let failed = false;
for (const [file, budget] of Object.entries(BUDGETS)) {
  const buf = await readFile(resolve(dist, file));
  const raw = buf.length;
  const gz = gzipSync(buf).length;
  const br = brotliCompressSync(buf).length;
  const ok = gz <= budget.gzip;
  const mark = ok ? 'OK ' : 'FAIL';
  if (!ok) failed = true;
  console.log(
    `[${mark}] ${file.padEnd(34)} raw=${String(raw).padStart(6)} B  gzip=${String(gz).padStart(6)} B (budget ${budget.gzip})  br=${String(br).padStart(6)} B`,
  );
}
if (failed) {
  console.error('\nSize budget exceeded. Refusing to publish bloated bundle.');
  process.exit(1);
}
