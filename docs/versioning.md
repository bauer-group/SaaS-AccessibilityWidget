# Versioning & the CDN path scheme

## SemVer via semantic-release

The core is versioned **automatically**: every merge to `main` runs through [semantic-release](https://semantic-release.gitbook.io/), which derives the next [SemVer](https://semver.org/) version from the [Conventional Commits](https://www.conventionalcommits.org/) since the last release:

| Commit type                                           | Bump           | Example       |
| ----------------------------------------------------- | -------------- | ------------- |
| `fix:` / `perf:`                                      | **patch**      | 1.0.3 → 1.0.4 |
| `feat:`                                               | **minor**      | 1.0.3 → 1.1.0 |
| `feat!:` / `BREAKING CHANGE:`                         | **major**      | 1.0.3 → 2.0.0 |
| `docs:` / `chore:` / `refactor:` / `test:` / `style:` | — (no release) |               |

The same version is published to **npm** and deployed to the **CDN** — the npm version and the CDN path always carry the identical version number.

## The dual CDN path scheme

Every release is published under **two** roots:

| Path          | Example                          | Cache-Control                            | Purpose                                                |
| ------------- | -------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| **Immutable** | `…/accessibility-widget/1.0.3/…` | `public, max-age=31536000, immutable`    | **SRI-pinnable**, never changes                        |
| **Floating**  | `…/accessibility-widget/v1/…`    | `public, max-age=300, s-maxage=31536000` | auto patch/minor within the major; purged each release |

- **Immutable** `…/<x.y.z>/…` — content is frozen for that version. Safe to pin with SRI. Never overwritten or purged.
- **Floating** `…/v<major>/…` — always points at the newest release of that major. Exactly this URL is invalidated in the CDN cache on each release. **Do not** pin it with SRI (its content changes).

### Which URL for what?

| Goal                                         | URL         | SRI?                             |
| -------------------------------------------- | ----------- | -------------------------------- |
| Stay current (patches applied automatically) | `…/v1/…`    | no                               |
| Reproducible + tamper-evident                | `…/1.0.3/…` | **yes** (required in production) |

## SRI (Subresource Integrity)

Each release carries an `integrity.json` next to the bundles:

```
https://widgets.professional-hosting.com/accessibility-widget/1.0.3/integrity.json
```

```json
{
  "version": "1.0.3",
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
