/**
 * Pre-dev guard: build the widget only if `packages/widget/dist/` is missing.
 *
 * When called via `pnpm demo:dev` from the repo root, the widget has already
 * been built sequentially before parallel watches start — this guard becomes
 * a no-op. When called standalone via `pnpm --filter demo dev`, it catches
 * the empty-dist case and builds the widget once.
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const widgetLoader = resolve(
  here,
  '../../../packages/widget/dist/accessibility-widget-loader.min.js',
);

if (existsSync(widgetLoader)) {
  console.log('[ensure-widget-built] widget/dist present — skipping rebuild');
  process.exit(0);
}

console.log('[ensure-widget-built] widget/dist missing — building…');
const r = spawnSync('pnpm', ['--filter', '@bauer-group/accessibility-widget', 'build'], {
  stdio: 'inherit',
  shell: true,
});
process.exit(r.status ?? 1);
