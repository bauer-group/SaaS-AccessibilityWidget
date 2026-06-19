// Cloudflare R2 + CDN adapter — dual-path (immutable + floating) layout.
//
// A widely-distributed, SRI-pinned widget needs two kinds of URL:
//   * immutable  accessibility-widget/<x.y.z>/…  — bytes never change, cached
//                forever (`max-age=31536000, immutable`), safe to pin `integrity=`.
//   * floating   accessibility-widget/v<major>/… — always the latest patch within
//                the major, short edge TTL + per-URL purge each deploy (no SRI pin).
//
// Each deploy uploads the SAME built bytes to BOTH roots with DIFFERENT
// Cache-Control, then purges ONLY the floating URLs. The version comes from
// <source>/integrity.json (written by the build) — no git/tag plumbing here.
//
// Three steps per prefix:
//   1. Upload every file under `source` to the prefix via the S3-compatible
//      R2 API (R2 speaks SigV4, so we reuse @aws-sdk/client-s3).
//   2. Sync-delete: remove keys this adapter wrote on a previous deploy that
//      are no longer present, tracked by a per-prefix `.deploy-manifest.json`.
//      Objects the adapter never wrote are never touched, so the shared
//      `bg-widgets` bucket safely holds other projects' assets alongside ours.
//   3. (floating only) Purge the matching URLs on the Cloudflare zone.
//
// Set `dualPath` in the zone config to enable this; without it the adapter
// falls back to the legacy single-`prefix` behaviour (one mutable root).
//
// R2 docs:     https://developers.cloudflare.com/r2/api/s3/api/
// Purge docs:  https://developers.cloudflare.com/api/operations/zone-purge

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import Cloudflare from 'cloudflare';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';

import { MANIFEST_FILENAME, deleteKeys, readManifestKeys, writeManifest } from './s3-sync.mjs';
import { contentTypeFor, mapLimit, requireEnv, toPosix, walk } from './utils.mjs';

// Cloudflare's purge-by-URL endpoint accepts up to 30 URLs per call
// on Free / Pro / Business plans (500 on Enterprise). Batch accordingly.
const PURGE_BATCH_SIZE = 30;

// Read the build version from the dist integrity.json so the CDN path roots
// always match the bytes being uploaded.
async function readVersion(source) {
  let raw;
  try {
    raw = await readFile(`${source}/integrity.json`, 'utf8');
  } catch {
    throw new Error(`cloudflare: ${source}/integrity.json not found — run the widget build first`);
  }
  const version = JSON.parse(raw)?.version;
  if (typeof version !== 'string' || version.length === 0) {
    throw new Error('cloudflare: integrity.json has no "version" field');
  }
  return version;
}

// Upload every file to `prefix/`, then sync-delete obsolete keys this adapter
// wrote previously (per-prefix manifest). Returns the uploaded keys so the
// caller can purge the matching URLs.
async function uploadTree({
  s3,
  bucket,
  source,
  files,
  prefix,
  cacheControl,
  concurrency,
  syncDelete,
  dryRun,
  logger,
}) {
  const prefixStr = prefix.replace(/^\/+|\/+$/g, '');
  const makeKey = (rel) => (prefixStr ? `${prefixStr}/${rel}` : rel);

  logger.log(`    target:   r2://${bucket}/${prefixStr ? prefixStr + '/' : ''}`);
  logger.log(`    cache:    ${cacheControl}`);

  let totalBytes = 0;
  const uploadedRels = [];
  await mapLimit(files, concurrency, async (file) => {
    const rel = toPosix(relative(source, file));
    const key = makeKey(rel);
    const body = await readFile(file);
    totalBytes += body.byteLength;

    if (dryRun) {
      logger.log(`    [dry-run] PUT ${key} (${body.byteLength} B, ${contentTypeFor(file)})`);
    } else {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentTypeFor(file),
          CacheControl: cacheControl,
        })
      );
      logger.log(`    ✓ ${key}`);
    }
    uploadedRels.push(rel);
  });

  let deletedCount = 0;
  if (syncDelete) {
    const manifestKey = makeKey(MANIFEST_FILENAME);
    const currentKeys = new Set(uploadedRels.map(makeKey));

    if (dryRun) {
      logger.log(`    [dry-run] would sync manifest ${manifestKey} (${currentKeys.size} key(s))`);
    } else {
      const previousKeys = await readManifestKeys(s3, bucket, manifestKey);
      // Only delete keys this adapter wrote previously — never touch objects
      // placed in the bucket by someone else.
      const obsolete = previousKeys.filter((k) => !currentKeys.has(k) && k !== manifestKey);
      if (obsolete.length === 0) {
        logger.log(`    sync:     no obsolete keys to remove`);
      } else {
        await deleteKeys(s3, bucket, obsolete);
        deletedCount = obsolete.length;
        for (const k of obsolete) logger.log(`    ✗ ${k} (deleted, obsolete)`);
      }
      await writeManifest(s3, bucket, manifestKey, [...currentKeys]);
      logger.log(`    ✓ manifest ${manifestKey} (${currentKeys.size} key(s))`);
    }
  }

  const mb = (totalBytes / 1024 / 1024).toFixed(2);
  logger.log(
    dryRun
      ? `    [dry-run] would upload ${files.length} file(s) (${mb} MB)`
      : `    uploaded ${files.length} file(s) (${mb} MB)` +
          (deletedCount > 0 ? `, deleted ${deletedCount} obsolete key(s)` : '')
  );

  return uploadedRels.map(makeKey);
}

export async function deploy({ source, config, dryRun, logger = console }) {
  const {
    accountId,
    endpoint,
    bucket,
    basePrefix,
    prefix = '',
    include,
    accessKeyIdEnv,
    secretAccessKeyEnv,
    cacheControl = 'public, max-age=300, s-maxage=31536000',
    concurrency = 8,
    syncDelete = true,
    zoneIdEnv,
    apiTokenEnv,
    publicOrigin,
    purgeEverything = false,
    dualPath,
  } = config;

  if (!accountId) throw new Error('cloudflare: missing config.accountId');
  if (!bucket) throw new Error('cloudflare: missing config.bucket');
  if (!accessKeyIdEnv) throw new Error('cloudflare: missing config.accessKeyIdEnv');
  if (!secretAccessKeyEnv) throw new Error('cloudflare: missing config.secretAccessKeyEnv');
  if (!apiTokenEnv) throw new Error('cloudflare: missing config.apiTokenEnv');
  if (!zoneIdEnv) throw new Error('cloudflare: missing config.zoneIdEnv');

  // publicOrigin may be a string (single hostname) or an array of strings
  // (bucket fronted by multiple hostnames). Internally always an array.
  const origins = publicOrigin
    ? (Array.isArray(publicOrigin) ? publicOrigin : [publicOrigin])
        .filter((o) => typeof o === 'string' && o.length > 0)
        .map((o) => o.replace(/\/+$/, ''))
    : [];
  if (!purgeEverything && origins.length === 0) {
    throw new Error(
      'cloudflare: config.publicOrigin is required (string or non-empty array of origin URLs) unless purgeEverything=true'
    );
  }

  const accessKeyId = requireEnv(accessKeyIdEnv, 'cloudflare');
  const secretAccessKey = requireEnv(secretAccessKeyEnv, 'cloudflare');
  const apiToken = requireEnv(apiTokenEnv, 'cloudflare');
  const zoneId = requireEnv(zoneIdEnv, 'cloudflare');

  // Default endpoint is account-scoped; EU-jurisdiction buckets require the
  // `.eu.` host. Callers override via config.endpoint when needed.
  const r2Endpoint = endpoint || `https://${accountId}.r2.cloudflarestorage.com`;
  const s3 = new S3Client({
    region: 'auto',
    endpoint: r2Endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  // CDN artifacts only: an optional suffix allowlist keeps npm-only files
  // (e.g. .d.ts declarations and their .d.ts.map sourcemaps) out of the public
  // CDN tree. Matched by SUFFIX, not extension, so `.min.js.map` is kept while
  // `.d.ts.map` is not (path.extname can't tell them apart — both are ".map").
  const suffixes =
    Array.isArray(include) && include.length > 0 ? include.map((s) => s.toLowerCase()) : null;
  const files = (await walk(source)).filter(
    (f) => !suffixes || suffixes.some((s) => f.toLowerCase().endsWith(s))
  );
  if (files.length === 0) {
    throw new Error(
      `cloudflare: no files found under ${source}${suffixes ? ' (after include filter)' : ''}`
    );
  }

  logger.log(`  target:   r2://${bucket} (account ${accountId})`);
  logger.log(`  files:    ${files.length}`);
  logger.log(`  parallel: ${concurrency}`);

  // Build the upload passes. dualPath → immutable <version>/ + floating v<major>/;
  // otherwise a single legacy prefix (Banner semantics).
  let passes;
  if (dualPath) {
    if (!basePrefix) throw new Error('cloudflare: dualPath requires config.basePrefix');
    const version = await readVersion(source);
    const major = version.split('.')[0];
    const versioned = dualPath.versioned ?? {};
    const floating = dualPath.floating ?? {};
    passes = [
      {
        label: 'immutable',
        prefix: `${basePrefix}/${version}`,
        cacheControl: versioned.cacheControl ?? 'public, max-age=31536000, immutable',
        purge: versioned.purge ?? false,
      },
      {
        label: 'floating',
        prefix: `${basePrefix}/v${major}`,
        cacheControl: floating.cacheControl ?? 'public, max-age=300, s-maxage=31536000',
        purge: floating.purge ?? true,
      },
    ];
    logger.log(
      `  version:  ${version} → ${passes[0].prefix}/ (immutable) + ${passes[1].prefix}/ (floating)`
    );
  } else {
    passes = [{ label: 'single', prefix, cacheControl, purge: !purgeEverything }];
  }

  const purgeKeys = [];
  try {
    for (const pass of passes) {
      logger.log(`\n  [${pass.label}]`);
      const keys = await uploadTree({
        s3,
        bucket,
        source,
        files,
        prefix: pass.prefix,
        cacheControl: pass.cacheControl,
        concurrency,
        syncDelete,
        dryRun,
        logger,
      });
      if (pass.purge) purgeKeys.push(...keys);
    }
  } finally {
    s3.destroy();
  }

  const cf = new Cloudflare({ apiToken });

  if (purgeEverything) {
    if (dryRun) {
      logger.log(`\n  [dry-run] would purge_everything on zone ${zoneId}`);
      return;
    }
    await cf.cache.purge({ zone_id: zoneId, purge_everything: true });
    logger.log(`\n  ✓ purged everything on zone ${zoneId}`);
    return;
  }

  const urls = origins.flatMap((origin) => purgeKeys.map((key) => `${origin}/${key}`));
  if (urls.length === 0) {
    logger.log(`\n  purge:    nothing to purge (immutable paths only)`);
    return;
  }

  logger.log(
    `\n  purge:    ${urls.length} URL(s) across ${origins.length} origin(s) on zone ${zoneId}`
  );
  for (let i = 0; i < urls.length; i += PURGE_BATCH_SIZE) {
    const batch = urls.slice(i, i + PURGE_BATCH_SIZE);
    const batchNum = Math.floor(i / PURGE_BATCH_SIZE) + 1;
    if (dryRun) {
      logger.log(`  [dry-run] purge batch ${batchNum} (${batch.length} URL(s))`);
      continue;
    }
    await cf.cache.purge({ zone_id: zoneId, files: batch });
    logger.log(`  ✓ purged ${batch.length} URL(s) (batch ${batchNum})`);
  }
}
