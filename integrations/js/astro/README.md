# @bauer-group/accessibility-widget-astro

```astro
---
import AccessibilityWidget from '@bauer-group/accessibility-widget-astro/src/AccessibilityWidget.astro';
---

<html lang="de">
  <body>
    <slot />
    <AccessibilityWidget
      loaderSrc="/accessibility-widget/accessibility-widget-loader.min.js"
      cssHref="/accessibility-widget/accessibility-widget.min.css"
      config={{ locale: 'auto' }}
    />
  </body>
</html>
```

Widget-Assets nach `public/accessibility-widget/*`.

MIT © BAUER GROUP
