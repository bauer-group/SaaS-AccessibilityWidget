# npm Publishing

## What ships to npm

Exactly **one** package: **`@bauer-group/accessibility-widget`** (`packages/widget`).
The monorepo root (`@bauer-group/accessibility-widget-workspace`) and the demo are
`"private": true` and are **never** published — the root carries the CDN/deploy
tooling (it ships the widget to Cloudflare R2 instead). The seven framework
wrappers move to a dedicated integrations repo and publish from there.

## Auth model

| When              | Mechanism                          | Secret/Token                   |
| ----------------- | ---------------------------------- | ------------------------------ |
| **First publish** | local `npm publish` (interactive)  | your npm login (2FA / passkey) |
| **Every release** | CI via **OIDC Trusted Publishing** | none (OIDC `id-token`)         |

> **Why the first publish is manual:** npm Trusted Publishing can only publish a
> package that **already exists** on the registry, and its "Trusted Publisher"
> settings page only appears once the package is listed. So the very first
> publish lists the package once, locally. The version doesn't matter — real
> versions follow via OIDC (semantic-release's first release is `1.0.0`).

## 1. First-time bootstrap (one-time, local)

```bash
npm login                                   # browser auth (2FA / passkey)
pnpm publish:bootstrap -- --package @bauer-group/accessibility-widget
```

`publish:bootstrap` ([scripts/publish-bootstrap.mjs](../scripts/publish-bootstrap.mjs))
builds the package with pnpm and runs `npm publish` (you complete 2FA in the
browser). It publishes the current placeholder version by default; pass
`--version x.y.z` to pin a first version (reverted afterwards so the committed
version stays the CI-managed placeholder). The script is reusable for any future
workspace package.

## 2. Configure the Trusted Publisher (npmjs.com)

Open the package page → **Settings → Trusted Publisher** → add a GitHub Actions
publisher:

- **Repository:** `bauer-group/SaaS-AccessibilityWidget`
- **Workflow filename:** `nodejs-release.yml`
- **Environment:** _(leave empty)_

## 3. Ongoing releases (automatic, no token)

Every semantic-release version bump runs the `publish-npm` job in
[`.github/workflows/nodejs-release.yml`](../.github/workflows/nodejs-release.yml):

```yaml
permissions:
  id-token: write # OIDC trusted publishing + provenance
...
run: npm publish --provenance --access public # no NODE_AUTH_TOKEN — OIDC
```

The job is `continue-on-error`, so an npm hiccup never blocks the CDN deploy
(`deploy-cdn.yml` keys off this workflow's success). To cut a release manually:
**Actions → 🚀 Release & NPM Publish → Run workflow** (`force-release: true`).

## Stumbling blocks

- **The package must exist** before Trusted Publishing is configurable → hence the
  one-time local bootstrap.
- **`id-token: write`** is mandatory (OIDC + provenance).
- **Re-running the old failed publish job doesn't help** — it uses the workflow
  state from back then. After registering the Trusted Publisher, trigger a **new**
  release (e.g. `workflow_dispatch` with `force-release`).
- **Omit `publishConfig.registry`** — `setup-node`'s `registry-url` routes the
  publish; a hard-coded registry would override it.
- The placeholder version can be deprecated once a real version is `latest`:
  ```bash
  npm deprecate @bauer-group/accessibility-widget@0.1.0 "placeholder — use the latest version"
  ```
