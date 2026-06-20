# Accessibility Widget — Documentation

This documentation is for two audiences:

- **Integrators** — websites embedding the widget.
- **Integration authors** — team members building wrappers/plugins in the [integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations).

The **core widget** (`@bauer-group/accessibility-widget`) is a lazy-loading accessibility widget targeting **BFSG · EN 301 549 · WCAG 2.2 AA** — a tiny loader plus an on-demand core, 28 locales, zero runtime dependencies, no tracking, and **no** DOM/ARIA overrides of the host page.

## Contents

| Document                                                 | What it covers                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [usage.md](./usage.md)                                   | Embedding the widget — **CDN (preferred)** or npm / self-hosted |
| [versioning.md](./versioning.md)                         | Versioning, the immutable/floating CDN path scheme, SRI         |
| [configuration.md](./configuration.md)                   | `window.AccessibilityWidgetConfig` + the runtime API            |
| [authoring-integrations.md](./authoring-integrations.md) | Building a **new** integration (wrapper / plugin)               |
| [npm-publishing.md](./npm-publishing.md)                 | (Maintainers) how the core is published to npm                  |

## The two integration paths at a glance

1. **CDN (preferred)** — one `<script defer>` pointing at the hosted loader. No build step, automatic patch/minor updates via the floating alias, optional SRI pinning.
2. **npm / self-hosted** — install `@bauer-group/accessibility-widget` and serve the `dist/` bundles yourself. For build pipelines with their own asset hosting or a strict CSP that forbids external scripts.

> **Rule of thumb:** use the CDN for most sites; use npm / self-hosting only when external scripts are disallowed or assets must come from your own origin.

## CDN host

```
https://widgets.professional-hosting.com/accessibility-widget/…
```

## Integrations

Ready-made framework / CMS / shop integrations live in a **separate repository**: [bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations). To build one, start with [authoring-integrations.md](./authoring-integrations.md).
