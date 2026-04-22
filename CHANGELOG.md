# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.
Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionierung [SemVer](https://semver.org/lang/de/).

## [Unreleased]

### Changed

- **Integrations-Pakete aus pnpm-Workspace entfernt.** `pnpm-workspace.yaml` verwaltet nur noch `packages/*` + `apps/*`. Alle Integrationen (`integrations/js/*`, `integrations/cms/*`, `integrations/shops/*`) sind jetzt eigenständige Artefakte mit eigener Dependency-Auflösung und unabhängigem Release-Zyklus. Folgeänderungen:
  - `workspace:*`-Referenzen in Integration-`package.json` wurden auf `^1.0.0-alpha.1` umgestellt
  - ESLint-Ignore weitet sich auf `integrations/**`
- **Abschluss BFSG → AccessibilityWidget-Rename.** Rest-Vorkommen, die beim initialen Rename übersehen wurden, sind konsolidiert — betraf sowohl Laufzeit-kritische als auch kosmetische Stellen:
  - **Laufzeit-kritisch (war vorher tatsächlich gebrochen):** `window.BFSGWidgetConfig` → `window.AccessibilityWidgetConfig` in Shopware-Twig und Magento-Phtml; `data-bfsg="loader"`/`"css"` → `data-aw-loader`/`data-aw-css` in allen JS-, CMS- und Shop-Integrationen; `bfsg-widget-*.min.js`-Pfade → `accessibility-widget-*.min.js` in Shopware/Magento
  - **Magento-Modul-Namespace:** `BauerGroup_BFSGWidget` → `BauerGroup_AccessibilityWidget` in `module.xml` und `view/frontend/layout/default.xml` (synchron mit `registration.php`); scopeConfig-Namespace `bfsg_widget` → `accessibility_widget`
  - **TYPO3-TypoScript-Prefix:** `plugin.tx_bfsgwidget` → `plugin.tx_accessibilitywidget`; header-/footer-Keys `bfsgConfig`/`bfsgLoader` → `accessibilityWidgetConfig`/`accessibilityWidgetLoader`; PSR-4 `BauerGroup\BfsgWidget\\` → `BauerGroup\AccessibilityWidget\\`
  - **Svelte Action umbenannt:** `bfsgWidget` → `accessibilityWidget`; Nuxt-runtimeConfig-Key `bfsgWidget` → `accessibilityWidget`
  - **Shopware/Shopify/Drupal:** composer-Beschreibungen, Plugin-Titel und Modul-Kommentare konsolidiert
- **Abhängigkeiten auf aktuelle Stable-Versionen.** Integration-Peer- und devDependencies gebumpt (React 19.1, Angular 19.2, Svelte 5.20, Next 15.2, Astro 5, Nuxt ≥3.10). TypeScript-Caret `^5.8`, Vite 7, Vitest 3 im Haupt-Workspace bleiben.

### Added

- **Professionelle `WidgetConfig`-API.** Die 1-Line-Integration bleibt der Default-Pfad; die Config ist optional, aber jetzt umfassend dokumentiert und validiert. Alle Felder haben JSDoc-Kommentare für IDE-Autocomplete. Neu hinzugekommen:
  - `cssIntegrity` — SRI-Hash für die CSS-Datei (Parität zu `coreIntegrity`)
  - `offset: { x, y }` — Pixel-Abstand des FAB zur Ankerecke (für Chat-Widget/Cookie-Banner-Kollisionen)
  - `zIndex` — überschreibt den Default-z-index des FAB
  - `statementUrl` — URL zur Barrierefreiheitserklärung; rendert als Panel-Footer-Link, blockiert `javascript:` / `data:` Schemes
  - `disabledFeatures` — Feature-IDs, die komplett aus dem Panel entfernt und auch via Profil-Preset nicht aktiviert werden (z.B. `['tts']` auf Seiten ohne Text-Content)
  - `initialFeatures` — Features, die für **Erstbesucher** (ohne persistierten State) an sind. Wird einmalig in den localStorage geseed, ab dann übernimmt das Persistierte
- **Runtime-Validation.** `resolveConfig` validiert alle Felder (ungültige Locale/Position/Color → Fallback, non-finite zIndex/offset → Fallback, unbekannte FeatureIds in disabledFeatures/initialFeatures → Drop). Mit `debug: true` erscheinen die Validation-Ergebnisse als `console.warn`. Full-shape `ResolvedConfig`-Interface für alle Call-Sites.
- **Storage-Key-Bug in core.ts gefixt.** `core.set()`, `core.reset()`, `core.getState()` resolvten Config vorher aus leerem Input und ignorierten damit den User-supplied `storageKey` — bei Custom-Storage-Keys wurde auf der Default-Location gelesen/geschrieben. Jetzt lesen alle drei durch `readUserConfig()` aus `window.AccessibilityWidgetConfig`.
- **Demo-App professionalisiert.** [apps/demo/](./apps/demo/) komplett überarbeitet: Hero mit Status-Karte (≤5 KB Loader, ≤24 KB Core, 28 Locales, 0 Dependencies), sticky Topbar, Try-Karten mit Locale-Switcher (persistiert in `localStorage`), Integration-Tabs mit Copy-Buttons und ARIA-Keyboard-Navigation, Live-State-Panel (Poll alle 500 ms), Compliance-Karten (BFSG / EN 301 549 / WCAG 2.2 AA), Scanner-Testzone (collapsible). Design-System mit CSS-Variablen, Light/Dark, `clamp()`-basierter responsiver Typografie.
- **Live-Dev-Kopplung Demo ↔ Widget.** Neue Vite-Middleware in [apps/demo/vite.config.ts](./apps/demo/vite.config.ts) serviert `/accessibility-widget/*` direkt aus `packages/widget/dist/*` — kein Copy-on-predev mehr, Widget-Rebuilds sind nach Browser-Reload sofort sichtbar. Root-Script `pnpm demo:dev` startet Widget-Watch + Vite parallel.
- **Sauberer Demo-Build-Pipeline.** `pnpm demo:build` = Widget bauen → Files in `public/` kopieren → `tsc --noEmit` Typecheck → `vite build` mit Sourcemaps und gehashed Assets. `demo:preview` auf Port 4173 strict.
- `packages/widget/src/util/debug.ts` — `warnIfDebug()`-Helper. Alle bisher **silent-failenden** catch-Blöcke in `state.ts` + `loader.ts` emittieren jetzt `console.warn`, wenn `AccessibilityWidgetConfig.debug === true` gesetzt ist. Produktion bleibt rauschfrei.
- Smoke-Test-Scaffold für React-Integration (`integrations/js/react/test/AccessibilityWidget.test.tsx` + Vitest-Config). Verifiziert: idempotente Script-/Link-Injektion, Config-Merge ohne Clobbering, SRI-Propagation. Referenz-Pattern für analoge Tests in Vue/Svelte/Angular.
- **20 neue i18n-Locales** (alle Sprachen mit ≥ 8 Mio Sprechern, die mit Standard-Fonts sauber rendern):
  `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.
  Total jetzt **28 Locales**. `fa`, `ur`, `he` sind RTL (wie `ar`) und werden im Panel via `dir="rtl"` automatisch gelayoutet.
  ⚠ Fachterminologie (Screenreader, Fokusrahmen, Kontrastmodus) braucht pro Locale Review durch Muttersprachler:innen mit A11y-Erfahrung — siehe [CONTRIBUTIONS-WANTED.md](./CONTRIBUTIONS-WANTED.md).

### Fixed

- `state.test.ts` — `localStorage.clear is not a function` unter happy-dom. Ersetzt durch manuelle Iterator-Variante, die unter happy-dom + jsdom + realen Browsern identisch arbeitet. 18/18 Tests grün.
- React-Wrapper deduplizierte injizierte Assets über `data-bfsg`-Attribute — die tatsächliche Laufzeit des IIFE-Loaders sucht aber nach `data-aw-css`. Wrapper und Loader sind jetzt auf dieselben `data-aw-*`-Marker harmonisiert, damit SSR-Inject + IIFE-Re-Check korrekt dedupen.

### Changed (vor diesem Release)

- **Shared-Types integriert**: Statt eines separaten Packages leben Widget-Types jetzt direkt in `packages/widget/src/types/` und werden über den Public-Entry-Point exportiert.
- **DTS-Build hinzugefügt**: Der Widget-Build emittiert zusätzlich kompilierte `.d.ts`-Files. Integrationen konsumieren Types über Node-Resolution statt per Source-Alias.

## [1.0.0-alpha.1]

Initiales Release:

- `packages/widget` — Lazy-Loading Accessibility-Widget (Loader + Core), Vanilla TS, 8 Locales
- `apps/demo` — Interaktive Vite-Demo mit eingebauten A11y-Barrieren als Scanner-Zielscheibe
- `integrations/js/*` — React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
- `integrations/cms/*` — WordPress, TYPO3, Drupal
- `integrations/shops/*` — Shopify, Shopware, Magento
