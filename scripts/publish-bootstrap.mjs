// Bootstrap a workspace package's FIRST publish to npm — locally.
//
// Why local: npm Trusted Publishing (OIDC, used by the release workflow) can
// only publish a package that already EXISTS on the registry. So the very
// first publish has to list the package once — done by a maintainer locally
// (interactive 2FA / passkey). The version is irrelevant for this step; after
// the package is listed, configure its Trusted Publisher on npmjs and every
// further release publishes from CI via OIDC — no token, no local publish.
//
// Usage (from the repo root):
//   pnpm publish:bootstrap -- --package <name> [--version <x.y.z>] [--tag latest]
//
// Examples:
//   # list the package at its current placeholder version
//   pnpm publish:bootstrap -- --package @bauer-group/accessibility-widget
//   # or pin a real first version (reverted afterwards)
//   pnpm publish:bootstrap -- --package @bauer-group/accessibility-widget --version 1.0.0
//
// This repo is a pnpm workspace, so the package is built with pnpm and
// published from its own directory (npm has no workspace view here).

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    package: { type: 'string' },
    version: { type: 'string' },
    tag: { type: 'string', default: 'latest' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help || !values.package) {
  process.stdout.write(`Bootstrap (list) a workspace package on npm so Trusted Publishing can be set up.

Usage:
  pnpm publish:bootstrap -- --package <name> [--version <x.y.z>] [--tag latest]

Options:
  --package  Workspace package name (e.g. @bauer-group/accessibility-widget)
  --version  Optional version (default: the package's current version)
  --tag      npm dist-tag (default: latest)
  -h, --help Show this message
`);
  process.exit(values.help ? 0 : 1);
}

if (values.version && !/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(values.version)) {
  throw new Error(`Invalid --version "${values.version}" (expected semver, e.g. 1.0.0)`);
}

// Resolve the workspace directory whose package.json name matches --package.
const root = process.cwd();
const pkgDir = readdirSync(resolve(root, 'packages'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => `packages/${e.name}`)
  .find((dir) => {
    try {
      return (
        JSON.parse(readFileSync(resolve(root, dir, 'package.json'), 'utf8')).name === values.package
      );
    } catch {
      return false;
    }
  });

if (!pkgDir) {
  throw new Error(`Workspace package "${values.package}" not found under packages/*`);
}

const absPkgDir = resolve(root, pkgDir);
const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';
const pnpm = isWin ? 'pnpm.cmd' : 'pnpm';
const inDir = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', cwd: absPkgDir });
const atRoot = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', cwd: root });

const version =
  values.version || JSON.parse(readFileSync(resolve(absPkgDir, 'package.json'), 'utf8')).version;
process.stdout.write(`\n▶ Bootstrap publish ${values.package}@${version} (${pkgDir})\n\n`);

try {
  if (values.version) {
    inDir(npm, ['version', values.version, '--no-git-tag-version', '--allow-same-version']);
  }
  // Build the package explicitly (pnpm workspace), then publish from its dir.
  atRoot(pnpm, ['--filter', values.package, 'build']);
  // Interactive — completes npm 2FA (passkey/OTP) in the browser.
  inDir(npm, ['publish', '--access', 'public', '--tag', values.tag]);
  process.stdout.write(`\n✓ Listed ${values.package}@${version}\n`);
  process.stdout.write(
    `Next: add the Trusted Publisher on npmjs (repo + nodejs-release.yml). Ongoing\n` +
      `releases then publish the real versions from CI via OIDC.\n`
  );
} finally {
  if (values.version) {
    // Restore the placeholder version so the working tree stays clean.
    try {
      atRoot('git', ['checkout', '--', `${pkgDir}/package.json`]);
    } catch {
      /* git unavailable / nothing to restore — ignore */
    }
  }
}
