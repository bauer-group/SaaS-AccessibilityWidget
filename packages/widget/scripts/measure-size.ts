import { readFile } from 'node:fs/promises';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '..', 'dist');

/**
 * Size budgets (gzip).
 *
 * Core grew from 12 KB → 24 KB when we expanded i18n from 8 to 28 locales.
 * It then grew to ~28 KB after adding feature pictograms, multi-stage
 * indicators, panel dragging, oversized mode, runtime language switching
 * and feature tooltips. The loader IIFE is the hot path for 99.9 % of page
 * visitors who never open the panel — it stays near 5 KB because it only
 * ships the short FAB button label per locale, not the full Translation.
 * Loader bumped 5 → 5.5 KB to carry opt-in FAB-drag (pointer + Shift+Arrow
 * keyboard drag, viewport clamp, state-persist, click-suppress). Still
 * dwarfed by typical GA/GTM loaders (15-40 KB). The core only loads on
 * first widget interaction.
 */
const BUDGETS: Record<string, { gzip: number }> = {
  'accessibility-widget-loader.min.js': { gzip: Math.round(5.5 * 1024) },
  'accessibility-widget-core.min.js': { gzip: 30 * 1024 },
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
