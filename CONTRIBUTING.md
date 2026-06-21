# Mitwirken

<a id="english"></a>

> How to contribute to the BAUER GROUP Accessibility Widget — CLA, setup, branch strategy, commits, bundle-size budget, i18n and releases.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

Thank you for wanting to contribute to the Accessibility Widget.

## License & Contributor License Agreement (CLA)

The widget is **dual-licensed** — GNU **AGPL-3.0-only** OR a commercial license (see [LICENSING.md](./LICENSING.md)). So that BAUER GROUP can also offer contributions under the commercial license, **every contributor must sign the [CLA](./CLA.md) once**. On your first pull request the CLA bot comments automatically; you sign directly in the PR via a comment:

> `I have read the CLA Document and I hereby sign the CLA`

Without a signature the PR cannot be merged. The grant is a **license, not** a copyright transfer — you keep all rights to your contribution.

## Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Branch strategy

- `main` — release-ready; CI must be green
- Feature branches: `feat/<short-description>`, `fix/<short-description>`

## Commits (Conventional Commits, English, past tense)

```
type(scope): past-tense subject (max 50 chars)

Body: what was changed and why.

Closes #123
```

See the BAUER GROUP standards (`bg-commits.md`) for details.

## Pull Requests

- 1 PR = 1 logical change
- Tests for new features + regression tests for bug fixes
- Coverage ≥ 80 % for critical modules (widget loader, profiles, state)
- No new dependencies without justification (the widget must stay small)

## Testing locally

```bash
pnpm --filter @bauer-group/accessibility-widget test
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

## Monorepo layout

This repo contains **only the core + the demo**:

| Zone                         | Content                    | Workspace? | Released?                 |
| ---------------------------- | -------------------------- | ---------- | ------------------------- |
| **Core** (`packages/widget`) | The actual widget          | ✅         | ✅ npm + CDN              |
| **Demo** (`apps/demo`)       | Live demo + scanner target | ✅         | ❌ private (GitHub Pages) |

The root scripts (`pnpm build`, `pnpm dev`, `pnpm test`, `pnpm typecheck`) run across **core + demo**.

> **Integrations have moved.** The framework wrappers (React/Vue/Angular/Svelte/Next/Nuxt/Astro) and the CMS/shop plugins (WordPress, TYPO3, Drupal, Shopify, Shopware, Magento) now live in their own repo: **[bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations)**. If you want to build or change an integration, work there — contract + guide in [docs/authoring-integrations.md](./docs/authoring-integrations.md).

## Bundle-size budget

The widget has **hard size targets**:

- Loader: ~5.7 KB gzip
- Core: ~26 KB gzip (28 locales embedded — `accessibility-widget-core.min.js`)
- CSS: ~3 KB gzip

Every build prints the sizes at the end (`scripts/measure-size.ts`). If you make a feature PR that exceeds the budget, a discussion is due **before** any code is merged.

## i18n (28 locales)

Currently supported (28 locales, all languages with ≥ 8 million speakers & reliably renderable typefaces):
`de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

RTL locales: `ar`, `fa`, `ur`, `he` (the panel flips automatically via `isRtl()`).

Add a new locale:

1. `packages/widget/src/types/locale.ts` — add the locale code to `SUPPORTED_LOCALES`
2. `packages/widget/src/i18n/` — new file `<code>.ts` following the pattern of `de.ts`
3. `packages/widget/src/i18n/index.ts` — register it
4. Test in `packages/widget/test/i18n.test.ts`

## Accessibility self-test

This widget must **hold itself to its own standards**. Before every release:

- Test the demo manually with a screen reader (NVDA/VoiceOver)
- All features reachable by keyboard
- FAB + panel meet WCAG 2.1 AA contrast (4.5:1)

The automated WCAG scan runs outside this repo and is not part of this widget repo's CI.

## Release (semantic-release, Conventional Commits)

The **core widget** `@bauer-group/accessibility-widget` is released automatically via [semantic-release](https://semantic-release.gitbook.io/) — driven by [Conventional Commits](https://www.conventionalcommits.org/). The demo and the monorepo root stay private (`"private": true`).

The seven JS integrations are **not** published from this repo — they have moved to [their own repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) and get their own release pipeline there (npm, WordPress.org, Packagist, …).

### Process

1. **Commits following the Conventional Commits scheme** on `main` (or via PR). The type determines the SemVer bump: `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major. `docs:` / `chore:` / `refactor:` / `test:` / `style:` do not trigger a release.
2. **CI handles the rest** ([.github/workflows/nodejs-release.yml](.github/workflows/nodejs-release.yml)): on push to `main`, build + test run, then semantic-release. It determines the next version from the commits, bumps `packages/widget/package.json`, writes the CHANGELOG, commits, tags `vX.Y.Z` and creates a GitHub release. The `publish-npm` job then publishes the core package **tokenless via OIDC Trusted Publishing** to npm (no provenance, since the source repo is private).
3. **CDN deploy** ([.github/workflows/deploy-cdn.yml](.github/workflows/deploy-cdn.yml)) starts automatically after a successful release workflow: it builds the tagged version and uploads it to the immutable + floating CDN paths (see [deploy/zones.json](deploy/zones.json)).

No manual versioning, no hand-written `version` commits — just clean Conventional Commits.

### Local dry run

```bash
pnpm cdn:build        # builds the widget incl. dist/integrity.json
pnpm cdn:deploy:dry   # shows what would be uploaded to the CDN paths (no writes)
```

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Wie Sie zum BAUER GROUP Accessibility Widget beitragen — CLA, Setup, Branch-Strategie, Commits, Bundle-Size-Budget, i18n und Releases.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Danke, dass Sie zum Accessibility Widget beitragen wollen.

### Lizenz & Contributor License Agreement (CLA)

Das Widget ist **dual-lizenziert** — GNU **AGPL-3.0-only** ODER eine kommerzielle Lizenz (siehe [LICENSING.md](./LICENSING.md)). Damit BAUER GROUP Beiträge auch unter der kommerziellen Lizenz anbieten kann, muss **jede:r Mitwirkende einmalig das [CLA](./CLA.md) signieren**. Beim ersten Pull Request kommentiert der CLA-Bot automatisch; signiert wird direkt im PR per Kommentar:

> `I have read the CLA Document and I hereby sign the CLA`

Ohne Signatur kann der PR nicht gemergt werden. Der Grant ist eine **Lizenz, keine** Copyright-Übertragung — du behältst alle Rechte an deinem Beitrag.

### Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

### Branch-Strategie

- `main` — release-ready; CI muss grün sein
- Feature-Branches: `feat/<kurzbeschreibung>`, `fix/<kurzbeschreibung>`

### Commits (Conventional Commits, deutsch, past tense)

```
type(scope): past-tense subject (max 50 chars)

Body: was wurde geändert und warum.

Closes #123
```

Siehe BAUER-GROUP-Standards (`bg-commits.md`) für Details.

### Pull Requests

- 1 PR = 1 logische Änderung
- Tests für neue Features + Regressionstests für Bugfixes
- Coverage ≥ 80 % für kritische Module (Widget-Loader, Profile, State)
- Keine neuen Dependencies ohne Begründung (das Widget muss klein bleiben)

### Lokal testen

```bash
pnpm --filter @bauer-group/accessibility-widget test
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

### Monorepo-Layout

Dieses Repo enthält **nur den Core + die Demo**:

| Zone                         | Inhalt                          | Workspace? | Released?                |
| ---------------------------- | ------------------------------- | ---------- | ------------------------ |
| **Core** (`packages/widget`) | Das eigentliche Widget          | ✅         | ✅ npm + CDN             |
| **Demo** (`apps/demo`)       | Live-Demo + Scanner-Zielscheibe | ✅         | ❌ privat (GitHub Pages) |

Die Root-Scripts (`pnpm build`, `pnpm dev`, `pnpm test`, `pnpm typecheck`) laufen über **Core + Demo**.

> **Integrationen sind umgezogen.** Die Framework-Wrapper (React/Vue/Angular/Svelte/Next/Nuxt/Astro) und die CMS-/Shop-Plugins (WordPress, TYPO3, Drupal, Shopify, Shopware, Magento) leben jetzt in einem eigenen Repo: **[bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations)**. Wer eine Integration bauen oder ändern will, arbeitet dort — Vertrag + Anleitung in [docs/authoring-integrations.md](./docs/authoring-integrations.md).

### Bundle-Size-Budget

Das Widget hat **harte Größen-Ziele**:

- Loader: ~5,7 KB gzip
- Core: ~26 KB gzip (28 Locales eingebettet — `accessibility-widget-core.min.js`)
- CSS: ~3 KB gzip

Jeder Build zeigt die Größen am Ende (`scripts/measure-size.ts`). Wenn Sie einen Feature-PR machen, der das Budget überschreitet, ist eine Diskussion fällig, **bevor** Code gemergt wird.

### i18n (28 Locales)

Aktuell unterstützt (28 Locales, alle Sprachen mit ≥ 8 Mio Sprechern & zuverlässig renderbarer Schrift):
`de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

RTL-Locales: `ar`, `fa`, `ur`, `he` (Panel dreht automatisch via `isRtl()`).

Neue Locale hinzufügen:

1. `packages/widget/src/types/locale.ts` — Locale-Code in `SUPPORTED_LOCALES` aufnehmen
2. `packages/widget/src/i18n/` — neue Datei `<code>.ts` nach dem Muster von `de.ts`
3. `packages/widget/src/i18n/index.ts` — registrieren
4. Test in `packages/widget/test/i18n.test.ts`

### Accessibility-Eigentest

Dieses Widget muss sich **an den eigenen Standards messen lassen**. Vor jedem Release:

- Demo manuell mit Screenreader testen (NVDA/VoiceOver)
- Alle Features per Tastatur erreichbar
- FAB + Panel passen WCAG 2.1 AA Kontrast (4.5:1)

Der automatisierte WCAG-Scan läuft außerhalb dieses Repos und ist nicht Teil der CI dieses Widget-Repos.

### Release (semantic-release, Conventional Commits)

Das **Core-Widget** `@bauer-group/accessibility-widget` wird automatisiert via [semantic-release](https://semantic-release.gitbook.io/) released — gesteuert durch [Conventional Commits](https://www.conventionalcommits.org/). Demo und Monorepo-Root bleiben privat (`"private": true`).

Die sieben JS-Integrationen werden **nicht** aus diesem Repo publiziert — sie sind in [ein eigenes Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) umgezogen und bekommen dort ihre eigene Release-Pipeline (npm, WordPress.org, Packagist, …).

#### Ablauf

1. **Commits nach Conventional-Commits-Schema** auf `main` (bzw. via PR). Der Type bestimmt den SemVer-Bump: `fix:` → Patch, `feat:` → Minor, `feat!:` / `BREAKING CHANGE:` → Major. `docs:` / `chore:` / `refactor:` / `test:` / `style:` lösen kein Release aus.
2. **CI übernimmt den Rest** ([.github/workflows/nodejs-release.yml](.github/workflows/nodejs-release.yml)): bei Push auf `main` laufen Build + Test, dann semantic-release. Es ermittelt die nächste Version aus den Commits, bumpt `packages/widget/package.json`, schreibt das CHANGELOG, committet, taggt `vX.Y.Z` und legt ein GitHub-Release an. Der `publish-npm`-Job publiziert anschließend das Core-Paket **tokenlos via OIDC Trusted Publishing** nach npm (keine Provenance, da der Quell-Repo privat ist).
3. **CDN-Deploy** ([.github/workflows/deploy-cdn.yml](.github/workflows/deploy-cdn.yml)) startet automatisch nach erfolgreichem Release-Workflow: baut die getaggte Version und lädt sie in die unveränderlichen + floatenden CDN-Pfade (siehe [deploy/zones.json](deploy/zones.json)).

Kein manuelles Versionieren, keine `version`-Commits von Hand — nur saubere Conventional Commits.

#### Lokaler Trockenlauf

```bash
pnpm cdn:build        # baut das Widget inkl. dist/integrity.json
pnpm cdn:deploy:dry   # zeigt, was in die CDN-Pfade hochgeladen würde (keine Writes)
```
