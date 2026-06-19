# @bauer-group/accessibility-widget

> **BFSG · EN 301 549 · WCAG 2.2 AA** — lazy-loading, CDN-ready, zero-tracking Accessibility-Widget.
> Loader ≤ 5.5 KB gzip, Core ≤ 30 KB gzip (28 Locales embedded). No cookies, no DOM/ARIA overrides of the host page.

Built by [BAUER GROUP](https://bauer-group.com) · MIT License

---

## Why this widget

Most accessibility overlays in the wild either **pretend to fix** inaccessible sites (so called "snake oil", see the [overlay fact sheet](https://overlayfactsheet.com/)) or **mutate** the host's ARIA/semantics and break screen-reader workflows. This one does neither.

It gives **end users** a lightweight preferences panel — font size, contrast, reading helpers, TTS, structure navigation — without touching the host's DOM semantics. Preferences persist in `localStorage`, are applied **before first paint** on return visits, and can be fully controlled by the host via both a declarative config and a runtime API.

## At a glance

| | |
|---|---|
| **Compliance targets** | BFSG (§ 14 BAnfrE), EN 301 549 § 9.1–9.4, WCAG 2.2 AA |
| **Bundle sizes** | Loader 5.5 KB gzip · Core 30 KB gzip · CSS 3 KB gzip |
| **Locales** | 28 — all languages with ≥ 8 M speakers + RTL support (ar, fa, ur, he) |
| **Runtime dependencies** | 0 |
| **Tracking** | none — no cookies, no network requests beyond core/CSS fetch |
| **Persistence** | localStorage only, single key (configurable) |
| **Framework wrappers** | React, Vue, Angular, Svelte, Next.js, Nuxt, Astro |
| **CMS/Shop plugins** | WordPress, TYPO3, Drupal · Shopify, Shopware, Magento |

## 1-Line integration

```html
<!-- Latest within a major — auto-applies patch/minor updates (no SRI pin): -->
<script src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js" defer></script>
```

For production, **pin an immutable version** and verify it with Subresource Integrity:

```html
<script src="https://widgets.professional-hosting.com/accessibility-widget/1.0.0/accessibility-widget-loader.min.js"
        integrity="sha384-…" crossorigin="anonymous" defer></script>
```

The immutable `…/<version>/…` paths never change (safe to pin SRI); the floating `…/v<major>/…` alias always serves the latest release in that major. SRI hashes for each release are published at `…/<version>/integrity.json`. For optional configuration (pre-selected locale, branding, feature-gating, statement URL, draggable FAB, …) see the [full config reference](./packages/widget/README.md#vollständige-config-referenz) in the widget package README.

## Repository layout

```text
packages/
  widget/          Core widget (loader + core IIFE bundles, types, docs)
apps/
  demo/            Interactive demo + Scanner-Testziel (Vite)
integrations/
  js/              React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
  cms/             WordPress, TYPO3, Drupal (PHP)
  shops/           Shopify, Shopware, Magento (Liquid / PHP / XML)
```

`packages/` + `apps/` are managed by pnpm + Turbo. `integrations/` is intentionally **outside the workspace** — each integration is a standalone publishable artifact with its own dependency tree and release cadence.

## Quick start

```bash
pnpm install
pnpm demo:dev           # builds widget, then parallel watch + demo on http://localhost:5173
```

The demo doubles as:
- **showcase** — interactive playground for every feature, runtime API method, and profile preset,
- **scanner target** — intentionally contains WCAG violations for `axe-core` / `pa11y` / Playwright-AxE verification.

## Runtime control

Hosts get both a declarative config (set before loader boot) and an imperative API (available after loader boot):

```js
// Config — declarative, read once before first paint
window.AccessibilityWidgetConfig = {
  locale: 'de',
  primaryColor: '#0058a3',
  statementUrl: '/barrierefreiheit',
  disabledFeatures: ['tts'],
  draggableFab: true,
  initialFeatures: { focusOutline: true },
};

// API — imperative, after the script has loaded
await AccessibilityWidget.applyProfile('visionImpaired');
await AccessibilityWidget.setLocale('ja');
AccessibilityWidget.setPosition({ x: 40, y: 200 });
AccessibilityWidget.on('profileApplied', ({ profile }) => analytics.track('a11y', profile));
```

Full reference: [`packages/widget/README.md`](./packages/widget/README.md).

## Framework integrations

| Framework | Package | Status |
|---|---|---|
| React (≥ 18) | `@bauer-group/accessibility-widget-react` | ✅ smoke-tests |
| Vue (≥ 3.3) | `@bauer-group/accessibility-widget-vue` | ✅ |
| Angular (≥ 19) | `@bauer-group/accessibility-widget-angular` | ✅ |
| Svelte (≥ 5) | `@bauer-group/accessibility-widget-svelte` | ✅ |
| Next.js App Router | `@bauer-group/accessibility-widget-nextjs` | ✅ |
| Nuxt 3 | `@bauer-group/accessibility-widget-nuxt` | ✅ |
| Astro (≥ 5) | `@bauer-group/accessibility-widget-astro` | ✅ |
| WordPress (6.5+) | `integrations/cms/wordpress/accessibility-widget/` | ✅ |
| TYPO3 (13) | `integrations/cms/typo3/accessibility_widget/` | ✅ |
| Drupal (10/11) | `integrations/cms/drupal/accessibility_widget/` | ✅ |
| Shopify (OS 2.0) | `integrations/shops/shopify/` | ✅ |
| Shopware (6.6+) | `integrations/shops/shopware/AccessibilityWidget/` | ✅ |
| Magento (2.4+) | `integrations/shops/magento/BauerGroup_AccessibilityWidget/` | ✅ |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup conventions, [CONTRIBUTIONS-WANTED.md](./CONTRIBUTIONS-WANTED.md) for concrete high-impact ways to help (native-speaker review of the 20 auto-translated locales, new framework/CMS integrations, refined accessibility profiles), and [TESTING.md](./TESTING.md) for the test strategy.

## Security

Report vulnerabilities via the process in [SECURITY.md](./SECURITY.md).

## License

MIT — see [LICENSE](./LICENSE).
