import {
  FEATURE_IDS,
  POSITIONS,
  type FeatureId,
  type WidgetConfig,
  type Position,
} from './types/widget.js';
import type { Locale } from './types/locale.js';
import { normalizeLocale, isLocale } from './types/index.js';
import { warnIfDebug } from './util/debug.js';

/**
 * Fully-resolved config with no optional fields — every loader / panel /
 * feature call site can rely on the presence of every key.
 */
export interface ResolvedConfig {
  corePath: string;
  cssPath: string;
  coreIntegrity: string | null;
  cssIntegrity: string | null;
  locale: Locale;
  position: Position;
  offset: { x: number; y: number };
  zIndex: number;
  primaryColor: string;
  buttonLabel: string | null;
  storageKey: string;
  initialFeatures: Readonly<Partial<Record<FeatureId, boolean>>>;
  disabledFeatures: ReadonlySet<FeatureId>;
  statementUrl: string | null;
  draggableFab: boolean;
  respectReducedMotion: boolean;
  hideOnPrint: boolean;
  debug: boolean;
}

const DEFAULTS = {
  corePath: '/accessibility-widget/accessibility-widget-core.min.js',
  cssPath: '/accessibility-widget/accessibility-widget.min.css',
  position: 'bottom-right' as Position,
  offset: { x: 20, y: 20 },
  zIndex: 2_147_483_646,
  primaryColor: '#0058a3',
  storageKey: 'accessibility-widget',
  draggableFab: false,
  respectReducedMotion: true,
  hideOnPrint: true,
  debug: false,
} as const;

// Accepts #rgb, #rrggbb, #rrggbbaa, rgb/rgba/hsl/hsla/color() functional forms,
// and named colors (anything CSS accepts). For the primaryColor field we
// want ANY valid CSS color, so the regex is permissive — just not empty.
const NON_TRIVIAL_COLOR_RE = /^(?:#[0-9a-f]{3,8}|(?:rgb|rgba|hsl|hsla|color|lab|lch|oklab|oklch)\s*\(.+\)|[a-z]+)$/i;

export function resolveConfig(input: WidgetConfig | undefined, navLang: string): ResolvedConfig {
  const cfg = input ?? {};
  const debug = cfg.debug ?? DEFAULTS.debug;

  return {
    corePath: cfg.corePath ?? DEFAULTS.corePath,
    cssPath: cfg.cssPath ?? DEFAULTS.cssPath,
    coreIntegrity: cfg.coreIntegrity ?? null,
    cssIntegrity: cfg.cssIntegrity ?? null,
    locale: resolveLocale(cfg.locale, navLang, debug),
    position: resolvePosition(cfg.position, debug),
    offset: resolveOffset(cfg.offset, debug),
    zIndex: resolveZIndex(cfg.zIndex, debug),
    primaryColor: resolvePrimaryColor(cfg.primaryColor, debug),
    buttonLabel: cfg.buttonLabel ?? null,
    storageKey: resolveStorageKey(cfg.storageKey, debug),
    initialFeatures: resolveInitialFeatures(cfg.initialFeatures, debug),
    disabledFeatures: resolveDisabledFeatures(cfg.disabledFeatures, debug),
    statementUrl: resolveStatementUrl(cfg.statementUrl, debug),
    draggableFab: cfg.draggableFab ?? DEFAULTS.draggableFab,
    respectReducedMotion: cfg.respectReducedMotion ?? DEFAULTS.respectReducedMotion,
    hideOnPrint: cfg.hideOnPrint ?? DEFAULTS.hideOnPrint,
    debug,
  };
}

// ─── individual field resolvers ──────────────────────────────────────

function resolveLocale(
  requested: WidgetConfig['locale'],
  navLang: string,
  debug: boolean,
): Locale {
  if (!requested || requested === 'auto') return normalizeLocale(navLang, 'de');
  if (isLocale(requested)) return requested;
  if (debug) warnIfDebug(`config.locale "${String(requested)}" is not supported; falling back to auto-detect`);
  return normalizeLocale(navLang, 'de');
}

function resolvePosition(requested: WidgetConfig['position'], debug: boolean): Position {
  if (!requested) return DEFAULTS.position;
  if ((POSITIONS as readonly string[]).includes(requested)) return requested;
  if (debug) warnIfDebug(`config.position "${String(requested)}" is not one of ${POSITIONS.join(', ')}; using default`);
  return DEFAULTS.position;
}

function resolveOffset(
  requested: WidgetConfig['offset'],
  debug: boolean,
): { x: number; y: number } {
  if (!requested) return { ...DEFAULTS.offset };
  const x = finiteOr(requested.x, DEFAULTS.offset.x, 'config.offset.x', debug);
  const y = finiteOr(requested.y, DEFAULTS.offset.y, 'config.offset.y', debug);
  return { x, y };
}

function resolveZIndex(requested: WidgetConfig['zIndex'], debug: boolean): number {
  return finiteOr(requested, DEFAULTS.zIndex, 'config.zIndex', debug);
}

function resolvePrimaryColor(
  requested: WidgetConfig['primaryColor'],
  debug: boolean,
): string {
  if (requested === undefined) return DEFAULTS.primaryColor;
  const trimmed = String(requested).trim();
  if (!trimmed) {
    if (debug) warnIfDebug('config.primaryColor is empty; using default');
    return DEFAULTS.primaryColor;
  }
  if (!NON_TRIVIAL_COLOR_RE.test(trimmed)) {
    if (debug) warnIfDebug(`config.primaryColor "${trimmed}" does not look like a CSS color; browsers may reject it`);
  }
  return trimmed;
}

function resolveStorageKey(requested: WidgetConfig['storageKey'], debug: boolean): string {
  if (requested === undefined) return DEFAULTS.storageKey;
  const trimmed = String(requested).trim();
  if (!trimmed) {
    if (debug) warnIfDebug('config.storageKey is empty; using default');
    return DEFAULTS.storageKey;
  }
  return trimmed;
}

function resolveInitialFeatures(
  requested: WidgetConfig['initialFeatures'],
  debug: boolean,
): Readonly<Partial<Record<FeatureId, boolean>>> {
  if (!requested) return Object.freeze({});
  const valid: Partial<Record<FeatureId, boolean>> = {};
  const validIds = new Set<string>(FEATURE_IDS);
  for (const [key, value] of Object.entries(requested)) {
    if (!validIds.has(key)) {
      if (debug) warnIfDebug(`config.initialFeatures: unknown feature id "${key}" ignored`);
      continue;
    }
    valid[key as FeatureId] = Boolean(value);
  }
  return Object.freeze(valid);
}

function resolveDisabledFeatures(
  requested: WidgetConfig['disabledFeatures'],
  debug: boolean,
): ReadonlySet<FeatureId> {
  if (!requested) return new Set();
  const result = new Set<FeatureId>();
  const validIds = new Set<string>(FEATURE_IDS);
  for (const id of requested) {
    if (!validIds.has(id)) {
      if (debug) warnIfDebug(`config.disabledFeatures: unknown feature id "${id}" ignored`);
      continue;
    }
    result.add(id);
  }
  return result;
}

function resolveStatementUrl(
  requested: WidgetConfig['statementUrl'],
  debug: boolean,
): string | null {
  if (!requested) return null;
  const trimmed = String(requested).trim();
  if (!trimmed) return null;
  // A best-effort sanity check: block javascript: / data: schemes to avoid
  // footguns when the host interpolates user input.
  if (/^\s*(?:javascript|data):/i.test(trimmed)) {
    if (debug) warnIfDebug(`config.statementUrl "${trimmed}" uses a blocked scheme; ignoring`);
    return null;
  }
  return trimmed;
}

function finiteOr(value: unknown, fallback: number, label: string, debug: boolean): number {
  if (value === undefined || value === null) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) {
    if (debug) warnIfDebug(`${label} "${String(value)}" is not a finite number; using ${fallback}`);
    return fallback;
  }
  return n;
}
