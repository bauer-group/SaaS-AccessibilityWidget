# @bauer-group/accessibility-widget-astro

```astro
---
import BFSGWidget from '@bauer-group/accessibility-widget-astro/src/BFSGWidget.astro';
---

<html lang="de">
  <body>
    <slot />
    <BFSGWidget
      loaderSrc="/bfsg-widget/bfsg-widget-loader.min.js"
      cssHref="/bfsg-widget/bfsg-widget.min.css"
      config={{ locale: 'auto' }}
    />
  </body>
</html>
```

Widget-Assets nach `public/bfsg-widget/*`.

MIT © BAUER GROUP
