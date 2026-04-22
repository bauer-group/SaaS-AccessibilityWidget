/*!
 * BAUER GROUP Accessibility Widget — Core (on-demand bundle)
 * License: MIT — © BAUER GROUP
 */
import { isLocale, type Locale, type WidgetConfig, type WidgetState } from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { applyState } from './features/apply.js';
import { loadState, saveState, clearState } from './state.js';
import { openPanel, type PanelHandle } from './panel/panel.js';

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

function open(opts: CoreOpenOptions = {}): void {
  if (panel) return;
  const mergedInput: WidgetConfig = {
    ...readUserConfig(),
    ...(opts.config ?? {}),
    ...(opts.locale && opts.locale !== 'auto' ? { locale: opts.locale } : {}),
  };
  const config: ResolvedConfig = resolveConfig(mergedInput, navigator.language);
  const locale: Locale =
    opts.locale && opts.locale !== 'auto' && isLocale(opts.locale) ? opts.locale : config.locale;

  lastTrigger = opts.trigger ?? (document.activeElement as HTMLElement | null);
  const state = loadState(config.storageKey);
  applyState(state);

  panel = openPanel({
    config,
    locale,
    state,
    // opts.statementUrl wins over config.statementUrl — covers the
    // "open the widget with a one-off statement link" edge case.
    statementUrl: opts.statementUrl ?? config.statementUrl ?? undefined,
    onClose: close,
    onStateChange: () => {
      /* state already saved inside panel */
    },
  });
}

function close(): void {
  panel?.destroy();
  panel = null;
  lastTrigger?.focus();
  lastTrigger = null;
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
}

function reset(): void {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  clearState(cfg.storageKey);
  const fresh = loadState(cfg.storageKey);
  applyState(fresh);
  panel?.rerender();
}

function getState(): WidgetState {
  const cfg = resolveConfig(readUserConfig(), navigator.language);
  return loadState(cfg.storageKey);
}

const api = { open, close, set, reset, getState, version: '1.0.0-alpha.1' };

if (typeof window !== 'undefined') {
  window.AccessibilityWidgetCore = api;
}

export default api;
