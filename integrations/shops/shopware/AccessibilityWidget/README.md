# Accessibility Widget — Shopware 6 Plugin

```bash
composer require bauer-group/accessibility-widget-shopware
bin/console plugin:refresh
bin/console plugin:install --activate AccessibilityWidget
bin/console assets:install
```

Widget-Assets aus `packages/widget/dist/` nach `src/Resources/public/` kopieren. Nach `bin/console assets:install` liegen sie unter `/bundles/accessibilitywidget/*`.

Konfiguration: Plugin-Einstellungen im Shopware-Admin.

MIT © BAUER GROUP
