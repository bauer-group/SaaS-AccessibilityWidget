# Building an integration

Integrations (framework wrappers, CMS/shop plugins) live in the **[integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations)**. This document defines the **contract** between the core and an integration, so every new integration behaves consistently.

## The principle: a thin wrapper, no re-bundling

An integration **does not re-bundle** the widget. It does exactly three things:

1. Sets `window.AccessibilityWidgetConfig` **before** the loader runs.
2. Injects the loader `<script>` (CDN, preferred) — idempotently.
3. Optionally injects the CSS `<link>` (or sets `cssPath`).

At runtime the loader fetches the core + CSS itself. The integration imports **types only** from the core (`import type`), never runtime code — so the npm dependency is a build-time type provider, not a runtime dependency.

## Default URL: always the immutable, SRI-pinned version

Plugins should default to an **immutable** version + SRI (not the floating `v1`), so the SRI they ship always matches what they load:

```
https://widgets.professional-hosting.com/accessibility-widget/<version>/accessibility-widget-loader.min.js
```

Take the matching loader hash from `…/<version>/integrity.json`. See [versioning.md](./versioning.md) and [usage.md](./usage.md).

## Idempotency & SSR

- **Inject idempotently:** before inserting, check whether the loader/CSS already exist (marker attributes `data-aw-loader` / `data-aw-css`). Multiple component mounts must not load it twice.
- **SSR-safe:** always guard with `typeof window !== 'undefined'`; the widget is client-only.
- **Merge config without clobbering:** respect an existing `window.AccessibilityWidgetConfig` instead of overwriting it.

## Reference implementations

The seven JS wrappers in the integrations repo are the canonical pattern — React and Vue are identical bar ~20 lines:

- [`js/react/src/AccessibilityWidget.tsx`](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations/blob/main/js/react/src/AccessibilityWidget.tsx)
- CMS/shop plugins (PHP/Liquid): `cms/*`, `shops/*` — set `window.AccessibilityWidgetConfig` server-side and render the two tags.

## Checklist for a new integration

- [ ] Loads the loader via CDN (immutable + SRI by default), idempotently.
- [ ] Sets `window.AccessibilityWidgetConfig` before the loader, without overwriting an existing config.
- [ ] `import type` only from the core; depends on `@bauer-group/accessibility-widget` (dev/peer) at `>=` the current major.
- [ ] SSR guards (`typeof window`).
- [ ] A smoke test (inject idempotency, config merge, SRI propagation) — see `js/react/test/`.
- [ ] Its own README with a usage example.
- [ ] CLA signed (dual license).
