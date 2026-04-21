/*!
 * BFSG Accessibility Widget — Core (on-demand bundle)
 * License: MIT — © BAUER GROUP
 */
import { isLocale, type Locale, type WidgetState } from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { applyState } from './features/apply.js';
import { loadState, saveState, clearState } from './state.js';
import { openPanel, type PanelHandle } from './panel/panel.js';

export interface CoreOpenOptions {
  trigger?: HTMLElement;
  config?: Parameters<typeof resolveConfig>[0];
  locale?: Locale | 'auto';
  statementUrl?: string;
}

let panel: PanelHandle | null = null;
let lastTrigger: HTMLElement | null = null;

function open(opts: CoreOpenOptions = {}): void {
  if (panel) return;
  const config: ResolvedConfig = resolveConfig(
    { ...(opts.config ?? {}), ...(opts.locale && opts.locale !== 'auto' ? { locale: opts.locale } : {}) },
    navigator.language,
  );
  const locale: Locale =
    opts.locale && opts.locale !== 'auto' && isLocale(opts.locale) ? opts.locale : config.locale;

  lastTrigger = opts.trigger ?? (document.activeElement as HTMLElement | null);
  const state = loadState(config.storageKey);
  applyState(state);

  panel = openPanel({
    config,
    locale,
    state,
    statementUrl: opts.statementUrl,
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
  const cfg = resolveConfig({}, navigator.language);
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
  const cfg = resolveConfig({}, navigator.language);
  clearState(cfg.storageKey);
  const fresh = loadState(cfg.storageKey);
  applyState(fresh);
  panel?.rerender();
}

function getState(): WidgetState {
  const cfg = resolveConfig({}, navigator.language);
  return loadState(cfg.storageKey);
}

const api = { open, close, set, reset, getState, version: '1.0.0-alpha.1' };

if (typeof window !== 'undefined') {
  window.BFSGWidgetCore = api;
}

export default api;
