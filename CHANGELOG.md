## [1.0.5](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v1.0.4...v1.0.5) (2026-06-21)

### 🐛 Bug Fixes

* **license:** corrected stale MIT notices to AGPL ([b85f99c](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/b85f99cb8b3e703a72adb7845a62ad50c22928dc))

## [1.0.4](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v1.0.3...v1.0.4) (2026-06-20)

### ♻️ Refactoring

* **repo:** split integrations into a dedicated repo ([9fe8fd0](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/9fe8fd014570deed6e6279629e5180c08e284292))

## [1.0.3](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v1.0.2...v1.0.3) (2026-06-20)

### ⚖️ License

* **Relicensed from MIT to GNU AGPL-3.0-only (dual-licensed).** Open-source use under the [GNU AGPL-3.0](./LICENSE); a separate commercial license is available via `info@bauer-group.com` (see [LICENSING.md](./LICENSING.md)). Contributions now require a signed [CLA](./CLA.md). No runtime or behavior change.

## [1.0.2](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v1.0.1...v1.0.2) (2026-06-20)

_Wartungs-Release (erzwungen) — keine Code-Änderungen._

## [1.0.1](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v1.0.0...v1.0.1) (2026-06-20)

### 🐛 Bug Fixes

* **ci:** dropped --provenance (private repo) ([cfba96a](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/cfba96afd2cbc5dbc42e7bc364bacb1ca7c5c51d))

## [1.0.0](https://github.com/bauer-group/SaaS-AccessibilityWidget/compare/v0.0.0...v1.0.0) (2026-06-20)

### ⚠ BREAKING CHANGES

* **widget:** replaced BFSG-referencing disclaimer with configurable footer
* **widget:** changed default keyboard shortcut to Ctrl+Alt+A
* **workspace:** Integration-Pakete müssen ab jetzt eigenständig
installiert werden (cd integrations/js/<name> && pnpm install). Konsumenten
aus dem Registry sind nicht betroffen — @bauer-group/accessibility-widget
wird über Caret-Version referenziert statt workspace:*.
* **naming:** renamed all BFSG identifiers to AccessibilityWidget

### 🚀 Features

* **cdn:** added R2 hosting and release pipeline ([980a3dc](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/980a3dc7a36d75f43c1fc8c368461d2b7a99b6ec))
* **demo:** professionalized landing page + live-dev middleware + build pipeline ([d5ea796](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d5ea796a4b7dfd6abff6a4a9e682b78a54fc5315))
* **demo:** runtime-API showcase — profile quick-actions, API explorer, event stream ([04fb6bd](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/04fb6bd727f13f23a451a2d7106e7c66717c2af5))
* **i18n:** added 20 new locales (>=8M speakers) + RTL helpers ([79301dd](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/79301dda14a8ef78b6f215e4a83230a97db8708a))
* **monorepo:** scaffolded accessibility widget repository ([08c6b19](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/08c6b1973fd8a74206852c61a3762e0a75e15281))
* **pages:** added GitHub Pages demo deployment ([ac007ef](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/ac007ef999348c857a6d4eec6b823c164797834c))
* **widget:** changed default keyboard shortcut to Ctrl+Alt+A ([12ebb65](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/12ebb651c583bd9e0f32334f463bd1400af31147))
* **widget:** made the FAB keyboard shortcut configurable + disableable ([8468ea1](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/8468ea18d68944d750ebf11d49116a3257c8dd50))
* **widget:** modernized panel with icons + drag ([bd7a4a6](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/bd7a4a6f09dc4d425fa1c4f1671ae698691efbd8))
* **widget:** opened external statementUrl links in a new tab ([05c832a](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/05c832aaf5650a02691c8d5386c020992ae172e9))
* **widget:** opt-in draggable FAB with state-persisted position ([a5a13d1](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/a5a13d1e1048958bd9ce8fcc945c828c7cec38f8))
* **widget:** professional WidgetConfig API with validation + 6 new fields ([fea54ff](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/fea54fff3f130b2ade2b9c23367acf3d733000b1))
* **widget:** replaced BFSG-referencing disclaimer with configurable footer ([eba657f](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/eba657f0a4f3c175897f936c918bb5ed71829370))
* **widget:** runtime API — applyProfile, setLocale, setPosition, events ([77fdfef](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/77fdfef53fca44b248d5ad15e8be8114c566c1d1))
* **widget:** set runtime version from the build ([4834641](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/4834641737157a3d2fdb8f2364542d6164cfb03c))

### 🐛 Bug Fixes

* **ci:** fixed pnpm setup in CI workflows ([2f04660](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/2f0466032670f6caaf860efe47dc0b708a791456))
* **ci:** pinned pnpm, dropped packageManager field ([d5e6d0d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d5e6d0d5ad9815025f77e5aa875b365ec9006ea2))
* **ci:** self-hosted build/test for pnpm+turbo ([59c3bd3](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/59c3bd386dac27a8843c3fe87230bc09ae8f9381))
* **ci:** used the shared nodejs-build reusable (pnpm) ([861797d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/861797d3078b21a711a8458f3cc32040dedb8c78))
* **integrations:** completed BFSG→AccessibilityWidget rename ([80946eb](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/80946ebca4fecd95d1b9d9cab7e0241fea4b37fd))
* **scripts:** fixed bootstrap spawn on Windows ([907e8fa](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/907e8fa997c42d90aa9243fe152d58a8e5e02026))
* **scripts:** handled pnpm's literal -- separator ([0ee6b9e](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/0ee6b9e30330419b4f7c45e2f953154ce2d2a01e))
* updated author email format across multiple package and composer files ([46772bc](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/46772bcd8b1897ec3d44ad72e2f9938bb52de670))
* **widget:** addressed panel drag, tooltip, FAB toggle, locale persistence ([d43a39e](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/d43a39e9c0470dafbba9e3ce9c4b3d1f616b46c9))
* **widget:** aligned Powered-by link domain ([cb334d9](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/cb334d928ad482f87dfd9316b597b3147ee65c1e))
* **widget:** extended LOCALE_TO_BCP47 map to all 28 supported locales ([7bad014](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/7bad014e31a9b9d4a255496025274d9353f7b39f))
* **widget:** stopped edge-column tooltips from overflowing + triggering jump ([112fd6a](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/112fd6ac5a93a280d74a0c5eae4c31d380f80d24))
* **widget:** surfaced silent-fail catches + fixed state.test happy-dom ([5ba57d7](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/5ba57d7e356340640d38e19f68c508fa646b3ce4))

### ⏪ Reverts

* kept the SaaS-AccessibilityWidget repo URL ([a03051b](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/a03051b348aedafc6ea72cef3ac1911d8caee325))

### ♻️ Refactoring

* **monorepo:** decoupled integrations from core dev/release path ([918e6bf](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/918e6bf3382454a41d679234916ac3b3f4482eb1))
* **naming:** renamed all BFSG identifiers to AccessibilityWidget ([ebbd608](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/ebbd608ae251dc77443564bb33095ea60a8ca4e0))
* **naming:** renamed npm packages bfsg-widget to accessibility-widget ([990b32d](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/990b32de3eab4b54d8259b246117108bfae565d5))
* **workspace:** detached integrations from pnpm workspace ([69f23b6](https://github.com/bauer-group/SaaS-AccessibilityWidget/commit/69f23b62dca2b6cba3ff154f14e97a06f82e3ba1))

# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert. Das Format basiert auf [Conventional Commits](https://www.conventionalcommits.org/); die Einträge ab v1.0.0 werden automatisch von [semantic-release](https://semantic-release.gitbook.io/) gepflegt, die Versionierung folgt [SemVer](https://semver.org/lang/de/).
