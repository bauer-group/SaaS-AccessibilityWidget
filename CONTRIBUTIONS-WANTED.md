# Wo Ihr Beitrag am meisten bewirkt

<a id="english"></a>

> The three areas where your real-world expertise (a11y testing, international legal contexts, real shop/CMS setups) makes the biggest difference.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

The widget has a solid technical foundation. In **three areas** your hands-on knowledge (a11y testing, international legal jurisdictions, real-world shop/CMS setups) makes the decisive difference.

---

## 🟢 Contribution 1 — Native review for new i18n locales or additional locales

**File**: `packages/widget/src/i18n/` (one file per locale, then import in `index.ts`)

**Currently supported** (28): `de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

**Where you have impact**:

1. **Native review** for the 20 most recently added locales. A11y terminology ("screen reader", "focus ring", "contrast mode", "reading mask", "structure navigation") has an established form in every language that only a native speaker with a11y experience reliably gets right. Patch PRs for individual strings are welcome.
2. **Further locales < 8 million speakers, a11y-relevant**: `da` (Danish), `fi` (Finnish), `nb` / `no` (Norwegian), `sk` (Slovak), `hr` (Croatian), `sr` (Serbian), `bg` (Bulgarian), `lt` (Lithuanian), `lv` (Latvian), `et` (Estonian), `sl` (Slovenian) — Northern and South-Eastern Europe.
3. **Further > 8 million speakers with special rendering requirements**: `ta` (Tamil), `te` (Telugu), `mr` (Marathi), `gu` (Gujarati), `pa` (Punjabi), `ms` (Malay), `ha` (Hausa), `yo` (Yoruba), `sw` (Swahili), `my` (Burmese), `am` (Amharic) — depending on script support, these need additional font-pipeline considerations.

**Effort**: ~30 minutes for a native review per locale, ~45 minutes for a new locale file (40 strings, 1:1 port from `de.ts` or `en.ts`).

**Template**:

```ts
// packages/widget/src/i18n/nl.ts
import type { Translation } from './types.js';

export const nl: Translation = {
  title: 'Toegankelijkheidsinstellingen',
  close: 'Sluiten',
  // … übersetzen Sie die Strings aus de.ts
};
```

Register in `i18n/index.ts`, test case in `test/i18n.test.ts`.

**Trade-offs**: The initial translations for the 20 new locales were created without native review — technical terms preserve meaning but are not guaranteed to be idiomatic. This is exactly where your contribution helps the most.

---

## 🟢 Contribution 2 — New framework/platform integration

**Repo**: [bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (`js/`, `cms/`, `shops/`) — guide in [docs/authoring-integrations.md](./docs/authoring-integrations.md)

**Currently present**:

- **JS frameworks** (7): React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
- **CMS** (3): WordPress, TYPO3, Drupal
- **Shops** (3): Shopify, Shopware, Magento

**Possible additions**:

| Target                                         | Why it makes sense                          | Effort                       |
| ---------------------------------------------- | ------------------------------------------- | ---------------------------- |
| **Remix** / **SolidStart** / **Qwik**          | Growing meta-frameworks                     | 30 min (template: React)     |
| **SvelteKit** (separate from Svelte)           | SSR routing differs                         | 30 min                       |
| **Laravel** Blade component                    | Largest PHP framework community             | 60 min (template: TYPO3-PHP) |
| **Symfony** Twig extension                     | Enterprise PHP                              | 60 min                       |
| **Rails** Engine / Hotwire Stimulus            | Rails community has an a11y gap             | 90 min                       |
| **Django** template tag                        | Python web dev, surprisingly large segment  | 60 min                       |
| **Hugo** / **Eleventy** / **Jekyll** shortcode | Static-site generators are often overlooked | 20 min                       |
| **Joomla** / **Craft CMS**                     | Traditional CMS niches                      | 60 min                       |

**Pattern** (JS): React/Vue are identical except for 20 lines — look at `js/react/src/AccessibilityWidget.tsx` in the [integrations repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) and port the pattern.

**Trade-offs**:

- Peer dependency vs. bundled: we peer the host framework deps (smaller bundle)
- SSR safety: the widget is client-side — always use `typeof window` guards

---

## 🟢 Contribution 3 — Refine accessibility profiles

**File**: `packages/widget/src/types/widget.ts` — the `PROFILES` object

There are currently 6 profiles: `visionImpaired`, `motor`, `cognitive`, `seizureSafe`, `adhd`, `blind`. Each is an **opinion**: which features get activated automatically + which levels are set?

**What you can bring**:

If you work daily with affected users (occupational therapy, support group, rehab clinic, association for the blind…), **you know better than we do** which feature combination really helps.

**Examples of open questions**:

- **`cognitive`**: Is `dyslexiaFont` (OpenDyslexic) really helpful, or does it create false expectations? Some studies say "no".
- **`adhd`**: `readingMask` (dimmed rest) — cure or crutch?
- **Missing a profile?** E.g. `lowVision` (separate from `blind`), `deafblind` (Braille-ready), `tremor` (larger click targets, not just `bigCursor`)

**Trade-off**: Every additional profile increases the cognitive load in the panel. The limit is ~8 profiles — beyond that it feels overloaded.

**Patch form**:

```ts
export const PROFILES: Record<ProfileId, ProfilePreset> = {
  // existierende …
  lowVision: {
    features: {
      fontSize: true,
      contrast: true,
      focusOutline: true,
      // TODO: Ihre Einschätzung — was noch?
    },
    fontSizeLevel: 1.6,
    contrastMode: 'high',
  },
};
```

Plus extend PROFILE_IDS in `widget.ts` and the translations in `i18n/*.ts`.

---

## How to contribute

1. Branch: `feat/i18n-<code>` or `feat/integration-<target>` or `feat/profile-<id>`
2. Add code, write tests/snapshot
3. Check the bundle-size budget (`pnpm --filter @bauer-group/accessibility-widget size`)
4. PR with brief context: **why** this locale/integration/profile?
5. On your first PR, sign the **[CLA](./CLA.md)** (the bot prompts automatically) — required because of the dual licensing (AGPL-3.0 / commercial).

Each of these contributions makes the widget better for real users — and that is exactly the difference between a "1-click compliance overlay" and a **real** accessibility tool.

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Die drei Stellen, an denen Ihr Praxis-Wissen (A11y-Testing, internationale Rechtsräume, realweltliche Shop/CMS-Setups) den entscheidenden Unterschied macht.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

Das Widget hat eine solide technische Basis. An **drei Stellen** macht Ihr Praxis-Wissen (A11y-Testing, internationale Rechtsräume, realweltliche Shop/CMS-Setups) den entscheidenden Unterschied.

---

### 🟢 Beitrag 1 — Native-Review für neue i18n-Locales oder zusätzliche Locales

**Datei**: `packages/widget/src/i18n/` (pro Locale eine Datei, dann Import in `index.ts`)

**Aktuell unterstützt** (28): `de`, `en`, `fr`, `es`, `it`, `pl`, `tr`, `ar`, `zh`, `hi`, `pt`, `bn`, `ru`, `ja`, `ko`, `vi`, `fa`, `ur`, `th`, `id`, `he`, `nl`, `sv`, `cs`, `el`, `hu`, `ro`, `uk`.

**Wo Sie Wirkung haben**:

1. **Native-Review** für die 20 zuletzt hinzugefügten Locales. A11y-Fachterminologie („Screenreader", „Fokusrahmen", „Kontrastmodus", „Lesemaske", „Strukturnavigation") hat in jeder Sprache eine etablierte Form, die nur ein Muttersprachler mit A11y-Erfahrung sicher trifft. Patch-PRs für einzelne Strings sind willkommen.
2. **Weitere Locales < 8 Mio Sprecher, A11y-relevant**: `da` (Dänisch), `fi` (Finnisch), `nb` / `no` (Norwegisch), `sk` (Slowakisch), `hr` (Kroatisch), `sr` (Serbisch), `bg` (Bulgarisch), `lt` (Litauisch), `lv` (Lettisch), `et` (Estnisch), `sl` (Slowenisch) — Nordeuropa und Südosteuropa.
3. **Weitere > 8 Mio Sprecher mit speziellen Rendering-Anforderungen**: `ta` (Tamil), `te` (Telugu), `mr` (Marathi), `gu` (Gujarati), `pa` (Punjabi), `ms` (Malay), `ha` (Hausa), `yo` (Yoruba), `sw` (Swahili), `my` (Burmesisch), `am` (Amharisch) — brauchen je nach Script-Unterstützung zusätzliche Font-Pipeline-Überlegungen.

**Aufwand**: ~30 Minuten für native Review je Locale, ~45 Minuten für eine neue Locale-Datei (40 Strings, 1:1 Port von `de.ts` oder `en.ts`).

**Template**:

```ts
// packages/widget/src/i18n/nl.ts
import type { Translation } from './types.js';

export const nl: Translation = {
  title: 'Toegankelijkheidsinstellingen',
  close: 'Sluiten',
  // … übersetzen Sie die Strings aus de.ts
};
```

Registrieren in `i18n/index.ts`, Test-Case in `test/i18n.test.ts`.

**Trade-offs**: Die initialen Translations für die 20 neuen Locales entstanden ohne Native-Review — Fachtermini sind sinnerhaltend, aber nicht garantiert idiomatisch. Genau hier hilft Ihr Beitrag am meisten.

---

### 🟢 Beitrag 2 — Neues Framework-/Plattform-Integration

**Repo**: [bauer-group/SaaS-AccessibilityWidgetIntegrations](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) (`js/`, `cms/`, `shops/`) — Anleitung in [docs/authoring-integrations.md](./docs/authoring-integrations.md)

**Aktuell vorhanden**:

- **JS-Frameworks** (7): React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
- **CMS** (3): WordPress, TYPO3, Drupal
- **Shops** (3): Shopify, Shopware, Magento

**Mögliche Ergänzungen**:

| Target                                         | Warum sinnvoll                             | Aufwand                     |
| ---------------------------------------------- | ------------------------------------------ | --------------------------- |
| **Remix** / **SolidStart** / **Qwik**          | Wachsende Meta-Frameworks                  | 30 min (Vorlage: React)     |
| **SvelteKit** (separate von Svelte)            | SSR-Routing unterscheidet sich             | 30 min                      |
| **Laravel** Blade-Component                    | Größte PHP-Framework-Community             | 60 min (Vorlage: TYPO3-PHP) |
| **Symfony** Twig-Extension                     | Enterprise-PHP                             | 60 min                      |
| **Rails** Engine / Hotwire Stimulus            | Rails-Community hat A11y-Lücke             | 90 min                      |
| **Django** Template-Tag                        | Python-Webdev, überraschend großes Segment | 60 min                      |
| **Hugo** / **Eleventy** / **Jekyll** Shortcode | Static-Site-Generators sind oft übersehen  | 20 min                      |
| **Joomla** / **Craft CMS**                     | Traditionelle CMS-Nischen                  | 60 min                      |

**Muster** (JS): React/Vue sind identisch bis auf 20 Zeilen — schauen Sie `js/react/src/AccessibilityWidget.tsx` im [Integrations-Repo](https://github.com/bauer-group/SaaS-AccessibilityWidgetIntegrations) an und portieren Sie das Pattern.

**Trade-offs**:

- Peer-Dependency vs. gebündelt: Wir peeren die Host-Framework-Deps (kleiner Bundle)
- SSR-Safety: Das Widget ist clientseitig — immer `typeof window`-Guards nutzen

---

### 🟢 Beitrag 3 — Accessibility-Profiles verfeinern

**Datei**: `packages/widget/src/types/widget.ts` — `PROFILES`-Objekt

Aktuell gibt es 6 Profile: `visionImpaired`, `motor`, `cognitive`, `seizureSafe`, `adhd`, `blind`. Jedes ist eine **Meinung**: welche Features werden automatisch aktiviert + welche Level gesetzt?

**Was Sie mitbringen können**:

Wenn Sie täglich mit betroffenen Nutzer:innen arbeiten (Ergotherapie, Selbsthilfegruppe, Rehaklinik, Blindenbund…), **wissen Sie besser als wir**, welche Feature-Kombination wirklich hilft.

**Beispiele für offene Fragen**:

- **`cognitive`**: Ist `dyslexiaFont` (OpenDyslexic) wirklich hilfreich, oder schafft es False-Expectations? Manche Studien sagen "nein".
- **`adhd`**: `readingMask` (abgeblendeter Rest) — Heilung oder Krücke?
- **Fehlt ein Profil?** Z. B. `lowVision` (getrennt von `blind`), `deafblind` (Braille-ready), `tremor` (größere Click-Targets, nicht nur `bigCursor`)

**Trade-off**: Jedes zusätzliche Profil erhöht die kognitive Last im Panel. Die Grenze ist ~8 Profile — darüber wirkt es überladen.

**Patch-Form**:

```ts
export const PROFILES: Record<ProfileId, ProfilePreset> = {
  // existierende …
  lowVision: {
    features: {
      fontSize: true,
      contrast: true,
      focusOutline: true,
      // TODO: Ihre Einschätzung — was noch?
    },
    fontSizeLevel: 1.6,
    contrastMode: 'high',
  },
};
```

Plus PROFILE_IDS in `widget.ts` erweitern und Übersetzungen in `i18n/*.ts`.

---

### So tragen Sie bei

1. Branch: `feat/i18n-<code>` oder `feat/integration-<target>` oder `feat/profile-<id>`
2. Code ergänzen, Tests/Snapshot schreiben
3. Bundle-Size-Budget prüfen (`pnpm --filter @bauer-group/accessibility-widget size`)
4. PR mit kurzem Kontext: **Warum** diese Locale/Integration/dieses Profil?
5. Beim ersten PR das **[CLA](./CLA.md)** signieren (der Bot fordert automatisch auf) — nötig wegen der Dual-Lizenzierung (AGPL-3.0 / kommerziell).

Jeder dieser Beiträge macht das Widget für reale Nutzer:innen besser — und genau das ist der Unterschied zwischen "1-Klick-Compliance-Overlay" und **echtem** Accessibility-Tool.
