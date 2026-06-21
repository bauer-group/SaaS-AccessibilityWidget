# Versioning & the CDN path scheme

<a id="english"></a>

> How releases are versioned via semantic-release and served through the dual immutable / floating CDN path scheme.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

## SemVer via semantic-release

The core is versioned **automatically**: every merge to `main` runs through [semantic-release](https://semantic-release.gitbook.io/), which derives the next [SemVer](https://semver.org/) version from the [Conventional Commits](https://www.conventionalcommits.org/) since the last release:

| Commit type                                           | Bump           | Example       |
| ----------------------------------------------------- | -------------- | ------------- |
| `fix:` / `perf:`                                      | **patch**      | 1.0.5 → 1.0.6 |
| `feat:`                                               | **minor**      | 1.0.5 → 1.1.0 |
| `feat!:` / `BREAKING CHANGE:`                         | **major**      | 1.0.5 → 2.0.0 |
| `docs:` / `chore:` / `refactor:` / `test:` / `style:` | — (no release) |               |

The same version is published to **npm** and deployed to the **CDN** — the npm version and the CDN path always carry the identical version number.

## The dual CDN path scheme

Every release is published under **two** roots:

| Path          | Example                          | Cache-Control                            | Purpose                                                |
| ------------- | -------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| **Immutable** | `…/accessibility-widget/1.0.5/…` | `public, max-age=31536000, immutable`    | **SRI-pinnable**, never changes                        |
| **Floating**  | `…/accessibility-widget/v1/…`    | `public, max-age=300, s-maxage=31536000` | auto patch/minor within the major; purged each release |

- **Immutable** `…/<x.y.z>/…` — content is frozen for that version. Safe to pin with SRI. Never overwritten or purged.
- **Floating** `…/v<major>/…` — always points at the newest release of that major. Exactly this URL is invalidated in the CDN cache on each release. **Do not** pin it with SRI (its content changes).

### Which URL for what?

| Goal                                         | URL         | SRI?                             |
| -------------------------------------------- | ----------- | -------------------------------- |
| Stay current (patches applied automatically) | `…/v1/…`    | no                               |
| Reproducible + tamper-evident                | `…/1.0.5/…` | **yes** (required in production) |

## SRI (Subresource Integrity)

Each release carries an `integrity.json` next to the bundles:

```
https://widgets.professional-hosting.com/accessibility-widget/1.0.5/integrity.json
```

```json
{
  "version": "1.0.5",
  "algorithm": "sha384",
  "files": {
    "accessibility-widget-loader.min.js": "sha384-…",
    "accessibility-widget-core.min.js": "sha384-…",
    "accessibility-widget.min.css": "sha384-…"
  }
}
```

**Rule:** only set SRI hashes against the immutable `…/<version>/…` URL. The loader hash goes into the `<script integrity>` attribute; the core and CSS hashes go (optionally) into `coreIntegrity` / `cssIntegrity` in the config (see [configuration.md](./configuration.md)). A hash pinned against the floating `v1` URL would break on the next patch.

## Upgrades

- Pinned to `v1` → nothing to do; patches/minors arrive automatically.
- Pinned to an immutable version → bump the URL **and** the SRI hashes to the new version (hashes from its `integrity.json`).
- Major change (`v1` → `v2`) → migrate deliberately; breaking changes are listed in the [CHANGELOG](../CHANGELOG.md).

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Wie Releases per semantic-release versioniert und über das duale CDN-Pfadschema (immutable / floating) ausgeliefert werden.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

### SemVer via semantic-release

Der Core wird **automatisch** versioniert: Jeder Merge nach `main` läuft durch [semantic-release](https://semantic-release.gitbook.io/), das die nächste [SemVer](https://semver.org/)-Version aus den [Conventional Commits](https://www.conventionalcommits.org/) seit dem letzten Release ableitet:

| Commit-Typ                                            | Bump             | Beispiel      |
| ----------------------------------------------------- | ---------------- | ------------- |
| `fix:` / `perf:`                                      | **Patch**        | 1.0.5 → 1.0.6 |
| `feat:`                                               | **Minor**        | 1.0.5 → 1.1.0 |
| `feat!:` / `BREAKING CHANGE:`                         | **Major**        | 1.0.5 → 2.0.0 |
| `docs:` / `chore:` / `refactor:` / `test:` / `style:` | — (kein Release) |               |

Dieselbe Version wird auf **npm** veröffentlicht und auf das **CDN** deployt — die npm-Version und der CDN-Pfad tragen stets dieselbe Versionsnummer.

### Das duale CDN-Pfadschema

Jedes Release wird unter **zwei** Roots veröffentlicht:

| Pfad          | Beispiel                         | Cache-Control                            | Zweck                                                       |
| ------------- | -------------------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| **Immutable** | `…/accessibility-widget/1.0.5/…` | `public, max-age=31536000, immutable`    | **SRI-pinnbar**, ändert sich nie                            |
| **Floating**  | `…/accessibility-widget/v1/…`    | `public, max-age=300, s-maxage=31536000` | autom. Patch/Minor innerhalb des Majors; je Release gepurgt |

- **Immutable** `…/<x.y.z>/…` — der Inhalt ist für diese Version eingefroren. Sicher per SRI pinnbar. Wird nie überschrieben oder gepurgt.
- **Floating** `…/v<major>/…` — zeigt stets auf das neueste Release dieses Majors. Genau diese URL wird bei jedem Release im CDN-Cache invalidiert. **Nicht** per SRI pinnen (ihr Inhalt ändert sich).

#### Welche URL wofür?

| Ziel                                             | URL         | SRI?                                |
| ------------------------------------------------ | ----------- | ----------------------------------- |
| Aktuell bleiben (Patches automatisch angewendet) | `…/v1/…`    | nein                                |
| Reproduzierbar + manipulationssicher             | `…/1.0.5/…` | **ja** (in Produktion erforderlich) |

### SRI (Subresource Integrity)

Jedes Release trägt eine `integrity.json` neben den Bundles:

```
https://widgets.professional-hosting.com/accessibility-widget/1.0.5/integrity.json
```

```json
{
  "version": "1.0.5",
  "algorithm": "sha384",
  "files": {
    "accessibility-widget-loader.min.js": "sha384-…",
    "accessibility-widget-core.min.js": "sha384-…",
    "accessibility-widget.min.css": "sha384-…"
  }
}
```

**Regel:** SRI-Hashes nur gegen die immutable `…/<version>/…`-URL setzen. Der Loader-Hash gehört in das `<script integrity>`-Attribut; die Core- und CSS-Hashes gehen (optional) in `coreIntegrity` / `cssIntegrity` in der Config (siehe [configuration.md](./configuration.md)). Ein gegen die floating `v1`-URL gepinnter Hash würde beim nächsten Patch brechen.

### Upgrades

- Auf `v1` gepinnt → nichts zu tun; Patches/Minors kommen automatisch.
- Auf eine immutable Version gepinnt → die URL **und** die SRI-Hashes auf die neue Version anheben (Hashes aus deren `integrity.json`).
- Major-Wechsel (`v1` → `v2`) → bewusst migrieren; Breaking Changes sind im [CHANGELOG](../CHANGELOG.md) gelistet.
