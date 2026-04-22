/*!
 * BAUER GROUP Accessibility Widget — Core (on-demand bundle)
 * License: MIT — © BAUER GROUP
 */
import {
  isLocale,
  PROFILE_IDS,
  type Locale,
  type ProfileId,
  type WidgetConfig,
  type WidgetState,
} from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { applyState } from './features/apply.js';
import { applyProfile } from './features/profile.js';
import { loadState, saveState, clearState } from './state.js';
import { openPanel, type PanelHandle } from './panel/panel.js';
import { dispatchWidgetEvent } from './util/events.js';

export interface CoreOpenOptions {
  trigger?: HTMLElement;
  config?: WidgetConfig;
  locale?: Locale | 'auto';
  statementUrl?: string;
}

let panel: PanelHandle | null = null;
let lastTrigger: HTMLElement | null = null;

/**
 * Read the host-supplied config from window every time (over reading it
 * once at module load) so late mutations — e.g. SPA navigation that rewrites
 * AccessibilityWidgetConfig — are honored.
 */
function readUserConfig(): WidgetConfig {
  if (typeof window === 'undefined') return {};
  return window.AccessibilityWidgetConfig ?? {};
}

function resolveActiveLocale(config: ResolvedConfig, state: WidgetState, explicit?: Locale | 'auto'): Locale {
  if (explicit && explicit !== 'auto' && isLocale(explicit)) return explicit;
  if (state.locale && isLocale(state.locale)) return state.locale;
  return config.locale;
}

function open(opts: CoreOpenOptions = {}): void {
  if (panel) return;
  const mergedInput: WidgetConfig = {
    ...readUserConfig(),
    ...(opts.config ?? {}),
    ...(opts.locale && opts.locale !== 'auto' ? { locale: opts.locale } : {}),
  };
  const config: ResolvedConfig = resolveConfig(mergedInput, navigator.language);
  const state = loadState(config.storageKey);
  const locale: Locale = resolveActiveLocale(config, state, opts.locale);

  lastTrigger = opts.trigger ?? (document.activeElement as HTMLElement | null);
  applyState(state);

  panel = openPanel({
    config,
    locale,
    state,
    // opts.statementUrl wins over config.statementUrl — covers the
    // "open the widget with a one-off statement link" edge case.
    statementUrl: opts.statementUrl ?? config.statementUrl ?? undefined,
    onClose: close,
    onStateChange: (next) => {
      dispatchWidgetEvent('stateChange', { state: next });
    },
  });
  dispatchWidgetEvent('open', { trigger: lastTrigger });
}

function close(): void {
  panel?.destroy();
  panel = null;
  lastTrigger?.focus();
  lastTrigger = null;
  dispatchWidgetEvent('close', {});
}

function set(id: string, value: unknown): void {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  if (cfg.disabledFeatures.has(id as never)) {
    if (cfg.debug) console.warn(`[aw] core.set: feature "${id}" is disabled by config; ignoring`);
    return;
  }
  const state = loadState(cfg.storageKey);
  if (id in state.features) {
    (state.features as Record<string, boolean>)[id] = Boolean(value);
  } else {
    (state as unknown as Record<string, unknown>)[id] = value;
  }
  saveState(cfg.storageKey, state);
  applyState(state);
  panel?.rerender();
  dispatchWidgetEvent('stateChange', { state });
}

function applyProfileById(id: string): boolean {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  if (!(PROFILE_IDS as readonly string[]).includes(id)) {
    if (cfg.debug) console.warn(`[aw] core.applyProfile: unknown profile "${id}"; ignoring`);
    return false;
  }
  const state = loadState(cfg.storageKey);
  const next = applyProfile(state, id as ProfileId);
  // Strip features the host has disabled so profile presets can't re-enable them.
  for (const disabled of cfg.disabledFeatures) {
    next.features[disabled] = false;
  }
  saveState(cfg.storageKey, next);
  applyState(next);
  panel?.rerender();
  dispatchWidgetEvent('profileApplied', { profile: id as ProfileId, state: next });
  dispatchWidgetEvent('stateChange', { state: next });
  return true;
}

function setLocale(next: string): boolean {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  if (!isLocale(next)) {
    if (cfg.debug) console.warn(`[aw] core.setLocale: "${next}" is not a supported locale; ignoring`);
    return false;
  }
  const state = loadState(cfg.storageKey);
  if (state.locale === next) return true;
  const updated: WidgetState = { ...state, locale: next };
  saveState(cfg.storageKey, updated);
  panel?.setLocale(next);
  dispatchWidgetEvent('localeChanged', { locale: next });
  dispatchWidgetEvent('stateChange', { state: updated });
  return true;
}

function reset(): void {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  clearState(cfg.storageKey);
  const fresh = loadState(cfg.storageKey);
  applyState(fresh);
  panel?.rerender();
  dispatchWidgetEvent('reset', {});
  dispatchWidgetEvent('stateChange', { state: fresh });
}

function getState(): WidgetState {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  return loadState(cfg.storageKey);
}

const api = {
  open,
  close,
  set,
  applyProfile: applyProfileById,
  setLocale,
  reset,
  getState,
  version: '1.0.0-alpha.1',
};

if (typeof window !== 'undefined') {
  window.AccessibilityWidgetCore = api;
}

export default api;
