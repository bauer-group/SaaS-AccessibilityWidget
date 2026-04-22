# Wo Ihr Beitrag am meisten bewirkt

Das Widget hat eine solide technische Basis. An **drei Stellen** macht Ihr Praxis-Wissen (A11y-Testing, internationale Rechtsräume, realweltliche Shop/CMS-Setups) den entscheidenden Unterschied.

---

## 🟢 Beitrag 1 — Native-Review für neue i18n-Locales oder zusätzliche Locales

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

## 🟢 Beitrag 2 — Neues Framework-/Plattform-Integration

**Verzeichnis**: `integrations/js/` oder `integrations/cms/` oder `integrations/shops/`

**Aktuell vorhanden**:
- **JS-Frameworks** (7): React, Vue, Angular, Svelte, Next.js, Nuxt, Astro
- **CMS** (3): WordPress, TYPO3, Drupal
- **Shops** (3): Shopify, Shopware, Magento

**Mögliche Ergänzungen**:

| Target | Warum sinnvoll | Aufwand |
|---|---|---|
| **Remix** / **SolidStart** / **Qwik** | Wachsende Meta-Frameworks | 30 min (Vorlage: React) |
| **SvelteKit** (separate von Svelte) | SSR-Routing unterscheidet sich | 30 min |
| **Laravel** Blade-Component | Größte PHP-Framework-Community | 60 min (Vorlage: TYPO3-PHP) |
| **Symfony** Twig-Extension | Enterprise-PHP | 60 min |
| **Rails** Engine / Hotwire Stimulus | Rails-Community hat A11y-Lücke | 90 min |
| **Django** Template-Tag | Python-Webdev, überraschend großes Segment | 60 min |
| **Hugo** / **Eleventy** / **Jekyll** Shortcode | Static-Site-Generators sind oft übersehen | 20 min |
| **Joomla** / **Craft CMS** | Traditionelle CMS-Nischen | 60 min |

**Muster** (JS): React/Vue sind identisch bis auf 20 Zeilen — schauen Sie `integrations/js/react/src/AccessibilityWidget.tsx` an und portieren Sie das Pattern.

**Trade-offs**:
- Peer-Dependency vs. gebündelt: Wir peeren die Host-Framework-Deps (kleiner Bundle)
- SSR-Safety: Das Widget ist clientseitig — immer `typeof window`-Guards nutzen

---

## 🟢 Beitrag 3 — Accessibility-Profiles verfeinern

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

## So tragen Sie bei

1. Branch: `feat/i18n-<code>` oder `feat/integration-<target>` oder `feat/profile-<id>`
2. Code ergänzen, Tests/Snapshot schreiben
3. Bundle-Size-Budget prüfen (`pnpm --filter @bauer-group/accessibility-widget size`)
4. PR mit kurzem Kontext: **Warum** diese Locale/Integration/dieses Profil?

Jeder dieser Beiträge macht das Widget für reale Nutzer:innen besser — und genau das ist der Unterschied zwischen "1-Klick-Compliance-Overlay" und **echtem** Accessibility-Tool.
