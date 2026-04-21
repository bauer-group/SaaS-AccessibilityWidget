# @bauer-group/bfsg-widget-react

React 19 Wrapper für das BFSG Accessibility Widget.

## Installation

```bash
npm install @bauer-group/bfsg-widget-react
```

Und die Widget-Assets (`bfsg-widget-loader.min.js`, `bfsg-widget-core.min.js`, `bfsg-widget.min.css`) unter `/public/bfsg-widget/` ablegen.

## Nutzung

```tsx
import { BFSGWidget, openBFSGWidget } from '@bauer-group/bfsg-widget-react';

export function App() {
  return (
    <>
      <BFSGWidget
        loaderSrc="/bfsg-widget/bfsg-widget-loader.min.js"
        cssHref="/bfsg-widget/bfsg-widget.min.css"
        config={{ position: 'bottom-right', locale: 'auto', primaryColor: '#0058a3' }}
        sri={{
          loader: 'sha384-…', // aus dist/integrity.txt
          core: 'sha384-…',
          css: 'sha384-…',
        }}
      />
      <button onClick={() => openBFSGWidget()}>Barrierefreiheit</button>
    </>
  );
}
```

## Lizenz

MIT © BAUER GROUP
