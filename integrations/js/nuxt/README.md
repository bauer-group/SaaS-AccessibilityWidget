# @bauer-group/accessibility-widget-nuxt

Nuxt 3 Client-Plugin.

1. Widget-Assets nach `public/accessibility-widget/*` kopieren.
2. Plugin-Datei kopieren:

```bash
cp node_modules/@bauer-group/accessibility-widget-nuxt/src/plugin.client.ts plugins/accessibility-widget.client.ts
```

3. In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      bfsgWidget: {
        loaderSrc: '/accessibility-widget/accessibility-widget-loader.min.js',
        config: { locale: 'auto' },
      },
    },
  },
});
```

MIT © BAUER GROUP
