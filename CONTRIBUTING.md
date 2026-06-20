# Mitwirken

Danke, dass Sie zum Accessibility Widget beitragen wollen.

## Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Branch-Strategie

- `main` — release-ready; CI muss grün sein
- Feature-Branches: `feat/<kurzbeschreibung>`, `fix/<kurzbeschreibung>`

## Commits (Conventional Commits, deutsch, past tense)

```
type(scope): past-tense subject (max 50 chars)

Body: was wurde geändert und warum.

Closes #123
```

Siehe BAUER-GROUP-Standards (`bg-commits.md`) für Details.

## Pull Requests

- 1 PR = 1 logische Änderung
- Tests für neue Features + Regressionstests für Bugfixes
- Coverage ≥ 80 % für kritische Module (Widget-Loader, Profile, State)
- Keine neuen Dependencies ohne Begründung (das Widget muss klein bleiben)

## Lokal testen

```bash
pnpm --filter @bauer-group/accessibility-widget test
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

## Monorepo-Layout & Scope der Root-Scripts

Das Repo ist in drei Zonen aufgeteilt mit bewusst **unterschiedlichen Entwicklungspfaden**:

| Zone                                            | Inhalt                                               | Workspace?                   | Released?            |
| ----------------------------------------------- | ---------------------------------------------------- | ---------------------------- | -------------------- |
| **Core** (`packages/widget`)                    | Das eigentliche Widget                               | ✅                           | ✅ npm               |
| **Demo** (`apps/demo`)                          | Live-Demo + Scanner-Zielscheibe                      | ✅                           | ❌ privat            |
| **JS-Integrationen** (`integrations/js/*`)      | React / Vue / Angular / Svelte / Next / Nuxt / Astro | ✅                           | ✅ npm (individuell) |
| **CMS-Integrationen** (`integrations/cms/*`)    | Drupal (PHP), TYPO3 (PHP), WordPress (PHP)           | ❌ Composer / WP-Plugin-Repo | ✅ extern            |
| **Shop-Integrationen** (`integrations/shops/*`) | Magento (PHP), Shopware (PHP), Shopify (Liquid)      | ❌ Composer / Shopify-CLI    | ✅ extern            |

**Wichtig:** Die Root-Scripts (`pnpm build`, `pnpm dev`, `pnpm test`, `pnpm typecheck`) sind bewusst auf **Core + Demo** beschränkt. Alltägliche Arbeit am Widget oder an der Demo berührt die Integrationen **nicht** — weder in Compile-Zeit, noch in der Test-Suite.

Wenn du Integrationen gezielt bearbeiten willst, gibt es separate Scripts:

```bash
pnpm integrations:build       # alle 7 JS-Integrationen bauen
pnpm integrations:test        # deren Tests laufen
pnpm integrations:typecheck   # TypeScript-Check
pnpm integrations:dev         # Watch-Modus für alle

# Einzelne Integration:
pnpm --filter @bauer-group/accessibility-widget-react build
pnpm --filter @bauer-group/accessibility-widget-react test
```

Die CMS- und Shop-Integrationen sind **gar nicht** Teil des pnpm-Workspace — sie leben in eigenen Ökosystemen (Composer, Shopify-CLI, WordPress-Plugin-Repo) und haben ihre eigenen Build/Deploy-Flows, die in ihren jeweiligen README-Dateien beschrieben sind.

### Warum die JS-Integrationen trotzdem im Workspace?

Zwei konkrete Vorteile, die lokale Arbeit deutlich beschleunigen:

1. **Sofort-Linking:** Ändert sich das Widget, sehen alle Integrationen die Änderung sofort (`workspace:^`-Protokoll → Symlinks in `node_modules/`). Kein `pnpm publish` im Kreis nötig, um ein Widget-Fix in einem React-Integration-Test zu prüfen.
2. **Ein `pnpm install` für alles:** Deduplizierte Deps im Root-`node_modules/.pnpm/` statt 7 separate Installs. Faster CI, weniger Disk-Space.

Die Kopplung ist trotzdem lose: jede Integration hat eigene `package.json`, eigene `tsconfig.json`, eigene Tests. Das Core-Widget wird via semantic-release publiziert; die Integrationen ziehen in ein eigenes Repo mit eigener Release-Pipeline um (siehe [Release](#release-semantic-release-conventional-commits)).

## Bundle-Size-Budget

Das Widget hat **harte Größen-Ziele**:

- Loader: ≤ 5 KB gzip
- Core: ≤ 24 KB gzip (28 Locales eingebettet — `accessibility-widget-core.min.js`)
- CSS: ≤ 3 KB gzip

Jeder Build zeigt die Größen am Ende (`scripts/measure-size.ts`). Wenn Sie einen Feature-PR machen, der das Budget überschreitet, ist eine Diskussion fällig, **bevor** Code gemergt wird.

## i18n (28 Locales)

Aktuell unterstützt (28 Locales, alle Sprachen mit ≥ 8 Mio Sprechern & zuverlässig renderbarer Schrift):
`de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

RTL-Locales: `ar`, `fa`, `ur`, `he` (Panel dreht automatisch via `isRtl()`).

Neue Locale hinzufügen:

1. `packages/widget/src/types/locale.ts` — Locale-Code in `SUPPORTED_LOCALES` aufnehmen
2. `packages/widget/src/i18n/` — neue Datei `<code>.ts` nach dem Muster von `de.ts`
3. `packages/widget/src/i18n/index.ts` — registrieren
4. Test in `packages/widget/test/i18n.test.ts`

## Accessibility-Eigentest

Dieses Widget muss sich **an den eigenen Standards messen lassen**. Vor jedem Release:

- Demo manuell mit Screenreader testen (NVDA/VoiceOver)
- Alle Features per Tastatur erreichbar
- FAB + Panel passen WCAG 2.1 AA Kontrast (4.5:1)

Der automatisierte WCAG-Scan läuft außerhalb dieses Repos und ist nicht Teil der CI dieses Widget-Repos.

## Release (semantic-release, Conventional Commits)

Das **Core-Widget** `@bauer-group/accessibility-widget` wird automatisiert via [semantic-release](https://semantic-release.gitbook.io/) released — gesteuert durch [Conventional Commits](https://www.conventionalcommits.org/). Demo und Monorepo-Root bleiben privat (`"private": true`).

Die sieben JS-Integrationen werden **nicht** aus diesem Repo publiziert. Sie ziehen in ein eigenes Integrations-Repo um und bekommen dort ihre eigene Release-Pipeline (npm, WordPress.org, Packagist, …). Bis dahin werden sie hier nur lokal im Workspace entwickelt (`workspace:^`).

### Ablauf

1. **Commits nach Conventional-Commits-Schema** auf `main` (bzw. via PR). Der Type bestimmt den SemVer-Bump: `fix:` → Patch, `feat:` → Minor, `feat!:` / `BREAKING CHANGE:` → Major. `docs:` / `chore:` / `refactor:` / `test:` / `style:` lösen kein Release aus.
2. **CI übernimmt den Rest** ([.github/workflows/nodejs-release.yml](.github/workflows/nodejs-release.yml)): bei Push auf `main` laufen Build + Test, dann semantic-release. Es ermittelt die nächste Version aus den Commits, bumpt `packages/widget/package.json`, schreibt das CHANGELOG, committet, taggt `vX.Y.Z` und legt ein GitHub-Release an. Der `publish-npm`-Job publiziert anschließend das Core-Paket nach npm (mit Provenance).
3. **CDN-Deploy** ([.github/workflows/deploy-cdn.yml](.github/workflows/deploy-cdn.yml)) startet automatisch nach erfolgreichem Release-Workflow: baut die getaggte Version und lädt sie in die unveränderlichen + floatenden CDN-Pfade (siehe [deploy/zones.json](deploy/zones.json)).

Kein manuelles Versionieren, keine `version`-Commits von Hand — nur saubere Conventional Commits.

### Lokaler Trockenlauf

```bash
pnpm cdn:build        # baut das Widget inkl. dist/integrity.json
pnpm cdn:deploy:dry   # zeigt, was in die CDN-Pfade hochgeladen würde (keine Writes)
```
