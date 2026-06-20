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

async function buildOne(spec: BundleSpec, version: string): Promise<void> {
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
    // Replace the __AW_VERSION__ identifier in source with the build version.
    define: { __AW_VERSION__: JSON.stringify(version) },
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

/**
 * Emit SRI digests for the three shipped artifacts in two forms:
 *   - integrity.txt  — human-readable (raw + gzip sizes), referenced by docs/plugins.
 *   - integrity.json — machine-readable { version, algorithm, files } that the CDN
 *     deploy reads (`.version` → the immutable + floating path roots) and that
 *     Step-2 plugin sync reads (SRI + version baked into wrapper/plugin defaults).
 */
async function writeIntegrity(version: string): Promise<void> {
  const files = ['accessibility-widget-loader.min.js', 'accessibility-widget-core.min.js', 'accessibility-widget.min.css'];
  const lines: string[] = [
    'BAUER GROUP Accessibility Widget — SRI Hashes (sha384, base64)',
    `Version: ${version}`,
    `Built: ${new Date().toISOString()}`,
    '',
  ];
  const json: { version: string; algorithm: string; files: Record<string, string> } = {
    version,
    algorithm: 'sha384',
    files: {},
  };
  for (const f of files) {
    const buf = await readFile(resolve(dist, f));
    const sri = `sha384-${createHash('sha384').update(buf).digest('base64')}`;
    const gz = gzipSync(buf).length;
    lines.push(`${f}  (raw ${buf.length} B, gzip ${gz} B)`);
    lines.push(`  ${sri}`);
    lines.push('');
    json.files[f] = sri;
  }
  await writeFile(resolve(dist, 'integrity.txt'), lines.join('\n'));
  await writeFile(resolve(dist, 'integrity.json'), JSON.stringify(json, null, 2) + '\n');
  console.log(lines.join('\n'));
}

async function main(): Promise<void> {
  // Version source: AW_WIDGET_VERSION (set by CI from the semantic-release git
  // tag) → packages/widget/package.json (semantic-release keeps it in sync via
  // pkgRoot; also the local-build fallback). The leading "v" of a tag is stripped.
  const pkg: { version: string } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const version = (process.env.AW_WIDGET_VERSION || pkg.version).replace(/^v/, '');

  await mkdir(dist, { recursive: true });
  await Promise.all(BUNDLES.map((spec) => buildOne(spec, version)));
  await buildCss();
  if (!watch) await writeIntegrity(version);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
