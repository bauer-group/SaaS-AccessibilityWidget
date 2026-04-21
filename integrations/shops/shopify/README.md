# BFSG Widget — Shopify Theme Integration

## Einbindung als Theme-Block (Online Store 2.0)

1. Widget-Assets aus `packages/widget/dist/` nach `assets/` des Shopify Themes kopieren:
   - `bfsg-widget-loader.min.js`
   - `bfsg-widget-core.min.js`
   - `bfsg-widget.min.css`
2. Liquid-Dateien ins Theme einfügen:
   - `blocks/bfsg-widget.liquid` → `blocks/`
   - `snippets/bfsg-widget.liquid` → `snippets/`
3. Im Theme-Editor: Abschnitt → App-Block "BFSG Widget" hinzufügen.

## Einbindung per `theme.liquid` (klassisch)

```liquid
{% render 'bfsg-widget',
  position: 'bottom-right',
  locale: 'auto',
  primary_color: '#0058a3' %}
```

MIT © BAUER GROUP
