## [1.0.0](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v0.0.0...v1.0.0) (2026-06-20)

### ⚠ BREAKING CHANGES

* **widget:** replaced BFSG-referencing disclaimer with configurable footer
* **widget:** changed default keyboard shortcut to Ctrl+Alt+A
* **workspace:** Integration-Pakete müssen ab jetzt eigenständig
installiert werden (cd integrations/js/<name> && pnpm install). Konsumenten
aus dem Registry sind nicht betroffen — @bauer-group/accessibility-widget
wird über Caret-Version referenziert statt workspace:*.
* **naming:** renamed all BFSG identifiers to AccessibilityWidget

### 🚀 Features

* **cdn:** added R2 hosting and release pipeline ([980a3dc](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/980a3dc7a36d75f43c1fc8c368461d2b7a99b6ec))
* **demo:** professionalized landing page + live-dev middleware + build pipeline ([d5ea796](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d5ea796a4b7dfd6abff6a4a9e682b78a54fc5315))
* **demo:** runtime-API showcase — profile quick-actions, API explorer, event stream ([04fb6bd](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/04fb6bd727f13f23a451a2d7106e7c66717c2af5))
* **i18n:** added 20 new locales (>=8M speakers) + RTL helpers ([79301dd](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/79301dda14a8ef78b6f215e4a83230a97db8708a))
* **monorepo:** scaffolded accessibility widget repository ([08c6b19](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/08c6b1973fd8a74206852c61a3762e0a75e15281))
* **pages:** added GitHub Pages demo deployment ([ac007ef](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/ac007ef999348c857a6d4eec6b823c164797834c))
* **widget:** changed default keyboard shortcut to Ctrl+Alt+A ([12ebb65](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/12ebb651c583bd9e0f32334f463bd1400af31147))
* **widget:** made the FAB keyboard shortcut configurable + disableable ([8468ea1](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/8468ea18d68944d750ebf11d49116a3257c8dd50))
* **widget:** modernized panel with icons + drag ([bd7a4a6](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/bd7a4a6f09dc4d425fa1c4f1671ae698691efbd8))
* **widget:** opened external statementUrl links in a new tab ([05c832a](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/05c832aaf5650a02691c8d5386c020992ae172e9))
* **widget:** opt-in draggable FAB with state-persisted position ([a5a13d1](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/a5a13d1e1048958bd9ce8fcc945c828c7cec38f8))
* **widget:** professional WidgetConfig API with validation + 6 new fields ([fea54ff](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/fea54fff3f130b2ade2b9c23367acf3d733000b1))
* **widget:** replaced BFSG-referencing disclaimer with configurable footer ([eba657f](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/eba657f0a4f3c175897f936c918bb5ed71829370))
* **widget:** runtime API — applyProfile, setLocale, setPosition, events ([77fdfef](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/77fdfef53fca44b248d5ad15e8be8114c566c1d1))
* **widget:** set runtime version from the build ([4834641](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/4834641737157a3d2fdb8f2364542d6164cfb03c))

### 🐛 Bug Fixes

* **ci:** fixed pnpm setup in CI workflows ([2f04660](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/2f0466032670f6caaf860efe47dc0b708a791456))
* **ci:** pinned pnpm, dropped packageManager field ([d5e6d0d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d5e6d0d5ad9815025f77e5aa875b365ec9006ea2))
* **ci:** self-hosted build/test for pnpm+turbo ([59c3bd3](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/59c3bd386dac27a8843c3fe87230bc09ae8f9381))
* **ci:** used the shared nodejs-build reusable (pnpm) ([861797d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/861797d3078b21a711a8458f3cc32040dedb8c78))
* **integrations:** completed BFSG→AccessibilityWidget rename ([80946eb](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/80946ebca4fecd95d1b9d9cab7e0241fea4b37fd))
* **scripts:** fixed bootstrap spawn on Windows ([907e8fa](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/907e8fa997c42d90aa9243fe152d58a8e5e02026))
* **scripts:** handled pnpm's literal -- separator ([0ee6b9e](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/0ee6b9e30330419b4f7c45e2f953154ce2d2a01e))
* updated author email format across multiple package and composer files ([46772bc](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/46772bcd8b1897ec3d44ad72e2f9938bb52de670))
* **widget:** addressed panel drag, tooltip, FAB toggle, locale persistence ([d43a39e](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d43a39e9c0470dafbba9e3ce9c4b3d1f616b46c9))
* **widget:** aligned Powered-by link domain ([cb334d9](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/cb334d928ad482f87dfd9316b597b3147ee65c1e))
* **widget:** extended LOCALE_TO_BCP47 map to all 28 supported locales ([7bad014](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/7bad014e31a9b9d4a255496025274d9353f7b39f))
* **widget:** stopped edge-column tooltips from overflowing + triggering jump ([112fd6a](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/112fd6ac5a93a280d74a0c5eae4c31d380f80d24))
* **widget:** surfaced silent-fail catches + fixed state.test happy-dom ([5ba57d7](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/5ba57d7e356340640d38e19f68c508fa646b3ce4))

### ⏪ Reverts

* kept the SaaS-AccessibilityWidget repo URL ([a03051b](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/a03051b348aedafc6ea72cef3ac1911d8caee325))

### ♻️ Refactoring

* **monorepo:** decoupled integrations from core dev/release path ([918e6bf](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/918e6bf3382454a41d679234916ac3b3f4482eb1))
* **naming:** renamed all BFSG identifiers to AccessibilityWidget ([ebbd608](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/ebbd608ae251dc77443564bb33095ea60a8ca4e0))
* **naming:** renamed npm packages bfsg-widget to accessibility-widget ([990b32d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/990b32de3eab4b54d8259b246117108bfae565d5))
* **workspace:** detached integrations from pnpm workspace ([69f23b6](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/69f23b62dca2b6cba3ff154f14e97a06f82e3ba1))

# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.
Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionierung [SemVer](https://semver.org/lang/de/).

## [Unreleased]

### Changed

- **Integrations-Pakete zurück in den pnpm-Workspace aufgenommen.** `pnpm-workspace.yaml` listet jetzt `packages/*`, `apps/*` und `integrations/js/*`. Lokale Cross-Package-Entwicklung ist dadurch reibungslos — Änderungen am Widget sind sofort in den Integration-Tests sichtbar, kein Zwischen-Publish nötig. Dependency-Referenzen verwenden `workspace:*` und werden beim Publish via pnpm durch die aktuelle Version ersetzt.
- **CDN-Hosting + automatisierte Release-Pipeline.** Das Core-Widget wird via [semantic-release](https://semantic-release.gitbook.io/) (Conventional Commits) nach npm publiziert und über Cloudflare R2 ausgeliefert — unveränderliche `accessibility-widget/<version>/`-Pfade (SRI-pinbar) plus floatender `accessibility-widget/v<major>/`-Alias. Deploy-Tooling unter [scripts/deploy/](scripts/deploy/) + [deploy/zones.json](deploy/zones.json), Workflows unter [.github/workflows/](.github/workflows/). Die frühere Changesets-Konfiguration wurde zugunsten von semantic-release entfernt; die sieben JS-Integrationen ziehen in ein eigenes Repo um und werden dort released (nicht mehr aus diesem Repo).
- **Rebrand des Paketnamens auf den kanonischen `@bauer-group/accessibility-widget`.** Der private Monorepo-Root heißt jetzt `@bauer-group/accessibility-widget-workspace` (vorher `@bauer-group/saas-accessibility-widget`). Die GitHub-Repo-URL bleibt `bauer-group/SaaS-AccessibilityWidget`.
- **Laufzeit-Version aus dem Build.** `AccessibilityWidget.version` / `AccessibilityWidgetCore.version` werden beim Build via esbuild `define` aus der Paketversion gesetzt (vorher hartkodiert), sodass semantic-release-Releases überall konsistent dieselbe Version tragen.
- **Abschluss BFSG → AccessibilityWidget-Rename.** Rest-Vorkommen, die beim initialen Rename übersehen wurden, sind konsolidiert — betraf sowohl Laufzeit-kritische als auch kosmetische Stellen:
  - **Laufzeit-kritisch (war vorher tatsächlich gebrochen):** `window.BFSGWidgetConfig` → `window.AccessibilityWidgetConfig` in Shopware-Twig und Magento-Phtml; `data-bfsg="loader"`/`"css"` → `data-aw-loader`/`data-aw-css` in allen JS-, CMS- und Shop-Integrationen; `bfsg-widget-*.min.js`-Pfade → `accessibility-widget-*.min.js` in Shopware/Magento
  - **Magento-Modul-Namespace:** `BauerGroup_BFSGWidget` → `BauerGroup_AccessibilityWidget` in `module.xml` und `view/frontend/layout/default.xml` (synchron mit `registration.php`); scopeConfig-Namespace `bfsg_widget` → `accessibility_widget`
  - **TYPO3-TypoScript-Prefix:** `plugin.tx_bfsgwidget` → `plugin.tx_accessibilitywidget`; header-/footer-Keys `bfsgConfig`/`bfsgLoader` → `accessibilityWidgetConfig`/`accessibilityWidgetLoader`; PSR-4 `BauerGroup\BfsgWidget\\` → `BauerGroup\AccessibilityWidget\\`
  - **Svelte Action umbenannt:** `bfsgWidget` → `accessibilityWidget`; Nuxt-runtimeConfig-Key `bfsgWidget` → `accessibilityWidget`
  - **Shopware/Shopify/Drupal:** composer-Beschreibungen, Plugin-Titel und Modul-Kommentare konsolidiert
- **Abhängigkeiten auf aktuelle Stable-Versionen.** Integration-Peer- und devDependencies gebumpt (React 19.1, Angular 19.2, Svelte 5.20, Next 15.2, Astro 5, Nuxt ≥3.10). TypeScript-Caret `^5.8`, Vite 7, Vitest 3 im Haupt-Workspace bleiben.

### Added

- **Footer-Disclaimer konfigurierbar, Gesetzes-Referenz entfernt, Powered-by-Zeile hinzugefügt.** Die bisherige Default-Zeile referenzierte `§ 14 BFSG` — das ist deutsches Recht und passt für die 27 anderen EU-Mitgliedstaaten nicht. Der Text ist jetzt host-konfigurierbar via `WidgetConfig.disclaimer` (Default: nichts anzeigen; Host setzt eigenen Text falls gewünscht — Plain-Text, keine HTML-Injection). Darunter erscheint eine kleinere lokalisierte `"Powered by BAUER GROUP Accessibility-Widget"`-Zeile mit Link auf `https://accessibility-widget.app.professional-hosting.com`, unterdrückbar via `WidgetConfig.hidePoweredBy: true` für White-Label-Deployments. Translation-Feld `disclaimer` wurde durch kürzeres `poweredBy` ersetzt (Connector-Phrase in allen 28 Locales); das spart netto ~2 KB gzip im Core-Bundle.
- **Keyboard-Shortcut konfigurierbar + deaktivierbar, neuer Default `Ctrl+Alt+A`.** Neue Config-Option `keyboardShortcut`: Default ist `'ctrl+alt+a'` (branchenüblich für A11y-Widgets, seltenere Browser-/Extension-Kollision als Alt+Shift+A), kann auf einen beliebigen Combo (`'alt+shift+a'`, `'f2'`, …) umgestellt oder mit `false` komplett abgeschaltet werden. Invalid-Combos emittieren `console.warn` bei `debug: true` und fallen still aus. **Breaking** für Hosts, die sich auf den alten Alt+Shift+A-Default verlassen — explizit `keyboardShortcut: 'alt+shift+a'` setzen, um das alte Verhalten wiederherzustellen.
- **Runtime-API vervollständigt — alle Gaps geschlossen.** `window.AccessibilityWidget` bekommt vier neue Methoden und einen Event-Bus, damit Hosts das Widget vollständig programmatisch fernsteuern können:
  - `applyProfile(id)` — wendet eines der 6 Profil-Presets an; respektiert `disabledFeatures`
  - `setLocale(locale)` — Sprachwechsel zur Laufzeit, persistiert in `WidgetState.locale`, Panel rerendert live (vorher nur in-Panel möglich und transient)
  - `setPosition({ x, y } | null)` — FAB programmatisch positionieren oder auf Config-Anker zurück; funktioniert unabhängig von `draggableFab`
  - `on(event, handler)` — Event-Subscription via CustomEvent auf `document`. 6 Events: `stateChange`, `open`, `close`, `profileApplied`, `localeChanged`, `reset`. Rückgabewert ist Unsubscribe. Alternative: `document.addEventListener('accessibility-widget:*', …)` ohne Helper.
- **WidgetState erweitert** um `locale?: string` (persistierter User-Locale-Override). Panel-Dropdown speichert jetzt ebenfalls diese Locale — vorher war die In-Panel-Sprachumschaltung transient und ging bei Reload verloren.
- **Opt-in draggable FAB.** Neue Config-Option `draggableFab: true` erlaubt End-Usern, den FAB per Maus / Touch / Shift+Arrow zu verschieben. Position persistiert in `WidgetState.fabPosition` unter dem konfigurierten `storageKey` — beim nächsten Besuch lädt der Loader-IIFE sie **vor First Paint** via inline CSS custom properties (`--aw-fab-x/y`). Viewport-Clamp verhindert Off-Screen-Dragging; Panel-Reset löscht auch die custom Position. Loader-Budget von 5 KB auf 5.5 KB gzip gebumpt (Begründung in `scripts/measure-size.ts`).
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

## [0.1.0]

Initiales Release:

- `packages/widget` — Lazy-Loading Accessibility-Widget (Loader + Core), Vanilla TS, 8 Locales
- `apps/demo` — Interaktive Vite-Demo mit eingebauten A11y-Barrieren als Scanner-Zielscheibe
- `integrations/js/*` — React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
- `integrations/cms/*` — WordPress, TYPO3, Drupal
- `integrations/shops/*` — Shopify, Shopware, Magento
