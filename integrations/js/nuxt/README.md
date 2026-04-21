# @bauer-group/accessibility-widget-nuxt

Nuxt 3 Client-Plugin.

1. Widget-Assets nach `public/bfsg-widget/*` kopieren.
2. Plugin-Datei kopieren:

```bash
cp node_modules/@bauer-group/accessibility-widget-nuxt/src/plugin.client.ts plugins/bfsg-widget.client.ts
```

3. In `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      bfsgWidget: {
        loaderSrc: '/bfsg-widget/bfsg-widget-loader.min.js',
        config: { locale: 'auto' },
      },
    },
  },
});
```

MIT © BAUER GROUP
