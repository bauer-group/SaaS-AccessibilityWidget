# @bauer-group/accessibility-widget-react

React Wrapper für das BAUER GROUP Accessibility Widget (BFSG / EN 301 549 / WCAG 2.2 AA).

## Installation

```bash
npm install @bauer-group/accessibility-widget-react
```

Und die Widget-Assets (`accessibility-widget-loader.min.js`, `accessibility-widget-core.min.js`, `accessibility-widget.min.css`) unter `/public/accessibility-widget/` ablegen.

## Nutzung

```tsx
import {
  AccessibilityWidget,
  openAccessibilityWidget,
} from '@bauer-group/accessibility-widget-react';

export function App() {
  return (
    <>
      <AccessibilityWidget
        loaderSrc="/accessibility-widget/accessibility-widget-loader.min.js"
        cssHref="/accessibility-widget/accessibility-widget.min.css"
        config={{ position: 'bottom-right', locale: 'auto', primaryColor: '#0058a3' }}
        sri={{
          loader: 'sha384-…', // aus dist/integrity.txt
          core: 'sha384-…',
          css: 'sha384-…',
        }}
      />
      <button onClick={() => openAccessibilityWidget()}>Barrierefreiheit</button>
    </>
  );
}
```

## Entwicklung

Dieses Paket ist **nicht** Teil des pnpm-Root-Workspace. Dependencies werden direkt im Paketordner installiert:

```bash
cd integrations/js/react
pnpm install
pnpm build
pnpm test
```

Smoke-Tests (Vitest + happy-dom) in [`test/AccessibilityWidget.test.tsx`](./test/AccessibilityWidget.test.tsx) dienen als Referenz-Pattern für weitere Integrationen (Vue, Svelte, Angular, …) — das Dedupe-Muster (`data-aw-loader`, `data-aw-css`) ist identisch.

## Lizenz

MIT © BAUER GROUP
