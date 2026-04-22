# Accessibility Widget — Integrationen

Framework- und CMS-spezifische Wrapper. Alle verwenden den gleichen Loader-Mechanismus (`loader.min.js` + optional SRI) und setzen vor dem Loader `window.AccessibilityWidgetConfig`.

## JS/TS Frameworks (pnpm workspace `integrations/js/*`)

| Paket | Framework | Status |
|---|---|---|
| [`@bauer-group/accessibility-widget-react`](./js/react/) | React 19 | ✅ |
| [`@bauer-group/accessibility-widget-vue`](./js/vue/) | Vue 3 | ✅ |
| [`@bauer-group/accessibility-widget-angular`](./js/angular/) | Angular 19 | ✅ |
| [`@bauer-group/accessibility-widget-svelte`](./js/svelte/) | Svelte 5 | ✅ |
| [`@bauer-group/accessibility-widget-nextjs`](./js/nextjs/) | Next.js App Router | ✅ |
| [`@bauer-group/accessibility-widget-nuxt`](./js/nuxt/) | Nuxt 3 | ✅ |
| [`@bauer-group/accessibility-widget-astro`](./js/astro/) | Astro | ✅ |

## CMS & Shops (nicht Teil des npm-Workspaces)

| Ordner | System | Sprache |
|---|---|---|
| [`cms/wordpress`](./cms/wordpress/) | WordPress 6.x | PHP |
| [`cms/typo3`](./cms/typo3/) | TYPO3 13 | PHP |
| [`cms/drupal`](./cms/drupal/) | Drupal 11 | PHP |
| [`shops/shopify`](./shops/shopify/) | Shopify Liquid Theme | Liquid |
| [`shops/shopware`](./shops/shopware/) | Shopware 6 | PHP |
| [`shops/magento`](./shops/magento/) | Magento 2.4 | PHP |

## Gemeinsame Konfiguration

Jede Integration akzeptiert einen `config`-Payload, der 1:1 auf `window.AccessibilityWidgetConfig` abgebildet wird. Details siehe `packages/widget/README.md`.
