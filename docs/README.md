# Accessibility Widget — Documentation

<a id="english"></a>

> Documentation for integrators embedding the widget and for authors building wrappers / plugins.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

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

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Dokumentation für Integratoren, die das Widget einbinden, und für Autoren, die Wrapper / Plugins bauen.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Diese Dokumentation richtet sich an zwei Zielgruppen:

- **Integratoren** — Websites, die das Widget einbinden.
- **Integrations-Autoren** — Teammitglieder, die Wrapper/Plugins im [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) bauen.

Das **Core-Widget** (`@bauer-group/accessibility-widget`) ist ein Lazy-Loading-Accessibility-Widget mit dem Ziel **BFSG · EN 301 549 · WCAG 2.2 AA** — ein winziger Loader plus ein On-Demand-Core, 28 Locales, null Runtime-Dependencies, kein Tracking und **kein** DOM-/ARIA-Override der Host-Seite.

### Inhalt

| Dokument                                                 | Was es abdeckt                                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| [usage.md](./usage.md)                                   | Einbinden des Widgets — **CDN (bevorzugt)** oder npm / Self-Hosted   |
| [versioning.md](./versioning.md)                         | Versionierung, das Schema unveränderlicher/gleitender CDN-Pfade, SRI |
| [configuration.md](./configuration.md)                   | `window.AccessibilityWidgetConfig` + die Runtime-API                 |
| [authoring-integrations.md](./authoring-integrations.md) | Bau einer **neuen** Integration (Wrapper / Plugin)                   |
| [npm-publishing.md](./npm-publishing.md)                 | (Maintainer) wie der Core auf npm veröffentlicht wird                |

### Die zwei Integrationswege auf einen Blick

1. **CDN (bevorzugt)** — ein `<script defer>`, das auf den gehosteten Loader zeigt. Kein Build-Schritt, automatische Patch/Minor-Updates über den gleitenden Alias, optionales SRI-Pinning.
2. **npm / Self-Hosted** — `@bauer-group/accessibility-widget` installieren und die `dist/`-Bundles selbst ausliefern. Für Build-Pipelines mit eigenem Asset-Hosting oder eine strikte CSP, die externe Scripts verbietet.

> **Faustregel:** für die meisten Seiten das CDN nutzen; npm / Self-Hosting nur, wenn externe Scripts unzulässig sind oder Assets vom eigenen Origin kommen müssen.

### CDN-Host

```
https://widgets.professional-hosting.com/accessibility-widget/…
```

### Integrationen

Fertige Framework-/CMS-/Shop-Integrationen liegen in einem **separaten Repository**: [bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations). Um eine zu bauen, mit [authoring-integrations.md](./authoring-integrations.md) starten.
