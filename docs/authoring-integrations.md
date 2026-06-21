# Building an integration

<a id="english"></a>

> The contract between the core and an integration — a thin wrapper that sets config, injects the loader idempotently, and imports types only.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

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

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Der Vertrag zwischen Core und Integration — ein dünner Wrapper, der die Config setzt, den Loader idempotent injiziert und ausschließlich Typen importiert.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Integrationen (Framework-Wrapper, CMS-/Shop-Plugins) liegen im **[Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations)**. Dieses Dokument definiert den **Vertrag** zwischen Core und Integration, damit sich jede neue Integration konsistent verhält.

### Das Prinzip: ein dünner Wrapper, kein Re-Bundling

Eine Integration **bündelt das Widget nicht neu**. Sie tut genau drei Dinge:

1. Setzt `window.AccessibilityWidgetConfig` **vor** dem Lauf des Loaders.
2. Injiziert das Loader-`<script>` (CDN, bevorzugt) — idempotent.
3. Injiziert optional das CSS-`<link>` (oder setzt `cssPath`).

Zur Laufzeit holt der Loader Core + CSS selbst. Die Integration importiert **nur Typen** aus dem Core (`import type`), niemals Runtime-Code — die npm-Abhängigkeit ist also ein Build-Time-Typ-Provider, keine Runtime-Abhängigkeit.

### Default-URL: immer die immutable, SRI-gepinnte Version

Plugins sollten standardmäßig eine **immutable** Version + SRI nutzen (nicht das floating `v1`), damit die ausgelieferte SRI stets zu dem passt, was geladen wird:

```
https://widgets.professional-hosting.com/accessibility-widget/<version>/accessibility-widget-loader.min.js
```

Den passenden Loader-Hash aus `…/<version>/integrity.json` nehmen. Siehe [versioning.md](./versioning.md) und [usage.md](./usage.md).

### Idempotenz & SSR

- **Idempotent injizieren:** vor dem Einfügen prüfen, ob Loader/CSS bereits existieren (Marker-Attribute `data-aw-loader` / `data-aw-css`). Mehrfaches Mounten von Komponenten darf nicht doppelt laden.
- **SSR-sicher:** immer mit `typeof window !== 'undefined'` absichern; das Widget ist client-only.
- **Config mergen ohne Überschreiben:** eine bestehende `window.AccessibilityWidgetConfig` respektieren statt sie zu überschreiben.

### Referenz-Implementierungen

Die sieben JS-Wrapper im Integrations-Repo sind das kanonische Muster — React und Vue sind bis auf ~20 Zeilen identisch:

- [`js/react/src/AccessibilityWidget.tsx`](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations/blob/main/js/react/src/AccessibilityWidget.tsx)
- CMS-/Shop-Plugins (PHP/Liquid): `cms/*`, `shops/*` — `window.AccessibilityWidgetConfig` serverseitig setzen und die zwei Tags rendern.

### Checkliste für eine neue Integration

- [ ] Lädt den Loader via CDN (immutable + SRI als Default), idempotent.
- [ ] Setzt `window.AccessibilityWidgetConfig` vor dem Loader, ohne eine bestehende Config zu überschreiben.
- [ ] `import type` nur aus dem Core; hängt von `@bauer-group/accessibility-widget` (dev/peer) bei `>=` dem aktuellen Major ab.
- [ ] SSR-Guards (`typeof window`).
- [ ] Ein Smoke-Test (Inject-Idempotenz, Config-Merge, SRI-Propagierung) — siehe `js/react/test/`.
- [ ] Ein eigenes README mit Verwendungsbeispiel.
- [ ] CLA unterzeichnet (Dual-Lizenz).
