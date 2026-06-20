# Testing-Strategie

## Aktueller Stand (Stand 2026-06)

| Paket             | Test-Runner        | Abdeckung                                                 |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `packages/widget` | Vitest (happy-dom) | Unit-Tests (State, i18n, Config, Loader) — `pnpm test`    |
| `apps/demo`       | —                  | Kein Test (ist selbst Scanner-Zielscheibe für das Widget) |

> Die Integrationen (Framework-Wrapper, CMS-/Shop-Plugins) werden in ihrem [eigenen Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) getestet (z. B. Vitest-Smoke-Tests im React-Wrapper).

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

### 2. Integrationen liegen im eigenen Repo

Die Framework-Wrapper und CMS-/Shop-Plugins sind in das [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) umgezogen und werden **dort** getestet (Vitest-Smoke-Tests je Wrapper; E2E gegen echte Host-Apps ist dort geplant). Dieses Repo testet nur den Core.

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
- Neue Integration: im [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (mit eigenen Tests dort)

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
