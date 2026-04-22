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

## Bundle-Size-Budget

Das Widget hat **harte Größen-Ziele**:

- Loader: ≤ 5 KB gzip
- Core:   ≤ 24 KB gzip (28 Locales eingebettet — `accessibility-widget-core.min.js`)
- CSS:    ≤ 3 KB gzip

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
