# @bauer-group/accessibility-widget-demo

Interaktive Demo-Seite für das BAUER GROUP Accessibility Widget — Landing-Page, Live-Vorführung, Integration-Snippets und Scanner-Testziel.

## Dev-Workflow

### Schnellstart (aus dem Repo-Root)

```bash
pnpm demo:dev
```

Das baut das Widget einmal, startet dann **beide** Watch-Prozesse parallel:

1. `@bauer-group/accessibility-widget` — esbuild im Watch-Modus, rebuildet bei jeder Widget-Source-Änderung
2. `@bauer-group/accessibility-widget-demo` — Vite Dev-Server auf `http://localhost:5173`

Änderungen am Widget landen nach Browser-Reload sofort im Demo — die Vite-Middleware serviert `/accessibility-widget/*` direkt aus `packages/widget/dist/` (siehe [`vite.config.ts`](./vite.config.ts)). Kein `copy-on-save`, keine stale Dateien.

### Nur Demo (Widget bereits gebaut)

```bash
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

Der `predev`-Hook baut das Widget einmal, falls nötig, und startet dann Vite. Keine Watch auf dem Widget — für reine Demo-UI-Arbeit.

### Mit Widget-Watch (zwei Terminals)

```bash
# Terminal 1 — Widget-Watch
pnpm --filter @bauer-group/accessibility-widget dev

# Terminal 2 — Demo
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

## Build

```bash
pnpm demo:build
```

führt sequenziell aus:

1. `prebuild` — Widget bauen + Files nach `public/accessibility-widget/` kopieren (via [`scripts/copy-widget.ts`](./scripts/copy-widget.ts))
2. `typecheck` — `tsc --noEmit` gegen `tsconfig.json`
3. `vite build` — Bundle nach `dist/` mit Sourcemaps und gehashed Assets

```bash
pnpm demo:preview
```

startet die gebaute Version unter `http://localhost:4173` (strict port).

## Scanner-Testziel

Die Demo enthält **bewusst** WCAG-Violations als stabile Testfälle für automatisierte Scanner (axe-core, pa11y, Lighthouse, Playwright-AxE):

- `<img>` ohne `alt`-Attribut
- Link-Text „hier klicken"
- Button mit Kontrast < 4.5:1
- `<input>` ohne Label

Gegen die gebaute Preview laufen lassen:

```bash
pnpm demo:build && pnpm demo:preview &
npx @axe-core/cli http://localhost:4173 --exit
```

## Struktur

```text
apps/demo/
├── index.html                         Landing-Page
├── src/
│   ├── main.ts                        Orchestrierung (Locale-Switcher, Live-State, Tabs, Copy)
│   └── styles.css                     Design-System
├── public/
│   ├── accessibility-widget-assets/   Demo-spezifische Assets (Icons, Fallback)
│   ├── accessibility-widget/          Wird von prebuild befüllt (gitignored)
│   ├── barrierefreiheit.html          A11y-Erklärung (§ 14 BFSG)
│   └── impressum.html
├── scripts/
│   └── copy-widget.ts                 Kopiert widget/dist → public/ für Prod-Build
├── vite.config.ts                     Dev-Middleware + Build-Config
├── tsconfig.json                      TS-Config (strict, node + vite/client)
└── package.json
```

## Features

- **Locale-Switcher** (28 Sprachen): Persistiert in `localStorage['aw-demo-locale']`, setzt `AccessibilityWidgetConfig.locale` vor Loader-Boot
- **Live-State-Panel**: Poll-basierte Anzeige von `window.AccessibilityWidget.getState()` alle 500 ms
- **Integration-Tabs** mit Copy-Button für HTML, React, Vue, WordPress, Shopify
- **Responsive Design** mit Light/Dark Mode (prefers-color-scheme)
- **WCAG 2.2 AA konform** — der eigene Frame der Seite, nicht die Violations-Testzone

## Lizenz

MIT © BAUER GROUP
