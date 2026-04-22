# @bauer-group/accessibility-widget

> Lazy-loading Accessibility-Widget nach **BFSG / EN 301 549 / WCAG 2.2 AA**.
> Loader ≤ 5 KB gzip, Core ≤ 30 KB gzip (28 Locales eingebettet). Kein Tracking, kein Cookie, kein DOM-/ARIA-Override.

## 1-Line-Integration

```html
<script src="https://cdn.bauer-group.com/accessibility-widget/v1/accessibility-widget-loader.min.js" defer></script>
```

Das reicht in 95 % der Fälle. Das Widget erkennt die Sprache automatisch, rendert den FAB unten rechts und persistiert alle User-Präferenzen im `localStorage`.

## Konfiguration (optional)

Wenn Standardwerte nicht passen — Branding, Position, abweichende Assets, feature-gating, Statement-Link — setzt du **vor** dem Loader-Script ein Config-Objekt:

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

## Vollständige Config-Referenz

Alle Felder sind **optional**. TypeScript-Typdefinitionen liegen in `@bauer-group/accessibility-widget` (Type-Import aus `WidgetConfig`).

### Asset-Loading

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `corePath` | `string` | `/accessibility-widget/accessibility-widget-core.min.js` | URL des On-Demand-Core-Bundles |
| `cssPath` | `string` | `/accessibility-widget/accessibility-widget.min.css` | URL der Widget-CSS |
| `coreIntegrity` | `string \| null` | `null` | SRI-Hash für Core (`sha384-…`, siehe `dist/integrity.txt`) |
| `cssIntegrity` | `string \| null` | `null` | SRI-Hash für CSS |

### Lokalisierung

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `locale` | `Locale \| 'auto'` | `'auto'` | Vorausgewählte Sprache. `'auto'` liest aus `<html lang>` bzw. `navigator.language`. 28 Locales unterstützt — siehe unten. |

<details><summary>Liste der 28 unterstützten Locales</summary>

`de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

RTL: `ar`, `fa`, `ur`, `he`.
</details>

### UI / Branding

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | FAB-Ankerecke |
| `offset` | `{ x?: number; y?: number }` | `{ x: 20, y: 20 }` | Pixel-Abstand zur Ankerecke. Nützlich, wenn Chat-Widget / Cookie-Banner kollidieren |
| `zIndex` | `number` | `2147483646` | FAB-z-index. Senken, damit In-Page-Dialoge drüber stacken |
| `primaryColor` | `string` | `#0058a3` | FAB-Hintergrund (jeder gültige CSS-Farbwert: Hex, rgb(), hsl(), oklch(), Named) |
| `buttonLabel` | `string \| null` | `null` | Überschreibt FAB-`aria-label`. `null` → lokalisierter Default |

### Persistenz

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `storageKey` | `string` | `accessibility-widget` | localStorage-Key für User-Präferenzen. Auf Multi-Tenant-Plattformen abweichend setzen, um Brands zu isolieren |

### First-Visit-Experience

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `initialFeatures` | `Partial<Record<FeatureId, boolean>>` | `{}` | Features, die bei **erstem** Besuch ohne persistierten State an sind. Wird vom Widget einmalig in den localStorage geseed — danach gewinnt das Persistierte |

### Feature-Gating

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `disabledFeatures` | `FeatureId[]` | `[]` | Features, die im Panel nicht angezeigt werden und auch via Profil-Preset nicht aktivierbar sind. Sinnvoll z.B. `['tts']` auf Seiten ohne Text-Content |

### Legal / Compliance

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `statementUrl` | `string` | — | URL zur Barrierefreiheitserklärung (Panel-Footer-Link). Empfohlen für BFSG § 14 / EN 301 549 § 12.1.1. Nur `http(s)` + relative URLs; `javascript:` / `data:` werden blockiert |

### Verhalten

| Feld | Typ | Default | Zweck |
|---|---|---|---|
| `draggableFab` | `boolean` | `false` | End-User kann FAB per Maus/Touch/Shift+Arrow verschieben. Position persistiert in `storageKey` und wird beim nächsten Besuch angewendet. Reset im Panel löscht sie. |
| `respectReducedMotion` | `boolean` | `true` | Respektiere `prefers-reduced-motion` bei Animations-Features |
| `hideOnPrint` | `boolean` | `true` | FAB in Print-Medien ausblenden |
| `debug` | `boolean` | `false` | Silent-Failures (localStorage-Quota, Load-Fehler, Validation) als `console.warn` ausgeben |

## Beispiel: Enterprise-Deployment

```html
<script>
  window.AccessibilityWidgetConfig = {
    // Self-hosted assets mit SRI-Pinning
    corePath: '/assets/accessibility-widget-core.min.js',
    cssPath:  '/assets/accessibility-widget.min.css',
    coreIntegrity: 'sha384-BEDPwzuDcF3GgBUbNzaOTpqKHhONBEr73ZCZLY0Kg3o8opuY7JDEdj/25LiIbM3A',
    cssIntegrity:  'sha384-0t+ii2SnsYoSD/YuByxjc1EjkQOThsb5Z6ZqARi0WLkki39il/sfHcI6OzfqWrW9',

    // Brand
    locale: 'de',
    primaryColor: '#0058a3',
    position: 'bottom-left',
    offset: { x: 24, y: 96 },   // platz für Live-Chat drüber
    zIndex: 9999,               // unter In-Page-Dialogen

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

## Features

Das Widget stellt **User-Preference-Features** bereit — es verändert **niemals** ARIA/Semantik der Host-Seite. Alles läuft über `data-aw-*`-Attribute auf `<html>` und CSS-Filter.

| Feature | Wirkung |
|---|---|
| `fontSize` | `1 → 1.2 → 1.4 → 1.6` Textskalierung |
| `lineHeight` | `1.5 → 1.8 → 2.0` |
| `letterSpacing` | `0 → 0.05 → 0.1em` |
| `contrast` | off / hoch / dunkel / invertiert |
| `grayscale`, `invertColors`, `dyslexiaFont` | Filter / Font-Overrides |
| `highlightLinks` | Unterstreichen, Rahmen, gelber Hintergrund |
| `pauseAnimations` | `animation: none !important` |
| `bigCursor`, `focusOutline` | Sichtbarkeitshilfen |
| `readingMask`, `readingGuide` | Lesehilfen |
| `tts` | Web Speech API, lokale TTS pro Locale |
| `structureNav` | Generierte Überschriften-Navigation |

## Profile

Voreinstellungen aktivieren mehrere Features gleichzeitig: `visionImpaired`, `motor`, `cognitive`, `seizureSafe`, `adhd`, `blind`.
(Deaktivierte Features via `disabledFeatures` werden von Profilen nicht aktiviert.)

## Runtime-API

| Method | Signatur | Zweck |
|---|---|---|
| `open(opts?)` | `Promise<void>` | Panel öffnen (lädt Core bei Bedarf) |
| `close()` | `void` | Panel schließen |
| `reset()` | `void` | Alle Präferenzen löschen + Page-Reload |
| `set(id, value)` | `Promise<void>` | Einzelnes Feature toggeln |
| `applyProfile(id)` | `Promise<boolean>` | Profil-Preset anwenden (6 Profile, siehe oben) |
| `setLocale(locale)` | `Promise<boolean>` | Sprache zur Laufzeit wechseln (persistent, Panel rerendert live) |
| `setPosition(pos)` | `void` | FAB an `{ x, y }` setzen oder mit `null` auf Config-Anker zurück |
| `getState()` | `WidgetState \| null` | Persistenten State synchron lesen |
| `on(event, cb)` | `() => void` | Event abonnieren, gibt Unsubscribe zurück |

### Beispiele

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

// Events abonnieren (z.B. Analytics, privacy-friendly)
const off = window.AccessibilityWidget.on('stateChange', ({ state }) => {
  console.log('active:', Object.keys(state.features).filter((k) => state.features[k]));
});
off(); // später unsubscriben

// Alternativ nativ, ohne Helper
document.addEventListener('accessibility-widget:profileApplied', (e) => {
  analytics.track('a11y_profile', e.detail.profile);
});
```

### Events

| Event | Payload | Feuert bei |
|---|---|---|
| `stateChange` | `{ state: WidgetState }` | Jeder State-Änderung (Feature, Profil, Locale, Reset) |
| `open` | `{ trigger: HTMLElement \| null }` | Panel wird geöffnet |
| `close` | `{}` | Panel wird geschlossen |
| `profileApplied` | `{ profile: ProfileId; state: WidgetState }` | Profil-Preset wird angewendet |
| `localeChanged` | `{ locale: Locale }` | Locale wechselt |
| `reset` | `{}` | Alle Präferenzen gelöscht |

## Architektur

- `loader.ts` — IIFE, ≤ 5 KB gzip, injiziert Critical-CSS, rendert FAB, lädt Core bei Klick
- `core.ts` — Panel-UI, Features, Focus-Trap, TTS; erst on-demand geladen
- `config.ts` — Config-Resolution mit Runtime-Validation (`resolveConfig`)
- `state.ts` — localStorage-Persistenz mit debug-aware catches
- `features/*` — 1 Datei pro Feature, tree-shakeable
- `panel/panel.ts` — reine DOM-Komposition, keine Framework-Dep

## Entwicklung

```bash
pnpm install
pnpm --filter @bauer-group/accessibility-widget build    # baut dist/
pnpm --filter @bauer-group/accessibility-widget size     # prüft Bundle-Budget
pnpm --filter @bauer-group/accessibility-widget test     # Vitest (40 Tests)
```

## Lizenz

MIT © BAUER GROUP
