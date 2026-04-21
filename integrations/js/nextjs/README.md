# @bauer-group/accessibility-widget-nextjs

Next.js App-Router Wrapper mit `'use client'` direktive.

```tsx
// app/layout.tsx
import { AccessibilityWidgetClient } from '@bauer-group/accessibility-widget-nextjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <AccessibilityWidgetClient
          loaderSrc="/accessibility-widget/accessibility-widget-loader.min.js"
          cssHref="/accessibility-widget/accessibility-widget.min.css"
          config={{ locale: 'auto' }}
        />
      </body>
    </html>
  );
}
```

Widget-Assets nach `public/accessibility-widget/*` kopieren.

MIT © BAUER GROUP
