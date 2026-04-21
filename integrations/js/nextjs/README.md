# @bauer-group/bfsg-widget-nextjs

Next.js App-Router Wrapper mit `'use client'` direktive.

```tsx
// app/layout.tsx
import { BFSGWidgetClient } from '@bauer-group/bfsg-widget-nextjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <BFSGWidgetClient
          loaderSrc="/bfsg-widget/bfsg-widget-loader.min.js"
          cssHref="/bfsg-widget/bfsg-widget.min.css"
          config={{ locale: 'auto' }}
        />
      </body>
    </html>
  );
}
```

Widget-Assets nach `public/bfsg-widget/*` kopieren.

MIT © BAUER GROUP
