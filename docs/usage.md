# Embedding the widget

<a id="english"></a>

> Two ways to add the widget to a page — CDN (preferred) or npm / self-hosted.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

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
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.5/accessibility-widget-loader.min.js"
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

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Zwei Wege, das Widget in eine Seite einzubinden — CDN (bevorzugt) oder npm / Self-Hosted.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Es gibt zwei Wege, das Widget in eine Seite einzubinden. **Das CDN ist der bevorzugte Weg.**

### 1. CDN (bevorzugt)

#### Quick Start — eine Zeile

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/v1/accessibility-widget-loader.min.js"
  defer
></script>
```

Der `v<major>`-Alias liefert stets das neueste Release dieses Majors (automatische Patch/Minor-Updates). Der leichtgewichtige Loader erkennt die Sprache, rendert den Floating Action Button (FAB) unten rechts und lädt Core + CSS erst per Lazy-Load, wenn der User das Panel öffnet.

#### Produktion — unveränderliche Version pinnen + SRI

Für Produktion eine **unveränderliche Version pinnen** und mit Subresource Integrity schützen:

```html
<script
  src="https://widgets.professional-hosting.com/accessibility-widget/1.0.5/accessibility-widget-loader.min.js"
  integrity="sha384-…"
  crossorigin="anonymous"
  defer
></script>
```

SRI-Hashes je Release liegen neben den Bundles unter `…/<version>/integrity.json`. **Wichtig:** SRI nur gegen eine **unveränderliche** `…/<version>/…`-URL pinnen — siehe [versioning.md](./versioning.md).

> Der Loader holt Core + CSS aus **demselben** `…/<version>/…`-Verzeichnis, aus dem er geladen wurde, sodass ein gepinnter Loader gepinntes Core/CSS impliziert. Zusätzlich kannst du Core und CSS mit `coreIntegrity` / `cssIntegrity` pinnen (siehe [configuration.md](./configuration.md)).

### 2. npm / Self-Hosted

Für Build-Pipelines mit eigenem Asset-Hosting oder eine strikte CSP, die externe Scripts verbietet:

```bash
pnpm add @bauer-group/accessibility-widget
```

Das Paket liefert die vorgebauten Bundles unter `dist/` plus TypeScript-Typen:

| Export                                              | Datei                                     |
| --------------------------------------------------- | ----------------------------------------- |
| `@bauer-group/accessibility-widget` (und `/loader`) | `dist/accessibility-widget-loader.min.js` |
| `@bauer-group/accessibility-widget/core`            | `dist/accessibility-widget-core.min.js`   |
| `@bauer-group/accessibility-widget/styles`          | `dist/accessibility-widget.min.css`       |

Kopiere die drei Bundles in einen statisch ausgelieferten Ordner (z. B. `public/accessibility-widget/`), lade den Loader per Script-Tag und richte die Core-/CSS-Pfade auf deinen Origin:

```html
<script>
  window.AccessibilityWidgetConfig = {
    corePath: '/assets/accessibility-widget-core.min.js',
    cssPath: '/assets/accessibility-widget.min.css',
  };
</script>
<script src="/assets/accessibility-widget-loader.min.js" defer></script>
```

> `import '@bauer-group/accessibility-widget'` zieht den Loader-IIFE herein, aber in den meisten Setups ist das **Kopieren der `dist/`-Dateien** in deinen Public-Ordner per Build-Schritt der robustere Weg, weil der Loader Core/CSS zur Laufzeit per URL auflöst.

Siehe [configuration.md](./configuration.md) für jede Option.
