/**
 * Integration tests for the core bundle's public API (open/close/set/
 * applyProfile/setLocale/reset). We exercise the `AccessibilityWidgetCore`
 * object the way the loader actually uses it — via `window` — so locale
 * resolution, state persistence and event dispatch are all covered end-to-end.
 *
 * The tests import `core.ts` for its side-effect of attaching the API to
 * `window.AccessibilityWidgetCore`. Host config is injected by setting
 * `window.AccessibilityWidgetConfig` before each suite.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { WidgetConfig, WidgetState } from '../src/types/index.js';
import { onWidgetEvent } from '../src/util/events.js';
import { loadState, saveState } from '../src/state.js';

import '../src/core.js';

// Window types come from src/globals.d.ts — don't redeclare here (that
// would create a merge conflict with other test files).

const STORAGE = 'aw-core-test';

function api() {
  const a = window.AccessibilityWidgetCore;
  if (!a) throw new Error('core API not attached to window');
  return a;
}

beforeEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-aw-contrast');
  localStorage.clear();
  window.AccessibilityWidgetConfig = { storageKey: STORAGE };
});

afterEach(() => {
  api().close();
});

describe('core.setLocale', () => {
  it('persists a supported locale to WidgetState under the configured key', () => {
    expect(api().setLocale('ja')).toBe(true);
    expect(loadState(STORAGE).locale).toBe('ja');
  });

  it('returns false and does not persist for an unsupported locale', () => {
    expect(api().setLocale('xx')).toBe(false);
    expect(loadState(STORAGE).locale).toBeUndefined();
  });

  it('dispatches localeChanged + stateChange events in that order', () => {
    const log: string[] = [];
    const offLocale = onWidgetEvent('localeChanged', (d) => log.push(`locale:${d.locale}`));
    const offState = onWidgetEvent('stateChange', () => log.push('state'));
    api().setLocale('fr');
    offLocale();
    offState();
    expect(log).toEqual(['locale:fr', 'state']);
  });

  it('is a no-op when the locale is already active', () => {
    api().setLocale('de');
    const handler = vi.fn();
    const off = onWidgetEvent('localeChanged', handler);
    expect(api().setLocale('de')).toBe(true);
    off();
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('core.applyProfile', () => {
  it('turns on the features a profile declares and persists them', () => {
    const ok = api().applyProfile('visionImpaired');
    expect(ok).toBe(true);
    const saved = loadState(STORAGE);
    expect(saved.features.fontSize).toBe(true);
    expect(saved.features.contrast).toBe(true);
    expect(saved.contrastMode).toBe('high');
  });

  it('refuses unknown profile ids without mutating state', () => {
    const before = loadState(STORAGE);
    expect(api().applyProfile('nope')).toBe(false);
    expect(loadState(STORAGE)).toEqual(before);
  });

  it('strips features the host has disabled, even if the profile requests them', () => {
    window.AccessibilityWidgetConfig = { storageKey: STORAGE, disabledFeatures: ['tts', 'fontSize'] };
    api().applyProfile('visionImpaired');
    const saved = loadState(STORAGE);
    // Profile wants fontSize: true, but config.disabledFeatures forbids it.
    expect(saved.features.fontSize).toBe(false);
    expect(saved.features.contrast).toBe(true);
  });

  it('dispatches profileApplied with the profile id and resulting state', () => {
    const handler = vi.fn();
    const off = onWidgetEvent('profileApplied', handler);
    api().applyProfile('cognitive');
    off();
    expect(handler).toHaveBeenCalledTimes(1);
    const detail = handler.mock.calls[0]?.[0];
    expect(detail?.profile).toBe('cognitive');
    expect(detail?.state.features.dyslexiaFont).toBe(true);
  });
});

describe('core.set', () => {
  it('flips a feature flag and applies it to <html>', () => {
    api().set('grayscale', true);
    expect(document.documentElement.hasAttribute('data-aw-grayscale')).toBe(true);
    expect(loadState(STORAGE).features.grayscale).toBe(true);
  });

  it('ignores a set() call for a feature the host has disabled', () => {
    window.AccessibilityWidgetConfig = { storageKey: STORAGE, disabledFeatures: ['tts'] };
    api().set('tts', true);
    expect(loadState(STORAGE).features.tts).toBe(false);
  });
});

describe('core.reset', () => {
  it('clears persisted state and dispatches reset + stateChange', () => {
    // Prime with some customised state.
    saveState(STORAGE, {
      ...loadState(STORAGE),
      features: { ...loadState(STORAGE).features, grayscale: true },
      contrastMode: 'high',
      locale: 'ja',
    });

    const events: string[] = [];
    const offReset = onWidgetEvent('reset', () => events.push('reset'));
    const offState = onWidgetEvent('stateChange', () => events.push('state'));
    api().reset();
    offReset();
    offState();

    const fresh = loadState(STORAGE);
    expect(fresh.features.grayscale).toBe(false);
    expect(fresh.contrastMode).toBe('off');
    expect(fresh.locale).toBeUndefined();
    expect(events).toEqual(['reset', 'state']);
  });
});

describe('core.open / close', () => {
  it('creates a dialog on open() and removes it on close()', () => {
    api().open({});
    expect(document.querySelector('[data-aw-panel]')).not.toBeNull();
    api().close();
    expect(document.querySelector('[data-aw-panel]')).toBeNull();
  });

  it('is idempotent — a second open() while already open is a no-op', () => {
    api().open({});
    const first = document.querySelector('[data-aw-panel]');
    api().open({});
    const second = document.querySelector('[data-aw-panel]');
    expect(first).toBe(second); // same node, not re-created
  });

  it('dispatches the open event with the trigger element attached to detail', () => {
    const trigger = document.createElement('button');
    const handler = vi.fn();
    const off = onWidgetEvent('open', handler);
    api().open({ trigger });
    off();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.trigger).toBe(trigger);
  });

  it('setLocale() while the panel is open re-renders in the new language', () => {
    api().open({ locale: 'en' });
    const titleBefore = document.querySelector<HTMLElement>('#aw-panel-title')?.textContent;
    api().setLocale('de');
    const titleAfter = document.querySelector<HTMLElement>('#aw-panel-title')?.textContent;
    expect(titleBefore).not.toBe(titleAfter);
    expect(titleAfter).toBe('Barrierefreiheit');
  });
});
