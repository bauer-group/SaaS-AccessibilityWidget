# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.
Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionierung [SemVer](https://semver.org/lang/de/).

## [Unreleased]

### Changed
- **Repository-Split**: Aus dem ursprünglichen `SaaS-BFSGWidget`-Monorepo ausgelagert. Dieses Repo enthält nur noch das Widget + Framework-Integrationen + Demo. Der Scanner, die REST-API und der Statement-Generator verbleiben im Compliance-Repo.
- **Package-Rename**: `@bauer-group/bfsg-widget*` → `@bauer-group/accessibility-widget*`. Die Runtime-API (`window.BFSGWidget`, CDN-Dateinamen `bfsg-widget-loader.min.js`) bleibt bewusst bestehen — nur der NPM-Distribution-Name wurde generischer.
- **Shared-Types integriert**: Statt eines eigenen `@bauer-group/bfsg-shared`-Pakets leben Widget-Types jetzt direkt in `packages/widget/src/types/` und werden über den Public-Entry-Point exportiert.
- **DTS-Build hinzugefügt**: Der Widget-Build emittiert jetzt zusätzlich kompilierte `.d.ts`-Files. Integrationen konsumieren Types über Node-Resolution statt per Source-Alias (kein `paths`-Mapping mehr auf Cross-Package-Source).

### Added
- `eslint.config.js` mit flat config (ESLint 9, typescript-eslint 8)
- Widget-spezifische CONTRIBUTING, CHANGELOG, TESTING-Dokumente
- Wurzel-`type: module`

### Fixed
- `BFSGWidgetClient()` in Next.js-Integration hatte falschen Return-Typ (`: null` statt inferiert)
- Fehlende `@angular/common`-Peer-Dependency in Angular-Integration
- Globale `Window`-Deklarationen in `loader.ts` und `core.ts` waren inkonsistent — jetzt konsolidiert in `src/globals.d.ts`

## [1.0.0-alpha.1]

Initialer Stand aus dem vorherigen Monorepo (`SaaS-BFSGWidget`):

- `packages/widget` — Lazy-Loading Accessibility-Widget (Loader + Core), Vanilla TS, 8 Locales
- `apps/demo` — Interaktive Vite-Demo mit eingebauten A11y-Barrieren als Scanner-Zielscheibe
- `integrations/js/*` — React 19, Vue 3, Angular 19, Svelte 5, Next.js 15, Nuxt 3, Astro 4
- `integrations/cms/*` — WordPress 6, TYPO3 13, Drupal 11
- `integrations/shops/*` — Shopify, Shopware 6, Magento 2.4
