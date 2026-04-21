import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const widgetDist = resolve(root, '../../packages/widget/dist');
const target = resolve(root, 'public/bfsg-widget');

await mkdir(target, { recursive: true });
for (const f of [
  'bfsg-widget-loader.min.js',
  'bfsg-widget-core.min.js',
  'bfsg-widget.min.css',
  'integrity.txt',
]) {
  await cp(resolve(widgetDist, f), resolve(target, f));
}
console.log('Widget-Assets in public/bfsg-widget/ kopiert.');
