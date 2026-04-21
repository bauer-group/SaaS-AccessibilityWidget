# @bauer-group/accessibility-widget-demo

> Interaktive Demo-Seite. Zeigt das Widget in Aktion und dient als **Scanner-Testziel**.

## Entwicklung

```bash
# In einem Terminal:
pnpm --filter @bauer-group/accessibility-widget build
pnpm --filter @bauer-group/accessibility-widget-demo dev
```

Vite erwartet die Widget-Dateien unter `/accessibility-widget/*`. Das `scripts/copy-widget.ts` kopiert sie aus `packages/widget/dist` beim Build; für `dev` liegen sie als `public/accessibility-widget/*` (manuell einmal kopieren oder symlinken).

## Scanner gegen die Demo laufen lassen

```bash
pnpm --filter @bauer-group/accessibility-widget-demo build
pnpm --filter @bauer-group/accessibility-widget-demo preview &
pnpm scanner:cli scan http://localhost:4173 --format html --out self-audit.html
```

Die Demo hat **bewusst** einige Barrieren:
- `img` ohne `alt`
- Link-Text "hier klicken"
- Button mit Kontrast < 4.5:1
- Formular-Input ohne Label

Die BFSG-Custom-Checks (Barrierefreiheitserklärung-Link, Feedback-Mail, Impressum ohne JS) sind **bestanden** — die Seite zeigt beides: Violations + Pass.

## Lizenz

MIT © BAUER GROUP
