# @bauer-group/accessibility-widget-demo

Interaktive Landing-Page, Runtime-API-Playground, Integration-Showcase und Scanner-Testziel für das BAUER GROUP Accessibility Widget.

## Was die Demo zeigt

| Sektion               | Zweck                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Hero + Status-Karte   | 1-Line-Integration + Bundle-Sizes auf einen Blick                                                                        |
| Profile Quick-Actions | 6 Buttons, die via `AccessibilityWidget.applyProfile()` direkt auf der Demo-Seite feuern — ohne erst das Panel zu öffnen |
| Live-Beispielinhalt   | Text, Links, Animation, die sofort auf aktive Features reagieren                                                         |
| Runtime-API-Explorer  | Interaktive Buttons für jede der 9 `window.AccessibilityWidget.*`-Methoden mit Live-Feedback                             |
| Event-Stream          | Live-Log der 6 CustomEvent-Typen, die das Widget dispatch't (`stateChange`, `profileApplied`, …)                         |
| Locale-Switcher       | Dropdown mit allen 28 Locales in nativem Namen; nutzt die neue `setLocale()`-API (kein Reload)                           |
| Integration-Tabs      | Copy-Buttons für HTML, React, Vue, WordPress, Shopify Snippets                                                           |
| Live-State-Panel      | JSON-Dump von `getState()` mit 500 ms Polling                                                                            |
| Compliance-Karten     | BFSG · EN 301 549 · WCAG 2.2 AA mit Deep-Links                                                                           |
| Scanner-Testzone      | Collapsible, enthält **bewusst** WCAG-Violations für axe/pa11y/Lighthouse                                                |

## Dev-Workflow

### Schnellstart (aus dem Repo-Root)

```bash
pnpm demo:dev
```

Baut das Widget einmal, startet dann **beide** Watch-Prozesse parallel:

1. `@bauer-group/accessibility-widget` — esbuild-Watch, rebuildet bei jeder Widget-Source-Änderung
2. `@bauer-group/accessibility-widget-demo` — Vite Dev-Server auf `http://localhost:5173`

Änderungen am Widget landen nach Browser-Reload sofort im Demo — die Vite-Middleware serviert `/accessibility-widget/*` direkt aus `packages/widget/dist/` (siehe [`vite.config.ts`](./vite.config.ts)).

### Nur Demo

```bash
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

Der `predev`-Hook baut das Widget einmal, falls nötig, und startet dann Vite. Keine Watch auf dem Widget — für reine Demo-UI-Arbeit.

### Zwei Terminals (Widget-Watch manuell)

```bash
# Terminal 1
pnpm --filter @bauer-group/accessibility-widget dev

# Terminal 2
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

## Build

```bash
pnpm demo:build       # prebuild (widget + copy) → typecheck → vite build
pnpm demo:preview     # serviert dist/ auf :4173 (strictPort)
```

## Scanner-Testziel

Die Demo enthält **absichtlich** vier WCAG-Violations als stabile Testfälle:

- `<img>` ohne `alt`-Attribut
- Link-Text „hier klicken" (nicht kontextbezogen)
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
├── index.html                         Landing-Page (alle Sektionen)
├── src/
│   ├── main.ts                        Orchestrierung (API-Explorer, Event-Stream, Tabs, Copy)
│   └── styles.css                     Design-System mit CSS-Variablen, Light/Dark, clamp()
├── public/
│   ├── accessibility-widget-assets/   Demo-spezifische Icons
│   ├── accessibility-widget/          Wird von prebuild befüllt (gitignored)
│   ├── barrierefreiheit.html          A11y-Erklärung (§ 14 BFSG)
│   └── impressum.html
├── scripts/
│   ├── copy-widget.ts                 Kopiert widget/dist → public/ für Prod-Build
│   └── ensure-widget-built.ts         Idempotenter predev-Guard
├── vite.config.ts                     Dev-Middleware + Build-Config
├── tsconfig.json                      TS-Config (strict, node + vite/client)
└── package.json
```

## Lizenz

AGPL-3.0-only oder kommerziell · © 2026 BAUER GROUP — siehe [LICENSE](../../LICENSE) / [LICENSING.md](../../LICENSING.md)
