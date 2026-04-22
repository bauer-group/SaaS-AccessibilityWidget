# Accessibility Widget — Shopify Theme Integration

## Einbindung als Theme-Block (Online Store 2.0)

1. Widget-Assets aus `packages/widget/dist/` nach `assets/` des Shopify Themes kopieren:
   - `accessibility-widget-loader.min.js`
   - `accessibility-widget-core.min.js`
   - `accessibility-widget.min.css`
2. Liquid-Dateien ins Theme einfügen:
   - `blocks/accessibility-widget.liquid` → `blocks/`
   - `snippets/accessibility-widget.liquid` → `snippets/`
3. Im Theme-Editor: Abschnitt → App-Block "Accessibility Widget" hinzufügen.

## Einbindung per `theme.liquid` (klassisch)

```liquid
{% render 'accessibility-widget',
  position: 'bottom-right',
  locale: 'auto',
  primary_color: '#0058a3' %}
```

MIT © BAUER GROUP
