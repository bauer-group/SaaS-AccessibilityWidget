# @bauer-group/accessibility-widget

> **BFSG · EN 301 549 · WCAG 2.2 AA** — lazy-loading, CDN-ready, zero-tracking Accessibility-Widget.
> Loader ~5.7 KB gzip, Core ~26 KB gzip (28 locales embedded). No cookies, no DOM/ARIA overrides of the host page.

Built by [BAUER GROUP](https://bauer-group.com) · AGPL-3.0-only or commercial ([LICENSING.md](./LICENSING.md))

[![npm version](https://img.shields.io/npm/v/@bauer-group/accessibility-widget?logo=npm&color=cb3837)](https://www.npmjs.com/package/@bauer-group/accessibility-widget)
[![license](https://img.shields.io/badge/license-AGPL--3.0--only%20or%20commercial-0058a3)](./LICENSING.md)
![loader size](https://img.shields.io/badge/loader-~5.7%20KB%20gzip-success)
![locales](https://img.shields.io/badge/locales-28-success)
![runtime deps](https://img.shields.io/badge/runtime%20deps-0-success)

📖 **[Documentation](./docs/)** &nbsp;·&nbsp; 🧩 **[Integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations)** (React, Vue, … · WordPress, Shopify, …)

---

## Why this widget

Most accessibility overlays in the wild either **pretend to fix** inaccessible sites (so called "snake oil", see the [overlay fact sheet](https://overlayfactsheet.com/)) or **mutate** the host's ARIA/semantics and break screen-reader workflows. This one does neither.

It gives **end users** a lightweight preferences panel — font size, contrast, reading helpers, TTS, structure navigation — without touching the host's DOM semantics. Preferences persist in `localStorage`, are applied **before first paint** on return visits, and can be fully controlled by the host via both a declarative config and a runtime API.

## At a glance

|                          |                                                                          |
| ------------------------ | ------------------------------------------------------------------------ |
| **Compliance targets**   | BFSG (§ 14 BAnfrE), EN 301 549 § 9.1–9.4, WCAG 2.2 AA                    |
| **Bundle sizes**         | Loader ~5.7 KB · Core ~26 KB · CSS ~3 KB (gzip)                          |
| **Locales**              | 28 — all languages with ≥ 8 M speakers + RTL support (ar, fa, ur, he)    |
| **Runtime dependencies** | 0                                                                        |
| **Tracking**             | none — no cookies, no network requests beyond core/CSS fetch             |
| **Persistence**          | localStorage only, single key (configurable)                             |
| **Framework wrappers**   | React, Vue, Angular, Svelte, Next.js, Nuxt, Astro — [separate repo][int] |
| **CMS/Shop plugins**     | WordPress, TYPO3, Drupal · Shopify, Shopware, Magento — [same repo][int] |

[int]: https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations

## 1-Line integration

```html
<!-- Latest within a major — auto-applies patch/minor updates (no SRI pin): -->
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

For production, **pin an immutable version** and verify it with Subresource Integrity:

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.3/accessibility-widget-loader.min.js"
  integrity="sha384-…"
  crossorigin="anonymous"
  defer
></script>
```

The immutable `…/<version>/…` paths never change (safe to pin SRI); the floating `…/v<major>/…` alias always serves the latest release in that major. SRI hashes for each release are published at `…/<version>/integrity.json`. For optional configuration (pre-selected locale, branding, feature-gating, statement URL, draggable FAB, …) see the [full config reference](./packages/widget/README.md#vollständige-config-referenz) in the widget package README.

## Documentation

In-depth guides live in [`docs/`](./docs/):

- [**Usage**](./docs/usage.md) — CDN (preferred) and npm / self-hosted
- [**Versioning**](./docs/versioning.md) — the immutable/floating CDN path scheme + SRI
- [**Configuration**](./docs/configuration.md) — `window.AccessibilityWidgetConfig` + the runtime API
- [**Authoring integrations**](./docs/authoring-integrations.md) — the contract for building a wrapper / plugin

## Repository layout

```text
packages/
  widget/          Core widget (loader + core IIFE bundles, types)
apps/
  demo/            Interactive demo + Scanner-Testziel (Vite)
docs/              Usage (CDN/npm), versioning, SRI, config, integration-authoring
```

This repo holds the **core + demo** (pnpm + Turbo). The framework wrappers and CMS/shop plugins live in a dedicated repository — **[bauer-group/SaaS-AccessibilityWidgetIntegrations][int]** — so each ecosystem keeps its own dependency tree and release cadence.

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

## Integrations

Ready-made wrappers and plugins live in **[bauer-group/SaaS-AccessibilityWidgetIntegrations][int]**:

- **JS frameworks** — React, Vue, Angular, Svelte, Next.js, Nuxt, Astro (published as `@bauer-group/accessibility-widget-<framework>`)
- **CMS** — WordPress, TYPO3, Drupal
- **Shops** — Shopify, Shopware, Magento

To build a new integration, see [docs/authoring-integrations.md](./docs/authoring-integrations.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup conventions, [CONTRIBUTIONS-WANTED.md](./CONTRIBUTIONS-WANTED.md) for concrete high-impact ways to help (native-speaker review of the 20 auto-translated locales, new framework/CMS integrations, refined accessibility profiles), and [TESTING.md](./TESTING.md) for the test strategy.

## Security

Report vulnerabilities via the process in [SECURITY.md](./SECURITY.md).

## License

`Accessibility Widget` is **dual-licensed**:

- **GNU AGPL-3.0-only** for open-source use — see [LICENSE](./LICENSE).
- **Commercial license** for use in closed/proprietary products or without the
  AGPL network-disclosure obligations — available at `info@bauer-group.com`.

Details: [LICENSING.md](./LICENSING.md). Contributions require a signed [CLA](./CLA.md).

> **No conformance guarantee:** this widget is a technical aid; it does not by
> itself establish legal conformance with the BFSG, EN 301 549 or WCAG 2.2.
