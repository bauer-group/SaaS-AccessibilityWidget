# Testing-Strategie

## Aktueller Stand (Stand 2026-04)

| Paket | Test-Runner | Abdeckung |
|---|---|---|
| `packages/widget` | Vitest (happy-dom) | 13/18 passing — 5 preexistierende happy-dom-Fehler in `state.test.ts` (`localStorage.clear is not a function`) |
| `apps/demo` | — | Kein Test (nur Testziel für Widget selbst) |
| `integrations/js/react` | — | Kein Test (Wrapper-Logik trivial) |
| `integrations/js/vue` | — | Kein Test |
| `integrations/js/angular` | — | Kein Test |
| `integrations/js/svelte` | — | Kein Test |
| `integrations/js/nextjs` | — | Kein Test |
| `integrations/js/nuxt` | — | Kein Test |
| `integrations/js/astro` | — | Kein Test (Astro-Komponente, kein Build nötig) |
| `integrations/cms/*` | — | Kein Test (PHP-Pakete) |
| `integrations/shops/*` | — | Kein Test (Liquid/PHP-Pakete) |

## Bekannte Lücken — mit Begründung

### 1. `state.test.ts` schlägt fehl mit happy-dom

**Symptom**: `TypeError: localStorage.clear is not a function` in allen 5 Test-Cases.

**Ursache**: happy-dom's `localStorage`-Shim implementiert `.clear()` nicht korrekt.

**Workaround**: Tests laufen lassen, bekannt ignorieren. Upgrade auf jsdom hätte andere Trade-offs (langsamer, andere Rendering-Quirks).

**Mögliche Fixes**:
- `happy-dom` auf eine Version mit gefixtem localStorage updaten (prüfen, ob jemand das gefixt hat)
- Eigener `beforeEach` mit manuellem Reset: `Object.keys(localStorage).forEach(k => delete localStorage[k])`
- Migration zu jsdom

Ein Ticket dazu ist ein guter Einstiegs-PR für Beitragende.

### 2. Integration-Pakete haben keine Tests

**Begründung**: Die Wrapper-Logik ist 10-20 Zeilen pro Integration und im Wesentlichen identisch (Window-Property setzen, Script-Tag einfügen). Integration-Tests auf **echten** Framework-Setups (Storybook + Browser) würden deutlich mehr Wert bringen als Unit-Tests der Wrapper.

**Geplant für v1.1**:
- Playwright-E2E gegen jedes Integration in einer minimalen Host-App
- Snapshot-Tests für die SSR-Rendering-Pfade (Next.js, Nuxt, Astro)

### 3. Demo-App hat keine automatisierten Tests

**Begründung**: Die Demo ist selbst das Test-Subjekt — sie enthält **bewusst** 4 WCAG-Barrieren als Scanner-Zielscheibe (Bild ohne `alt`, unspezifischer Link-Text, niedriger Kontrast-Button, Formular ohne Label). Sie dient als stabiles Ziel für externe WCAG-Scanner (axe-core, pa11y, Playwright-AxE, Lighthouse CI).

## Test-Commands

```bash
# Alle Tests
pnpm test

# Nur Widget
pnpm --filter @bauer-group/accessibility-widget test

# Watch-Modus
pnpm --filter @bauer-group/accessibility-widget test:watch

# Mit Coverage
pnpm --filter @bauer-group/accessibility-widget exec vitest run --coverage

# ESLint + Formatter
pnpm lint
pnpm format:check
```

## Erwartung an neue Features

Aus `CONTRIBUTING.md`:

- Neue Feature: **Tests erforderlich**, Coverage ≥ 80 % für kritische Module
- Bug-Fix: **Regressionstest erforderlich**
- i18n-Locale: **mindestens ein `i18n.test.ts`-Case** für das neue Locale
- Neues Integration: **README mit Code-Beispiel** genügt (Test kommt mit v1.1-E2E)

## Manuelle Tests vor Release

Automatisierung deckt nicht alles. Vor jedem Release manuell:

- [ ] Demo im Chrome, Firefox, Safari, Edge öffnen
- [ ] Widget-Panel komplett per Tastatur bedienen (Tab, Shift+Tab, Enter, Escape)
- [ ] Mit NVDA oder VoiceOver durchsteppen — alle Kontrollen angesprochen?
- [ ] `prefers-reduced-motion` respektiert?
- [ ] RTL-Layout (`ar`-Locale) funktioniert?
- [ ] localStorage-Persistenz über Reload bestehen?
- [ ] `window.AccessibilityWidget.reset()` bringt initialen Zustand zurück?

Der automatisierte WCAG-Scan gegen `http://localhost:5173` wird außerhalb dieses Repos von einem Compliance-Scanner betrieben und ist daher nicht Teil der CI dieses Widget-Repos.
