# Configuration & runtime API

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
