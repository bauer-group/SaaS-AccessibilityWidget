import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const widgetDist = resolve(here, '../../packages/widget/dist');

const MIME: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/**
 * Dev mode only: serve `/accessibility-widget/*` directly from
 * `packages/widget/dist/*`. Rebuilds of the widget (e.g. running
 * `pnpm --filter @bauer-group/accessibility-widget dev` in a second
 * terminal) are picked up on browser reload — no copy-on-predev needed.
 *
 * In build mode this plugin is a no-op; `scripts/copy-widget.ts` (prebuild)
 * populates `public/accessibility-widget/` so Vite's static pipeline bundles
 * the widget into the production `dist/`.
 */
function serveWidgetDist(): Plugin {
  return {
    name: 'aw-serve-widget-dist',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? '';
        const url = rawUrl.split('?')[0] ?? '';
        if (!url.startsWith('/accessibility-widget/')) return next();

        const rel = url.replace(/^\/accessibility-widget\//, '');
        const file = resolve(widgetDist, rel);

        if (!file.startsWith(widgetDist)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }
        if (!existsSync(file)) {
          res.statusCode = 404;
          res.setHeader('content-type', 'text/plain; charset=utf-8');
          res.end(
            `widget asset not found: ${rel}\n` +
              `expected at: ${file}\n` +
              `run: pnpm --filter @bauer-group/accessibility-widget build`,
          );
          return;
        }

        readFile(file).then(
          (buf) => {
            res.setHeader('content-type', MIME[extname(file)] ?? 'application/octet-stream');
            res.setHeader('cache-control', 'no-store');
            res.end(buf);
          },
          (err: unknown) => {
            res.statusCode = 500;
            res.end(err instanceof Error ? err.message : String(err));
          },
        );
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 5173,
    strictPort: false,
    fs: { allow: [here, widgetDist] },
  },
  publicDir: 'public',
  plugins: [serveWidgetDist()],
  build: {
    target: 'es2020',
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
