# Accessibility Widget — Magento 2 Module

```bash
composer require bauer-group/accessibility-widget-magento
bin/magento module:enable BauerGroup_AccessibilityWidget
bin/magento setup:upgrade
bin/magento setup:static-content:deploy
```

Widget-Assets aus `packages/widget/dist/` nach `view/frontend/web/` kopieren (`accessibility-widget-loader.min.js`, `accessibility-widget-core.min.js`, `accessibility-widget.min.css`).

Konfiguration: Stores → Configuration → (benutzerdefiniert: `accessibility_widget/settings/*`).

MIT © BAUER GROUP
