import {
  DEFAULT_STATE,
  FEATURE_IDS,
  isLocale,
  type WidgetState,
  type FeatureId,
  type ContrastMode,
} from './types/index.js';
import { warnIfDebug } from './util/debug.js';

export const STEPS = {
  fontSize: [1, 1.2, 1.4, 1.6] as const,
  lineHeight: [1.5, 1.8, 2.0] as const,
  letterSpacing: [0, 0.05, 0.1] as const,
  contrast: ['off', 'high', 'dark', 'invert'] as const satisfies readonly ContrastMode[],
};

/** Keep a numeric step value only if it's one of the known steps, else fall back. */
export function coerceStep(value: unknown, steps: readonly number[], fallback: number): number {
  return typeof value === 'number' && steps.includes(value) ? value : fallback;
}

/** Keep a contrast mode only if it's one of the supported modes, else fall back. */
export function coerceContrastMode(value: unknown, fallback: ContrastMode): ContrastMode {
  return typeof value === 'string' && (STEPS.contrast as readonly string[]).includes(value)
    ? (value as ContrastMode)
    : fallback;
}

/**
 * Rebuild the feature map from `fresh` (the canonical key set) and overlay only
 * known feature ids, coercing each to a boolean. Unknown keys from a poisoned
 * or stale localStorage payload are dropped rather than persisted forward.
 */
function sanitizeFeatures(
  raw: unknown,
  fresh: Record<FeatureId, boolean>,
): Record<FeatureId, boolean> {
  const out = { ...fresh };
  if (raw && typeof raw === 'object') {
    const src = raw as Record<string, unknown>;
    for (const id of FEATURE_IDS) {
      if (src[id] !== undefined) out[id] = Boolean(src[id]);
    }
  }
  return out;
}

export function createDefaultState(): WidgetState {
  return {
    ...DEFAULT_STATE,
    features: { ...DEFAULT_STATE.features },
  };
}

export function loadState(storageKey: string): WidgetState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<WidgetState>;
    const fresh = createDefaultState();
    // Re-validate every persisted field against its known domain. localStorage
    // is same-origin-writable, so treat its contents as untrusted: clamp step
    // values to the real steps, the contrast mode to a supported mode, and drop
    // unknown feature keys — otherwise a poisoned payload flows straight into a
    // `data-aw-*` attribute / CSS custom property.
    const next: WidgetState = {
      features: sanitizeFeatures(parsed.features, fresh.features),
      fontSizeLevel: coerceStep(parsed.fontSizeLevel, STEPS.fontSize, fresh.fontSizeLevel),
      lineHeightLevel: coerceStep(parsed.lineHeightLevel, STEPS.lineHeight, fresh.lineHeightLevel),
      letterSpacingLevel: coerceStep(
        parsed.letterSpacingLevel,
        STEPS.letterSpacing,
        fresh.letterSpacingLevel,
      ),
      contrastMode: coerceContrastMode(parsed.contrastMode, fresh.contrastMode),
      oversized: Boolean(parsed.oversized ?? fresh.oversized),
    };
    // Preserve optional runtime-override fields. Without these the next save
    // (triggered by any feature toggle) would wipe the user's language
    // choice and their dragged FAB position.
    if (typeof parsed.locale === 'string' && isLocale(parsed.locale)) {
      next.locale = parsed.locale;
    }
    if (
      parsed.fabPosition &&
      typeof parsed.fabPosition.x === 'number' &&
      typeof parsed.fabPosition.y === 'number'
    ) {
      next.fabPosition = { x: parsed.fabPosition.x, y: parsed.fabPosition.y };
    }
    return next;
  } catch (err) {
    warnIfDebug(`loadState("${storageKey}") failed, falling back to defaults`, err);
    return createDefaultState();
  }
}

export function saveState(storageKey: string, state: WidgetState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (err) {
    // Quota exceeded / storage disabled (Safari Private Mode, Intelligent Tracking Prevention, …).
    warnIfDebug(`saveState("${storageKey}") failed — preferences will not persist`, err);
  }
}

export function clearState(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey);
  } catch (err) {
    warnIfDebug(`clearState("${storageKey}") failed`, err);
  }
}

export function hasAnyFeatureOn(state: WidgetState): boolean {
  return Object.values(state.features).some(Boolean);
}

export function cycleStep<T extends number | string>(
  current: T,
  steps: readonly T[],
): { next: T; wrapped: boolean } {
  const idx = steps.indexOf(current);
  const nextIdx = idx < 0 ? 1 : (idx + 1) % steps.length;
  const next = steps[nextIdx] ?? steps[0]!;
  return { next, wrapped: nextIdx === 0 };
}

export function setFeature(state: WidgetState, id: FeatureId, on: boolean): WidgetState {
  return { ...state, features: { ...state.features, [id]: on } };
}
