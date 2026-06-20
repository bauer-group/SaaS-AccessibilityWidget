import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Mirror the build's esbuild `define` so `__AW_VERSION__` resolves in tests.
  define: {
    __AW_VERSION__: JSON.stringify('0.0.0-dev'),
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.ts'],
      // i18n + styles are data/CSS-string modules, not behaviour. globals.d.ts
      // is pure ambient types. tts.ts, reading-mask.ts, reading-guide.ts and
      // structure-nav.ts depend on features jsdom doesn't implement (SpeechSynthesis,
      // layout-driven scroll/mouse tracking); they're covered by manual browser
      // testing and integration E2E rather than unit tests.
      exclude: [
        'src/i18n/**',
        'src/styles/**',
        'src/globals.d.ts',
        'src/index.ts',
        'src/features/tts.ts',
        'src/features/reading-mask.ts',
        'src/features/reading-guide.ts',
        'src/features/structure-nav.ts',
      ],
      // Thresholds below reflect our current baseline (≈85% stmt, ≈81% fn)
      // with a small safety margin. CI will fail if any metric drops more
      // than that — guard against silent regression when logic lands without
      // tests.
      thresholds: {
        statements: 85,
        branches: 75,
        functions: 80,
        lines: 85,
      },
    },
  },
});
