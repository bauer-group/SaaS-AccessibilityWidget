# @bauer-group/accessibility-widget

> BFSG / EN 301 549 / WCAG 2.2 AA Accessibility Widget — lazy-loading, CDN-ready, zero-tracking.
> Loader ~4 KB gzip, Core ~10 KB gzip. No cookies, no DOM/ARIA overrides.

Built by [BAUER GROUP](https://bauer-group.com) · MIT License

---

## Repository layout

```text
packages/
  widget/                 Core widget (loader + core IIFE bundles, types)
apps/
  demo/                   Interactive demo site (Vite)
integrations/
  js/                     React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
  cms/                    WordPress, TYPO3, Drupal
  shops/                  Shopify, Shopware, Magento
```

The **`packages/` + `apps/`** workspaces are managed by pnpm + Turbo. The **`integrations/`** folder is intentionally **outside the workspace** — each integration is a standalone publishable artifact with its own dependency tree and release cadence.

## Quick start

```bash
pnpm install
pnpm build              # builds widget + demo
pnpm demo:dev           # open http://localhost:5173
```

## Embedding

```html
<script
  src="https://cdn.example.com/accessibility-widget/accessibility-widget-loader.min.js"
  defer
></script>
```

That is all. The loader lazily fetches the core + stylesheet on first interaction.

For framework-specific wrappers, see [`integrations/`](./integrations/).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup + conventions, [CONTRIBUTIONS-WANTED.md](./CONTRIBUTIONS-WANTED.md) for concrete high-impact ways to help (new i18n locales, new framework/CMS integrations, better accessibility profiles), and [TESTING.md](./TESTING.md) for the current test strategy and known gaps.

## Security

Please report vulnerabilities via the process in [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).
