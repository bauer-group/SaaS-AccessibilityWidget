# @bauer-group/bfsg-demo

> Interaktive Demo-Seite. Zeigt das Widget in Aktion und dient als **Scanner-Testziel**.

## Entwicklung

```bash
# In einem Terminal:
pnpm --filter @bauer-group/bfsg-widget build
pnpm --filter @bauer-group/bfsg-demo dev
```

Vite erwartet die Widget-Dateien unter `/bfsg-widget/*`. Das `scripts/copy-widget.ts` kopiert sie aus `packages/widget/dist` beim Build; für `dev` liegen sie als `public/bfsg-widget/*` (manuell einmal kopieren oder symlinken).

## Scanner gegen die Demo laufen lassen

```bash
pnpm --filter @bauer-group/bfsg-demo build
pnpm --filter @bauer-group/bfsg-demo preview &
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
