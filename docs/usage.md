# Embedding the widget

There are two ways to add the widget to a page. **The CDN is the preferred path.**

## 1. CDN (preferred)

### Quick start — one line

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

The `v<major>` alias always serves the latest release of that major (automatic patch/minor updates). The lightweight loader detects the language, renders the floating action button (FAB) in the bottom-right corner, and lazy-loads the core + CSS only when the user opens the panel.

### Production — pin an immutable version + SRI

For production, **pin an immutable version** and protect it with Subresource Integrity:

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.3/accessibility-widget-loader.min.js"
  integrity="sha384-…"
  crossorigin="anonymous"
  defer
></script>
```

Per-release SRI hashes live next to the bundles at `…/<version>/integrity.json`. **Important:** only pin SRI against an **immutable** `…/<version>/…` URL — see [versioning.md](./versioning.md).

> The loader fetches the core + CSS from the **same** `…/<version>/…` directory it was loaded from, so a pinned loader implies pinned core/CSS. You can additionally pin the core and CSS with `coreIntegrity` / `cssIntegrity` (see [configuration.md](./configuration.md)).

## 2. npm / self-hosted

For build pipelines with their own asset hosting, or a strict CSP that forbids external scripts:

```bash
pnpm add @bauer-group/accessibility-widget
```

The package ships the prebuilt bundles under `dist/` plus TypeScript types:

| Export                                              | File                                      |
| --------------------------------------------------- | ----------------------------------------- |
| `@bauer-group/accessibility-widget` (and `/loader`) | `dist/accessibility-widget-loader.min.js` |
| `@bauer-group/accessibility-widget/core`            | `dist/accessibility-widget-core.min.js`   |
| `@bauer-group/accessibility-widget/styles`          | `dist/accessibility-widget.min.css`       |

Copy the three bundles into a statically served folder (e.g. `public/accessibility-widget/`), load the loader via a script tag, and point the core/CSS paths at your origin:

```html
<script>
  window.AccessibilityWidgetConfig = {
    corePath: '/assets/accessibility-widget-core.min.js',
    cssPath: '/assets/accessibility-widget.min.css',
  };
</script>
<script src="/assets/accessibility-widget-loader.min.js" defer></script>
```

> `import '@bauer-group/accessibility-widget'` pulls in the loader IIFE, but in most setups **copying the `dist/` files** into your public folder via a build step is the more robust path, because the loader resolves core/CSS by URL at runtime.

See [configuration.md](./configuration.md) for every option.
