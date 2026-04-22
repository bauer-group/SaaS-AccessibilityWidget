import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const widgetDist = resolve(root, '../../packages/widget/dist');
const target = resolve(root, 'public/accessibility-widget');

const FILES = [
  'accessibility-widget-loader.min.js',
  'accessibility-widget-core.min.js',
  'accessibility-widget.min.css',
  'integrity.txt',
] as const;

if (!existsSync(widgetDist)) {
  console.error(`[copy-widget] widget dist not found: ${widgetDist}`);
  console.error('[copy-widget] build the widget first:');
  console.error('[copy-widget]   pnpm --filter @bauer-group/accessibility-widget build');
  process.exit(1);
}

for (const f of FILES) {
  if (!existsSync(resolve(widgetDist, f))) {
    console.error(`[copy-widget] missing widget file: ${f} in ${widgetDist}`);
    process.exit(1);
  }
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

for (const f of FILES) {
  await cp(resolve(widgetDist, f), resolve(target, f));
}

console.log(`[copy-widget] ${FILES.length} files copied → public/accessibility-widget/`);
