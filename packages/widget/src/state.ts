import { DEFAULT_STATE, type WidgetState, type FeatureId, type ContrastMode } from './types/index.js';
import { warnIfDebug } from './util/debug.js';

export const STEPS = {
  fontSize: [1, 1.2, 1.4, 1.6] as const,
  lineHeight: [1.5, 1.8, 2.0] as const,
  letterSpacing: [0, 0.05, 0.1] as const,
  contrast: ['off', 'high', 'dark', 'invert'] as const satisfies readonly ContrastMode[],
};

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
    return {
      features: { ...fresh.features, ...(parsed.features ?? {}) },
      fontSizeLevel: parsed.fontSizeLevel ?? fresh.fontSizeLevel,
      lineHeightLevel: parsed.lineHeightLevel ?? fresh.lineHeightLevel,
      letterSpacingLevel: parsed.letterSpacingLevel ?? fresh.letterSpacingLevel,
      contrastMode: parsed.contrastMode ?? fresh.contrastMode,
    };
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
