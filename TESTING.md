# Testing-Strategie

<a id="english"></a>

> The testing strategy for the BAUER GROUP Accessibility Widget — current state, known gaps with rationale, test commands and the manual pre-release checklist.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

## Current state (as of 2026-06)

| Package           | Test runner        | Coverage                                                  |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `packages/widget` | Vitest (happy-dom) | Unit tests (state, i18n, config, loader) — `pnpm test`    |
| `apps/demo`       | —                  | No tests (it is itself the scanner target for the widget) |

> The integrations (framework wrappers, CMS/shop plugins) are tested in their [own repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (e.g. Vitest smoke tests in the React wrapper).

## Known gaps — with rationale

### 1. `state.test.ts` fails with happy-dom

**Symptom**: `TypeError: localStorage.clear is not a function` in all 5 test cases.

**Cause**: happy-dom's `localStorage` shim does not implement `.clear()` correctly.

**Workaround**: Let the tests run, ignore the known failure. Upgrading to jsdom would have other trade-offs (slower, different rendering quirks).

**Possible fixes**:

- Update `happy-dom` to a version with a fixed localStorage (check whether someone has fixed it)
- Custom `beforeEach` with a manual reset: `Object.keys(localStorage).forEach(k => delete localStorage[k])`
- Migrate to jsdom

A ticket for this is a good first PR for contributors.

### 2. Integrations live in their own repo

The framework wrappers and CMS/shop plugins have moved to the [integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) and are tested **there** (Vitest smoke tests per wrapper; E2E against real host apps is planned there). This repo only tests the core.

### 3. Demo app has no automated tests

**Rationale**: The demo is itself the test subject — it **deliberately** contains 4 WCAG barriers as a scanner target (image without `alt`, non-specific link text, low-contrast button, form without label). It serves as a stable target for external WCAG scanners (axe-core, pa11y, Playwright-AxE, Lighthouse CI).

## Test commands

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

## Expectation for new features

From `CONTRIBUTING.md`:

- New feature: **tests required**, coverage ≥ 80 % for critical modules
- Bug fix: **regression test required**
- i18n locale: **at least one `i18n.test.ts` case** for the new locale
- New integration: in the [integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (with its own tests there)

## Manual tests before release

Automation doesn't cover everything. Before every release, manually:

- [ ] Open the demo in Chrome, Firefox, Safari, Edge
- [ ] Operate the widget panel entirely by keyboard (Tab, Shift+Tab, Enter, Escape)
- [ ] Step through with NVDA or VoiceOver — are all controls announced?
- [ ] Is `prefers-reduced-motion` respected?
- [ ] Does the RTL layout (`ar` locale) work?
- [ ] Does localStorage persistence survive a reload?
- [ ] Does `window.AccessibilityWidget.reset()` bring back the initial state?

The automated WCAG scan against `http://localhost:5173` is run outside this repo by a compliance scanner and is therefore not part of this widget repo's CI.

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Die Testing-Strategie für das BAUER GROUP Accessibility Widget — aktueller Stand, bekannte Lücken mit Begründung, Test-Commands und die manuelle Pre-Release-Checkliste.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

### Aktueller Stand (Stand 2026-06)

| Paket             | Test-Runner        | Abdeckung                                                 |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `packages/widget` | Vitest (happy-dom) | Unit-Tests (State, i18n, Config, Loader) — `pnpm test`    |
| `apps/demo`       | —                  | Kein Test (ist selbst Scanner-Zielscheibe für das Widget) |

> Die Integrationen (Framework-Wrapper, CMS-/Shop-Plugins) werden in ihrem [eigenen Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) getestet (z. B. Vitest-Smoke-Tests im React-Wrapper).

### Bekannte Lücken — mit Begründung

#### 1. `state.test.ts` schlägt fehl mit happy-dom

**Symptom**: `TypeError: localStorage.clear is not a function` in allen 5 Test-Cases.

**Ursache**: happy-dom's `localStorage`-Shim implementiert `.clear()` nicht korrekt.

**Workaround**: Tests laufen lassen, bekannt ignorieren. Upgrade auf jsdom hätte andere Trade-offs (langsamer, andere Rendering-Quirks).

**Mögliche Fixes**:

- `happy-dom` auf eine Version mit gefixtem localStorage updaten (prüfen, ob jemand das gefixt hat)
- Eigener `beforeEach` mit manuellem Reset: `Object.keys(localStorage).forEach(k => delete localStorage[k])`
- Migration zu jsdom

Ein Ticket dazu ist ein guter Einstiegs-PR für Beitragende.

#### 2. Integrationen liegen im eigenen Repo

Die Framework-Wrapper und CMS-/Shop-Plugins sind in das [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) umgezogen und werden **dort** getestet (Vitest-Smoke-Tests je Wrapper; E2E gegen echte Host-Apps ist dort geplant). Dieses Repo testet nur den Core.

#### 3. Demo-App hat keine automatisierten Tests

**Begründung**: Die Demo ist selbst das Test-Subjekt — sie enthält **bewusst** 4 WCAG-Barrieren als Scanner-Zielscheibe (Bild ohne `alt`, unspezifischer Link-Text, niedriger Kontrast-Button, Formular ohne Label). Sie dient als stabiles Ziel für externe WCAG-Scanner (axe-core, pa11y, Playwright-AxE, Lighthouse CI).

### Test-Commands

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

### Erwartung an neue Features

Aus `CONTRIBUTING.md`:

- Neue Feature: **Tests erforderlich**, Coverage ≥ 80 % für kritische Module
- Bug-Fix: **Regressionstest erforderlich**
- i18n-Locale: **mindestens ein `i18n.test.ts`-Case** für das neue Locale
- Neue Integration: im [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (mit eigenen Tests dort)

### Manuelle Tests vor Release

Automatisierung deckt nicht alles. Vor jedem Release manuell:

- [ ] Demo im Chrome, Firefox, Safari, Edge öffnen
- [ ] Widget-Panel komplett per Tastatur bedienen (Tab, Shift+Tab, Enter, Escape)
- [ ] Mit NVDA oder VoiceOver durchsteppen — alle Kontrollen angesprochen?
- [ ] `prefers-reduced-motion` respektiert?
- [ ] RTL-Layout (`ar`-Locale) funktioniert?
- [ ] localStorage-Persistenz über Reload bestehen?
- [ ] `window.AccessibilityWidget.reset()` bringt initialen Zustand zurück?

Der automatisierte WCAG-Scan gegen `http://localhost:5173` wird außerhalb dieses Repos von einem Compliance-Scanner betrieben und ist daher nicht Teil der CI dieses Widget-Repos.
