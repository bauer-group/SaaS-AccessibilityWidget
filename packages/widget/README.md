# @bauer-group/accessibility-widget

<a id="english"></a>

> Lazy-loading accessibility widget for **BFSG · EN 301 549 · WCAG 2.2 AA**.
> Loader ~5.7 KB gzip · Core ~26 KB gzip (28 locales embedded). No tracking, no cookies, no DOM/ARIA overrides of the host page.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

## One-line integration

```html
<!-- Latest within a major — auto patch/minor updates (no SRI pin): -->
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

That's enough in 95 % of cases. The widget auto-detects the language, renders the FAB in the bottom-right corner, and persists all user preferences in `localStorage`.

For production, **pin an immutable version** and secure it with Subresource Integrity:

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.5/accessibility-widget-loader.min.js"
  integrity="sha384-…"
  crossorigin="anonymous"
  defer
></script>
```

The `…/<version>/…` paths never change (SRI-safe to pin); the `…/v<major>/…` alias always serves the latest release in that major. Per-release SRI hashes live at `…/<version>/integrity.json` (and in `dist/integrity.txt` / `dist/integrity.json`).

## Configuration (optional)

When the defaults don't fit — branding, position, custom assets, feature-gating, statement link — set a config object **before** the loader script:

```html
<script>
  window.AccessibilityWidgetConfig = {
    locale: 'auto',
    primaryColor: '#0058a3',
    statementUrl: '/accessibility-statement',
  };
</script>
<script src="/accessibility-widget-loader.min.js" defer></script>
```

Invalid values fall back to defaults silently. With `debug: true`, warnings appear in the console.

## Full config reference

All fields are **optional**. TypeScript type definitions ship with `@bauer-group/accessibility-widget` (type-import `WidgetConfig`).

### Asset loading

| Field           | Type             | Default                                                  | Purpose                                                      |
| --------------- | ---------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| `corePath`      | `string`         | `/accessibility-widget/accessibility-widget-core.min.js` | URL of the on-demand core bundle                             |
| `cssPath`       | `string`         | `/accessibility-widget/accessibility-widget.min.css`     | URL of the widget CSS                                        |
| `coreIntegrity` | `string \| null` | `null`                                                   | SRI hash for the core (`sha384-…`, see `dist/integrity.txt`) |
| `cssIntegrity`  | `string \| null` | `null`                                                   | SRI hash for the CSS                                         |

### Localization

| Field    | Type               | Default  | Purpose                                                                                                  |
| -------- | ------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| `locale` | `Locale \| 'auto'` | `'auto'` | Preselected language. `'auto'` reads `<html lang>` / `navigator.language`. 28 locales supported (below). |

<details><summary>List of the 28 supported locales</summary>

`de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

RTL: `ar`, `fa`, `ur`, `he`.

</details>

### UI / branding

| Field          | Type                                                           | Default            | Purpose                                                                                 |
| -------------- | -------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `position`     | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'`   | FAB anchor corner                                                                       |
| `offset`       | `{ x?: number; y?: number }`                                   | `{ x: 20, y: 20 }` | Pixel offset from the anchor corner. Useful when a chat widget / cookie banner collides |
| `zIndex`       | `number`                                                       | `2147483646`       | FAB z-index. Lower it so in-page dialogs stack above                                    |
| `primaryColor` | `string`                                                       | `#0058a3`          | FAB background (any valid CSS color: hex, rgb(), hsl(), oklch(), named)                 |
| `buttonLabel`  | `string \| null`                                               | `null`             | Overrides the FAB `aria-label`. `null` → localized default                              |

### Persistence

| Field        | Type     | Default                | Purpose                                                                                            |
| ------------ | -------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `storageKey` | `string` | `accessibility-widget` | localStorage key for user preferences. Set differently on multi-tenant platforms to isolate brands |

### First-visit experience

| Field             | Type                                  | Default | Purpose                                                                                                                            |
| ----------------- | ------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `initialFeatures` | `Partial<Record<FeatureId, boolean>>` | `{}`    | Features enabled on the **first** visit (no persisted state). Seeded once into localStorage — after that, the persisted state wins |

### Feature-gating

| Field              | Type          | Default | Purpose                                                                                                               |
| ------------------ | ------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `disabledFeatures` | `FeatureId[]` | `[]`    | Features hidden from the panel and not activatable via a profile preset. e.g. `['tts']` on pages without text content |

### Legal / compliance

| Field          | Type     | Default | Purpose                                                                                                                                                                      |
| -------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statementUrl` | `string` | —       | URL to the accessibility statement (panel footer link). Recommended for BFSG § 14 / EN 301 549 § 12.1.1. Only `http(s)` + relative URLs; `javascript:` / `data:` are blocked |

### Behavior

| Field                  | Type      | Default | Purpose                                                                                                                                       |
| ---------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `draggableFab`         | `boolean` | `false` | End users can move the FAB via mouse/touch/Shift+Arrow. Position persists in `storageKey` and is reapplied next visit. Panel reset clears it. |
| `respectReducedMotion` | `boolean` | `true`  | Respect `prefers-reduced-motion` for animation features                                                                                       |
| `hideOnPrint`          | `boolean` | `true`  | Hide the FAB in print media                                                                                                                   |
| `debug`                | `boolean` | `false` | Emit silent failures (localStorage quota, load errors, validation) as `console.warn`                                                          |

## Example: enterprise deployment

```html
<script>
  window.AccessibilityWidgetConfig = {
    // Self-hosted assets with SRI pinning
    corePath: '/assets/accessibility-widget-core.min.js',
    cssPath: '/assets/accessibility-widget.min.css',
    coreIntegrity: 'sha384-BEDPwzuDcF3GgBUbNzaOTpqKHhONBEr73ZCZLY0Kg3o8opuY7JDEdj/25LiIbM3A',
    cssIntegrity: 'sha384-0t+ii2SnsYoSD/YuByxjc1EjkQOThsb5Z6ZqARi0WLkki39il/sfHcI6OzfqWrW9',

    // Brand
    locale: 'de',
    primaryColor: '#0058a3',
    position: 'bottom-left',
    offset: { x: 24, y: 96 }, // room for a live chat on top
    zIndex: 9999, // below in-page dialogs

    // Isolated storage namespace on a multi-tenant platform
    storageKey: 'acme-prod-a11y',

    // Onboarding: focus ring for first-time visitors
    initialFeatures: { focusOutline: true },

    // Don't offer TTS on the corporate site (too little text content)
    disabledFeatures: ['tts'],

    // Compliance
    statementUrl: '/accessibility-statement',

    debug: false,
  };
</script>
<script src="/assets/accessibility-widget-loader.min.js" defer></script>
```

## Features

The widget provides **user-preference features** — it **never** alters the host page's ARIA/semantics. Everything runs via `data-aw-*` attributes on `<html>` and CSS filters.

| Feature                                     | Effect                                |
| ------------------------------------------- | ------------------------------------- |
| `fontSize`                                  | `1 → 1.2 → 1.4 → 1.6` text scaling    |
| `lineHeight`                                | `1.5 → 1.8 → 2.0`                     |
| `letterSpacing`                             | `0 → 0.05 → 0.1em`                    |
| `contrast`                                  | off / high / dark / inverted          |
| `grayscale`, `invertColors`, `dyslexiaFont` | filters / font overrides              |
| `highlightLinks`                            | underline, outline, yellow background |
| `pauseAnimations`                           | `animation: none !important`          |
| `bigCursor`, `focusOutline`                 | visibility aids                       |
| `readingMask`, `readingGuide`               | reading aids                          |
| `tts`                                       | Web Speech API, local TTS per locale  |
| `structureNav`                              | generated headings navigation         |

## Profiles

Presets activate several features at once: `visionImpaired`, `motor`, `cognitive`, `seizureSafe`, `adhd`, `blind`.
(Features disabled via `disabledFeatures` are not activated by profiles.)

## Runtime API

| Method              | Signature             | Purpose                                                            |
| ------------------- | --------------------- | ------------------------------------------------------------------ |
| `open(opts?)`       | `Promise<void>`       | Open the panel (loads the core on demand)                          |
| `close()`           | `void`                | Close the panel                                                    |
| `reset()`           | `void`                | Clear all preferences + reload the page                            |
| `set(id, value)`    | `Promise<void>`       | Toggle a single feature                                            |
| `applyProfile(id)`  | `Promise<boolean>`    | Apply a profile preset (6 profiles, see above)                     |
| `setLocale(locale)` | `Promise<boolean>`    | Switch language at runtime (persistent, panel re-renders live)     |
| `setPosition(pos)`  | `void`                | Set the FAB to `{ x, y }` or back to the config anchor with `null` |
| `getState()`        | `WidgetState \| null` | Read the persisted state synchronously                             |
| `on(event, cb)`     | `() => void`          | Subscribe to an event, returns an unsubscribe function             |

### Examples

```js
// Toggle a feature
window.AccessibilityWidget.set('fontSize', true);

// Apply a profile
await window.AccessibilityWidget.applyProfile('visionImpaired');

// Switch language (no reload, panel re-renders)
await window.AccessibilityWidget.setLocale('fr');

// Position the FAB programmatically
window.AccessibilityWidget.setPosition({ x: 40, y: 200 });
window.AccessibilityWidget.setPosition(null); // back to the config anchor

// Subscribe to events (e.g. privacy-friendly analytics)
const off = window.AccessibilityWidget.on('stateChange', ({ state }) => {
  console.log(
    'active:',
    Object.keys(state.features).filter((k) => state.features[k]),
  );
});
off(); // unsubscribe later

// Or natively, without the helper
document.addEventListener('accessibility-widget:profileApplied', (e) => {
  analytics.track('a11y_profile', e.detail.profile);
});
```

### Events

| Event            | Payload                                      | Fires on                                             |
| ---------------- | -------------------------------------------- | ---------------------------------------------------- |
| `stateChange`    | `{ state: WidgetState }`                     | every state change (feature, profile, locale, reset) |
| `open`           | `{ trigger: HTMLElement \| null }`           | the panel opens                                      |
| `close`          | `{}`                                         | the panel closes                                     |
| `profileApplied` | `{ profile: ProfileId; state: WidgetState }` | a profile preset is applied                          |
| `localeChanged`  | `{ locale: Locale }`                         | the locale changes                                   |
| `reset`          | `{}`                                         | all preferences are cleared                          |

## Architecture

- `loader.ts` — IIFE, ~5.7 KB gzip, injects critical CSS, renders the FAB, loads the core on click
- `core.ts` — panel UI, features, focus trap, TTS; loaded on demand only
- `config.ts` — config resolution with runtime validation (`resolveConfig`)
- `state.ts` — localStorage persistence with debug-aware catches
- `features/*` — one file per feature, tree-shakeable
- `panel/panel.ts` — pure DOM composition, no framework dependency

## Development

```bash
pnpm install
pnpm --filter @bauer-group/accessibility-widget build    # builds dist/
pnpm --filter @bauer-group/accessibility-widget size     # checks the bundle budget
pnpm --filter @bauer-group/accessibility-widget test     # Vitest
```

## License

`@bauer-group/accessibility-widget` is **dual-licensed**:

- **GNU AGPL-3.0-only** for open-source use — see [LICENSE](../../LICENSE).
- **Commercial license** for closed/proprietary products or without the AGPL disclosure obligations — `info@ge.bauer-group.com`.

Details: [LICENSING.md](../../LICENSING.md).

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Lazy-loading Accessibility-Widget nach **BFSG · EN 301 549 · WCAG 2.2 AA**.
> Loader ~5,7 KB gzip · Core ~26 KB gzip (28 Locales eingebettet). Kein Tracking, kein Cookie, kein DOM-/ARIA-Override der Host-Seite.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

### 1-Zeilen-Integration

```html
<!-- Neueste Version eines Majors — automatische Patch/Minor-Updates (ohne SRI): -->
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

Das reicht in 95 % der Fälle. Das Widget erkennt die Sprache automatisch, rendert den FAB unten rechts und persistiert alle User-Präferenzen im `localStorage`.

Für Produktion eine **unveränderliche Version pinnen** und per Subresource Integrity absichern:

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.5/accessibility-widget-loader.min.js"
  integrity="sha384-…"
  crossorigin="anonymous"
  defer
></script>
```

Die `…/<version>/…`-Pfade ändern sich nie (SRI-sicher zu pinnen); der `…/v<major>/…`-Alias liefert stets das neueste Release dieses Majors. SRI-Hashes je Release liegen unter `…/<version>/integrity.json` (sowie in `dist/integrity.txt` / `dist/integrity.json`).

### Konfiguration (optional)

Wenn Standardwerte nicht passen — Branding, Position, abweichende Assets, Feature-Gating, Statement-Link — setzt du **vor** dem Loader-Script ein Config-Objekt:

```html
<script>
  window.AccessibilityWidgetConfig = {
    locale: 'auto',
    primaryColor: '#0058a3',
    statementUrl: '/barrierefreiheit',
  };
</script>
<script src="/accessibility-widget-loader.min.js" defer></script>
```

Ungültige Werte fallen stillschweigend auf Defaults zurück. Mit `debug: true` erscheinen Warnungen in der Console.

### Vollständige Config-Referenz

Alle Felder sind **optional**. TypeScript-Typdefinitionen liegen in `@bauer-group/accessibility-widget` (Type-Import aus `WidgetConfig`).

#### Asset-Loading

| Feld            | Typ              | Default                                                  | Zweck                                                      |
| --------------- | ---------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| `corePath`      | `string`         | `/accessibility-widget/accessibility-widget-core.min.js` | URL des On-Demand-Core-Bundles                             |
| `cssPath`       | `string`         | `/accessibility-widget/accessibility-widget.min.css`     | URL der Widget-CSS                                         |
| `coreIntegrity` | `string \| null` | `null`                                                   | SRI-Hash für Core (`sha384-…`, siehe `dist/integrity.txt`) |
| `cssIntegrity`  | `string \| null` | `null`                                                   | SRI-Hash für CSS                                           |

#### Lokalisierung

| Feld     | Typ                | Default  | Zweck                                                                                                        |
| -------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------ |
| `locale` | `Locale \| 'auto'` | `'auto'` | Vorausgewählte Sprache. `'auto'` liest aus `<html lang>` bzw. `navigator.language`. 28 Locales (siehe oben). |

#### UI / Branding

| Feld           | Typ                                                            | Default            | Zweck                                                                               |
| -------------- | -------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `position`     | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'`   | FAB-Ankerecke                                                                       |
| `offset`       | `{ x?: number; y?: number }`                                   | `{ x: 20, y: 20 }` | Pixel-Abstand zur Ankerecke. Nützlich, wenn Chat-Widget / Cookie-Banner kollidieren |
| `zIndex`       | `number`                                                       | `2147483646`       | FAB-z-index. Senken, damit In-Page-Dialoge drüber stacken                           |
| `primaryColor` | `string`                                                       | `#0058a3`          | FAB-Hintergrund (jeder gültige CSS-Farbwert: Hex, rgb(), hsl(), oklch(), Named)     |
| `buttonLabel`  | `string \| null`                                               | `null`             | Überschreibt FAB-`aria-label`. `null` → lokalisierter Default                       |

#### Persistenz

| Feld         | Typ      | Default                | Zweck                                                                                                         |
| ------------ | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `storageKey` | `string` | `accessibility-widget` | localStorage-Key für User-Präferenzen. Auf Multi-Tenant-Plattformen abweichend setzen, um Brands zu isolieren |

#### First-Visit-Experience

| Feld              | Typ                                   | Default | Zweck                                                                                                                                                       |
| ----------------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialFeatures` | `Partial<Record<FeatureId, boolean>>` | `{}`    | Features, die bei **erstem** Besuch ohne persistierten State an sind. Wird vom Widget einmalig in den localStorage geseed — danach gewinnt das Persistierte |

#### Feature-Gating

| Feld               | Typ           | Default | Zweck                                                                                                                                                  |
| ------------------ | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `disabledFeatures` | `FeatureId[]` | `[]`    | Features, die im Panel nicht angezeigt werden und auch via Profil-Preset nicht aktivierbar sind. Sinnvoll z. B. `['tts']` auf Seiten ohne Text-Content |

#### Legal / Compliance

| Feld           | Typ      | Default | Zweck                                                                                                                                                                          |
| -------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `statementUrl` | `string` | —       | URL zur Barrierefreiheitserklärung (Panel-Footer-Link). Empfohlen für BFSG § 14 / EN 301 549 § 12.1.1. Nur `http(s)` + relative URLs; `javascript:` / `data:` werden blockiert |

#### Verhalten

| Feld                   | Typ       | Default | Zweck                                                                                                                                                               |
| ---------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `draggableFab`         | `boolean` | `false` | End-User kann FAB per Maus/Touch/Shift+Arrow verschieben. Position persistiert in `storageKey` und wird beim nächsten Besuch angewendet. Reset im Panel löscht sie. |
| `respectReducedMotion` | `boolean` | `true`  | Respektiere `prefers-reduced-motion` bei Animations-Features                                                                                                        |
| `hideOnPrint`          | `boolean` | `true`  | FAB in Print-Medien ausblenden                                                                                                                                      |
| `debug`                | `boolean` | `false` | Silent-Failures (localStorage-Quota, Load-Fehler, Validation) als `console.warn` ausgeben                                                                           |

### Beispiel: Enterprise-Deployment

```html
<script>
  window.AccessibilityWidgetConfig = {
    // Self-hosted Assets mit SRI-Pinning
    corePath: '/assets/accessibility-widget-core.min.js',
    cssPath: '/assets/accessibility-widget.min.css',
    coreIntegrity: 'sha384-BEDPwzuDcF3GgBUbNzaOTpqKHhONBEr73ZCZLY0Kg3o8opuY7JDEdj/25LiIbM3A',
    cssIntegrity: 'sha384-0t+ii2SnsYoSD/YuByxjc1EjkQOThsb5Z6ZqARi0WLkki39il/sfHcI6OzfqWrW9',

    // Brand
    locale: 'de',
    primaryColor: '#0058a3',
    position: 'bottom-left',
    offset: { x: 24, y: 96 }, // Platz für Live-Chat drüber
    zIndex: 9999, // unter In-Page-Dialogen

    // Isolierter Storage-Namespace auf Multi-Tenant-Platform
    storageKey: 'acme-prod-a11y',

    // Onboarding: Fokus-Ring für Erstbesucher
    initialFeatures: { focusOutline: true },

    // TTS auf der Corporate-Site nicht anbieten (zu wenig Text-Content)
    disabledFeatures: ['tts'],

    // Compliance
    statementUrl: '/barrierefreiheit',

    debug: false,
  };
</script>
<script src="/assets/accessibility-widget-loader.min.js" defer></script>
```

### Features

Das Widget stellt **User-Preference-Features** bereit — es verändert **niemals** ARIA/Semantik der Host-Seite. Alles läuft über `data-aw-*`-Attribute auf `<html>` und CSS-Filter.

| Feature                                     | Wirkung                                    |
| ------------------------------------------- | ------------------------------------------ |
| `fontSize`                                  | `1 → 1.2 → 1.4 → 1.6` Textskalierung       |
| `lineHeight`                                | `1.5 → 1.8 → 2.0`                          |
| `letterSpacing`                             | `0 → 0.05 → 0.1em`                         |
| `contrast`                                  | off / hoch / dunkel / invertiert           |
| `grayscale`, `invertColors`, `dyslexiaFont` | Filter / Font-Overrides                    |
| `highlightLinks`                            | Unterstreichen, Rahmen, gelber Hintergrund |
| `pauseAnimations`                           | `animation: none !important`               |
| `bigCursor`, `focusOutline`                 | Sichtbarkeitshilfen                        |
| `readingMask`, `readingGuide`               | Lesehilfen                                 |
| `tts`                                       | Web Speech API, lokale TTS pro Locale      |
| `structureNav`                              | Generierte Überschriften-Navigation        |

### Profile

Voreinstellungen aktivieren mehrere Features gleichzeitig: `visionImpaired`, `motor`, `cognitive`, `seizureSafe`, `adhd`, `blind`.
(Deaktivierte Features via `disabledFeatures` werden von Profilen nicht aktiviert.)

### Runtime-API

| Method              | Signatur              | Zweck                                                            |
| ------------------- | --------------------- | ---------------------------------------------------------------- |
| `open(opts?)`       | `Promise<void>`       | Panel öffnen (lädt Core bei Bedarf)                              |
| `close()`           | `void`                | Panel schließen                                                  |
| `reset()`           | `void`                | Alle Präferenzen löschen + Page-Reload                           |
| `set(id, value)`    | `Promise<void>`       | Einzelnes Feature toggeln                                        |
| `applyProfile(id)`  | `Promise<boolean>`    | Profil-Preset anwenden (6 Profile, siehe oben)                   |
| `setLocale(locale)` | `Promise<boolean>`    | Sprache zur Laufzeit wechseln (persistent, Panel rerendert live) |
| `setPosition(pos)`  | `void`                | FAB an `{ x, y }` setzen oder mit `null` auf Config-Anker zurück |
| `getState()`        | `WidgetState \| null` | Persistenten State synchron lesen                                |
| `on(event, cb)`     | `() => void`          | Event abonnieren, gibt Unsubscribe zurück                        |

#### Beispiele

```js
// Feature toggeln
window.AccessibilityWidget.set('fontSize', true);

// Profil anwenden
await window.AccessibilityWidget.applyProfile('visionImpaired');

// Sprache wechseln (ohne Reload, Panel rerendert)
await window.AccessibilityWidget.setLocale('fr');

// FAB programmatisch positionieren
window.AccessibilityWidget.setPosition({ x: 40, y: 200 });
window.AccessibilityWidget.setPosition(null); // zurück zum Config-Anker

// Events abonnieren (z. B. Analytics, privacy-friendly)
const off = window.AccessibilityWidget.on('stateChange', ({ state }) => {
  console.log(
    'active:',
    Object.keys(state.features).filter((k) => state.features[k]),
  );
});
off(); // später unsubscriben

// Alternativ nativ, ohne Helper
document.addEventListener('accessibility-widget:profileApplied', (e) => {
  analytics.track('a11y_profile', e.detail.profile);
});
```

#### Events

| Event            | Payload                                      | Feuert bei                                            |
| ---------------- | -------------------------------------------- | ----------------------------------------------------- |
| `stateChange`    | `{ state: WidgetState }`                     | jeder State-Änderung (Feature, Profil, Locale, Reset) |
| `open`           | `{ trigger: HTMLElement \| null }`           | Panel wird geöffnet                                   |
| `close`          | `{}`                                         | Panel wird geschlossen                                |
| `profileApplied` | `{ profile: ProfileId; state: WidgetState }` | Profil-Preset wird angewendet                         |
| `localeChanged`  | `{ locale: Locale }`                         | Locale wechselt                                       |
| `reset`          | `{}`                                         | alle Präferenzen gelöscht                             |

### Architektur

- `loader.ts` — IIFE, ~5,7 KB gzip, injiziert Critical-CSS, rendert FAB, lädt Core bei Klick
- `core.ts` — Panel-UI, Features, Focus-Trap, TTS; erst on-demand geladen
- `config.ts` — Config-Resolution mit Runtime-Validation (`resolveConfig`)
- `state.ts` — localStorage-Persistenz mit debug-aware catches
- `features/*` — 1 Datei pro Feature, tree-shakeable
- `panel/panel.ts` — reine DOM-Komposition, keine Framework-Dep

### Entwicklung

```bash
pnpm install
pnpm --filter @bauer-group/accessibility-widget build    # baut dist/
pnpm --filter @bauer-group/accessibility-widget size     # prüft Bundle-Budget
pnpm --filter @bauer-group/accessibility-widget test     # Vitest
```

### Lizenz

`@bauer-group/accessibility-widget` ist **dual lizenziert**:

- **GNU AGPL-3.0-only** für Open-Source-Nutzung — siehe [LICENSE](../../LICENSE).
- **Kommerzielle Lizenz** für geschlossene/proprietäre Produkte oder ohne AGPL-Offenlegungspflichten — `info@ge.bauer-group.com`.

Details: [LICENSING.md](../../LICENSING.md).
