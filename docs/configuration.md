# Configuration & runtime API

<a id="english"></a>

> The two control channels — declarative `AccessibilityWidgetConfig` before the loader, and the imperative `AccessibilityWidget` runtime API after boot.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

The widget works **with no configuration**. Optionally, the host controls it through two channels:

1. **`window.AccessibilityWidgetConfig`** — declarative, set **before** the loader, read once before first paint.
2. **`window.AccessibilityWidget`** — the imperative runtime API, available **after** the loader has booted.

## Declarative config

```html
<script>
  window.AccessibilityWidgetConfig = {
    locale: 'de',
    primaryColor: '#0058a3',
    statementUrl: '/accessibility-statement',
    disabledFeatures: ['tts'],
    draggableFab: true,
    initialFeatures: { focusOutline: true },
  };
</script>
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

### Most-used fields

| Field                            | Purpose                                                                   |
| -------------------------------- | ------------------------------------------------------------------------- |
| `locale`                         | Initial locale (otherwise auto-detected). 28 locales, RTL for ar/fa/ur/he |
| `primaryColor`                   | Accent color (FAB + panel)                                                |
| `corePath` / `cssPath`           | Core/CSS URLs — for **self-hosting** (see [usage.md](./usage.md))         |
| `coreIntegrity` / `cssIntegrity` | SRI hashes for core/CSS (`sha384-…`)                                      |
| `statementUrl`                   | Link to your accessibility statement (rendered in the panel footer)       |
| `disabledFeatures`               | Feature IDs removed entirely from the panel (e.g. `['tts']`)              |
| `initialFeatures`                | Features enabled for first-time visitors                                  |
| `draggableFab`                   | Let users move the FAB via mouse / touch / keyboard                       |
| `keyboardShortcut`               | Toggle shortcut (default `'ctrl+alt+a'`; `false` disables it)             |
| `storageKey`                     | localStorage key (configurable)                                           |
| `hidePoweredBy`                  | Hide the "Powered by" line (white-label)                                  |
| `debug`                          | `console.warn` on validation issues                                       |

> **Full field-by-field reference** (every type, default, and validation rule) lives in the package README: [`packages/widget/README.md`](../packages/widget/README.md#vollständige-config-referenz).

## Runtime API

After boot, `window.AccessibilityWidget` is available:

```js
await AccessibilityWidget.applyProfile('visionImpaired'); // one of 6 profile presets
await AccessibilityWidget.setLocale('ja'); // change language at runtime
AccessibilityWidget.setPosition({ x: 40, y: 200 }); // position the FAB
const unsubscribe = AccessibilityWidget.on('profileApplied', ({ profile }) => {
  analytics.track('a11y_profile', profile);
});
AccessibilityWidget.version; // the built version string
```

Events: `stateChange`, `open`, `close`, `profileApplied`, `localeChanged`, `reset` (also dispatched as `document` CustomEvents named `accessibility-widget:*`). The full API with examples is in the [package README](../packages/widget/README.md#runtime-api).

## Security

No configuration injects HTML: `statementUrl` rejects `javascript:` / `data:` schemes and `disclaimer` is plain text. The widget never overrides the host page's ARIA/DOM semantics. Validate and escape any host-supplied values you pass in.

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Die zwei Steuerkanäle — deklarativ über `AccessibilityWidgetConfig` vor dem Loader und imperativ über die `AccessibilityWidget`-Runtime-API nach dem Boot.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Das Widget funktioniert **ohne Konfiguration**. Optional steuert die Host-Seite es über zwei Kanäle:

1. **`window.AccessibilityWidgetConfig`** — deklarativ, **vor** dem Loader gesetzt, einmalig vor dem ersten Paint gelesen.
2. **`window.AccessibilityWidget`** — die imperative Runtime-API, verfügbar **nachdem** der Loader gebootet hat.

### Deklarative Config

```html
<script>
  window.AccessibilityWidgetConfig = {
    locale: 'de',
    primaryColor: '#0058a3',
    statementUrl: '/accessibility-statement',
    disabledFeatures: ['tts'],
    draggableFab: true,
    initialFeatures: { focusOutline: true },
  };
</script>
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

#### Meistgenutzte Felder

| Feld                             | Zweck                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `locale`                         | Initiale Locale (sonst automatisch erkannt). 28 Locales, RTL für ar/fa/ur/he |
| `primaryColor`                   | Akzentfarbe (FAB + Panel)                                                    |
| `corePath` / `cssPath`           | Core-/CSS-URLs — für **Self-Hosting** (siehe [usage.md](./usage.md))         |
| `coreIntegrity` / `cssIntegrity` | SRI-Hashes für Core/CSS (`sha384-…`)                                         |
| `statementUrl`                   | Link zu deiner Barrierefreiheitserklärung (im Panel-Footer gerendert)        |
| `disabledFeatures`               | Feature-IDs, die komplett aus dem Panel entfernt werden (z. B. `['tts']`)    |
| `initialFeatures`                | Features, die für Erstbesucher aktiviert sind                                |
| `draggableFab`                   | Erlaubt Usern, den FAB per Maus / Touch / Tastatur zu verschieben            |
| `keyboardShortcut`               | Toggle-Shortcut (Default `'ctrl+alt+a'`; `false` deaktiviert ihn)            |
| `storageKey`                     | localStorage-Key (konfigurierbar)                                            |
| `hidePoweredBy`                  | Blendet die "Powered by"-Zeile aus (White-Label)                             |
| `debug`                          | `console.warn` bei Validierungsproblemen                                     |

> **Vollständige Feld-für-Feld-Referenz** (jeder Typ, Default und jede Validierungsregel) liegt im Package-README: [`packages/widget/README.md`](../packages/widget/README.md#vollständige-config-referenz).

### Runtime-API

Nach dem Boot ist `window.AccessibilityWidget` verfügbar:

```js
await AccessibilityWidget.applyProfile('visionImpaired'); // eines von 6 Profil-Presets
await AccessibilityWidget.setLocale('ja'); // Sprache zur Laufzeit wechseln
AccessibilityWidget.setPosition({ x: 40, y: 200 }); // FAB positionieren
const unsubscribe = AccessibilityWidget.on('profileApplied', ({ profile }) => {
  analytics.track('a11y_profile', profile);
});
AccessibilityWidget.version; // der gebaute Versions-String
```

Events: `stateChange`, `open`, `close`, `profileApplied`, `localeChanged`, `reset` (zusätzlich als `document`-CustomEvents mit dem Namen `accessibility-widget:*` dispatcht). Die vollständige API mit Beispielen steht im [Package-README](../packages/widget/README.md#runtime-api).

### Sicherheit

Keine Konfiguration injiziert HTML: `statementUrl` lehnt `javascript:` / `data:`-Schemata ab und `disclaimer` ist reiner Text. Das Widget überschreibt niemals die ARIA-/DOM-Semantik der Host-Seite. Validiere und escape alle host-seitig gelieferten Werte, die du übergibst.
