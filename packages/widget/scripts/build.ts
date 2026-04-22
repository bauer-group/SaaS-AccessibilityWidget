import { build, context, type BuildOptions } from 'esbuild';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
const watch = process.argv.includes('--watch');

interface BundleSpec {
  entry: string;
  out: string;
  target: BuildOptions['target'];
  format: BuildOptions['format'];
  globalName?: string;
}

const BUNDLES: BundleSpec[] = [
  {
    entry: 'src/loader.ts',
    out: 'accessibility-widget-loader.min.js',
    target: ['es2017'],
    format: 'iife',
  },
  {
    entry: 'src/core.ts',
    out: 'accessibility-widget-core.min.js',
    target: ['es2019'],
    format: 'iife',
  },
];

async function buildOne(spec: BundleSpec): Promise<void> {
  const opts: BuildOptions = {
    entryPoints: [resolve(root, spec.entry)],
    outfile: resolve(dist, spec.out),
    bundle: true,
    format: spec.format,
    target: spec.target,
    minify: true,
    sourcemap: true,
    legalComments: 'inline',
    logLevel: 'info',
    treeShaking: true,
    platform: 'browser',
  };
  if (watch) {
    const ctx = await context(opts);
    await ctx.watch();
    return;
  }
  await build(opts);
}

async function buildCss(): Promise<void> {
  const opts: BuildOptions = {
    entryPoints: [resolve(root, 'src/styles/widget.css')],
    outfile: resolve(dist, 'accessibility-widget.min.css'),
    bundle: true,
    minify: true,
    sourcemap: true,
    loader: { '.css': 'css' },
  };
  if (watch) {
    const ctx = await context(opts);
    await ctx.watch();
    return;
  }
  await build(opts);
}

async function writeIntegrity(): Promise<void> {
  const files = ['accessibility-widget-loader.min.js', 'accessibility-widget-core.min.js', 'accessibility-widget.min.css'];
  const lines: string[] = ['BAUER GROUP Accessibility Widget — SRI Hashes (sha384, base64)', `Built: ${new Date().toISOString()}`, ''];
  for (const f of files) {
    const buf = await readFile(resolve(dist, f));
    const hash = createHash('sha384').update(buf).digest('base64');
    const gz = gzipSync(buf).length;
    lines.push(`${f}  (raw ${buf.length} B, gzip ${gz} B)`);
    lines.push(`  sha384-${hash}`);
    lines.push('');
  }
  await writeFile(resolve(dist, 'integrity.txt'), lines.join('\n'));
  console.log(lines.join('\n'));
}

async function main(): Promise<void> {
  await mkdir(dist, { recursive: true });
  await Promise.all(BUNDLES.map(buildOne));
  await buildCss();
  if (!watch) await writeIntegrity();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
