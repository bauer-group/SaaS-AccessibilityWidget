# BFSG Widget — Magento 2 Module

```bash
composer require bauer-group/bfsg-widget-magento
bin/magento module:enable BauerGroup_BFSGWidget
bin/magento setup:upgrade
bin/magento setup:static-content:deploy
```

Widget-Assets aus `packages/widget/dist/` nach `view/frontend/web/` kopieren (`bfsg-widget-loader.min.js`, `bfsg-widget-core.min.js`, `bfsg-widget.min.css`).

Konfiguration: Stores → Configuration → (benutzerdefiniert: `bfsg_widget/settings/*`).

MIT © BAUER GROUP
