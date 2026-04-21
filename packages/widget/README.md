# @bauer-group/accessibility-widget

> Lazy-loading Accessibility-Widget nach **BFSG / EN 301 549 / WCAG 2.2 AA**.
> Loader ≤ 5 KB gzip, Core ≤ 12 KB gzip. Kein Tracking, kein Cookie, kein DOM-/ARIA-Override.

## 1-Line-Integration

```html
<script src="https://cdn.bauer-group.com/accessibility-widget/v1/accessibility-widget-loader.min.js" defer></script>
```

## Mit Konfiguration

```html
<script>
  window.AccessibilityWidgetConfig = {
    corePath: '/static/accessibility-widget-core.min.js',
    cssPath: '/static/accessibility-widget.min.css',
    position: 'bottom-right', // bottom-right | bottom-left | top-right | top-left
    locale: 'auto',           // auto | de | en | fr | es | it | pl | tr | ar
    primaryColor: '#0058a3',
    hideOnPrint: true,
    respectReducedMotion: true,
    coreIntegrity: 'sha384-…', // optional SRI (see dist/integrity.txt)
  };
</script>
<script src="/static/accessibility-widget-loader.min.js" defer></script>
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

## API

```js
window.AccessibilityWidget.open();            // Panel öffnen
window.AccessibilityWidget.close();           // schließen
window.AccessibilityWidget.reset();           // alle Einstellungen zurücksetzen + reload
window.AccessibilityWidget.set('fontSize', true);
window.AccessibilityWidget.getState();        // aktueller persistenter State
```

## Architektur

- `loader.ts` — IIFE, ~4 KB gzip, injiziert Critical-CSS, rendert FAB, lädt Core bei Klick
- `core.ts` — Panel-UI, Features, Focus-Trap, TTS; erst on-demand geladen
- `state.ts` — localStorage-Persistenz
- `features/*` — 1 Datei pro Feature, tree-shakeable
- `panel/panel.ts` — reine DOM-Komposition, keine Framework-Dep

Siehe auch [ADR-0003: Kein DOM-/ARIA-Override](../../docs/adr/0003-widget-no-dom-aria-mutation.md).

## Entwicklung

```bash
pnpm install
pnpm --filter @bauer-group/accessibility-widget build    # baut dist/
pnpm --filter @bauer-group/accessibility-widget size     # prüft Bundle-Budget
pnpm --filter @bauer-group/accessibility-widget test     # Vitest
```

## Lizenz

MIT © BAUER GROUP
