# @bauer-group/accessibility-widget-react

React 19 Wrapper für das BFSG Accessibility Widget.

## Installation

```bash
npm install @bauer-group/accessibility-widget-react
```

Und die Widget-Assets (`accessibility-widget-loader.min.js`, `accessibility-widget-core.min.js`, `accessibility-widget.min.css`) unter `/public/accessibility-widget/` ablegen.

## Nutzung

```tsx
import { AccessibilityWidget, openAccessibilityWidget } from '@bauer-group/accessibility-widget-react';

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

## Lizenz

MIT © BAUER GROUP
