/**
 * Integration tests for the loader IIFE — the code that renders the FAB
 * before first paint and keeps it in sync with the core bundle's lifecycle.
 *
 * Each test boots the loader fresh via vi.resetModules() so DOM + global
 * state don't leak between cases. Core is imported once at the top so
 * `window.AccessibilityWidgetCore.close()` is real when the toggle path
 * needs to call it.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { WidgetConfig, WidgetState } from '../src/types/index.js';

import '../src/core.js';

// Cross-test-file Window interface merging forces us to agree on the public
// API shape. We rely on the widget's own globals.d.ts to type
// `window.AccessibilityWidget` and `window.AccessibilityWidgetConfig`; here
// we only need the loader-only `__accessibilityWidgetLoaded` boot guard.
declare global {
  interface Window {
    __accessibilityWidgetLoaded?: boolean;
  }
}

async function bootLoader(
  config?: WidgetConfig,
  initialState?: WidgetState,
): Promise<HTMLButtonElement> {
  document.body.replaceChildren();
  document.head.querySelectorAll('[data-aw-css]').forEach((n) => n.remove());
  document.getElementById('aw-critical-css')?.remove();
  document.documentElement.removeAttribute('data-aw-instant');
  for (const a of Array.from(document.documentElement.attributes)) {
    if (a.name.startsWith('data-aw-')) document.documentElement.removeAttribute(a.name);
  }
  localStorage.clear();
  if (initialState) localStorage.setItem('accessibility-widget', JSON.stringify(initialState));
  window.__accessibilityWidgetLoaded = false;
  window.AccessibilityWidgetConfig = config;
  vi.resetModules();
  await import('../src/loader.js');
  const fab = document.querySelector<HTMLButtonElement>('[data-aw-fab]');
  if (!fab) throw new Error('FAB was not rendered by loader');
  return fab;
}

afterEach(() => {
  document.body.replaceChildren();
  window.__accessibilityWidgetLoaded = false;
});

describe('FAB rendering', () => {
  it('creates a button with role=button and proper ARIA wiring', async () => {
    const fab = await bootLoader();
    expect(fab.tagName).toBe('BUTTON');
    expect(fab.getAttribute('aria-haspopup')).toBe('dialog');
    expect(fab.getAttribute('aria-controls')).toBe('aw-panel');
    expect(fab.getAttribute('aria-expanded')).toBe('false');
  });

  it('honours the configured position via a class modifier', async () => {
    const fab = await bootLoader({ position: 'top-left' });
    expect(fab.classList.contains('aw-fab--top-left')).toBe(true);
  });

  it('injects critical CSS once', async () => {
    await bootLoader();
    expect(document.querySelectorAll('#aw-critical-css').length).toBe(1);
  });
});

describe('locale detection', () => {
  it('uses persisted state.locale as the highest-priority source', async () => {
    // State.locale wins over config.locale and html[lang] — this is the
    // runtime override path that setLocale() writes to.
    const fab = await bootLoader({ locale: 'en' }, {
      features: {
        fontSize: false,
        lineHeight: false,
        letterSpacing: false,
        contrast: false,
        grayscale: false,
        invertColors: false,
        dyslexiaFont: false,
        highlightLinks: false,
        pauseAnimations: false,
        bigCursor: false,
        focusOutline: false,
        readingMask: false,
        readingGuide: false,
        tts: false,
        structureNav: false,
      },
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
      locale: 'ja',
    } as WidgetState);
    // The FAB aria-label uses the localised LABEL — Japanese "アクセシビリティ設定".
    expect(fab.getAttribute('aria-label')).toContain('アクセシビリティ');
  });

  it('falls back to config.locale when state.locale is unset', async () => {
    const fab = await bootLoader({ locale: 'fr' });
    expect(fab.getAttribute('aria-label')).toContain('Réglages');
  });

  it('rejects an invalid state.locale rather than trusting it blindly', async () => {
    const fab = await bootLoader({ locale: 'de' }, {
      features: {},
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
      locale: 'xx' as never,
    } as unknown as WidgetState);
    // "xx" is not a supported locale — fall through to config.locale (de).
    expect(fab.getAttribute('aria-label')).toContain('Barrierefreiheit');
  });
});

describe('FAB click — open path', () => {
  it('sets aria-busy while core is loading', async () => {
    const fab = await bootLoader({ debug: false });
    // Core is already imported in this test file, so window.AccessibilityWidgetCore exists.
    // But loader's loadCore() creates a fresh <script> tag whose onload never fires in
    // jsdom, so aria-busy stays visible for the assertion.
    fab.click();
    expect(fab.getAttribute('aria-busy')).toBe('true');
    expect(fab.disabled).toBe(true);
  });
});

describe('FAB click — toggle close path (bug #7 regression)', () => {
  it('second click when aria-expanded=true invokes core.close() instead of re-opening', async () => {
    const fab = await bootLoader();
    // Simulate a successful open: FAB declares itself expanded and the panel has a DOM node.
    fab.setAttribute('aria-expanded', 'true');
    const closeSpy = vi.spyOn(window.AccessibilityWidgetCore!, 'close');
    fab.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    closeSpy.mockRestore();
  });
});

describe('FAB aria-expanded sync via events', () => {
  it('flips to false when the widget emits the close event', async () => {
    const fab = await bootLoader();
    fab.setAttribute('aria-expanded', 'true');
    document.dispatchEvent(new CustomEvent('accessibility-widget:close', { detail: {} }));
    expect(fab.getAttribute('aria-expanded')).toBe('false');
  });

  it('flips to true when the widget emits the open event', async () => {
    const fab = await bootLoader();
    document.dispatchEvent(
      new CustomEvent('accessibility-widget:open', { detail: { trigger: fab } }),
    );
    expect(fab.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('initialFeatures seeding', () => {
  it('writes a seed state when localStorage is empty and initialFeatures is provided', async () => {
    await bootLoader({ initialFeatures: { focusOutline: true } });
    const raw = localStorage.getItem('accessibility-widget');
    expect(raw).not.toBeNull();
    const parsed = raw ? (JSON.parse(raw) as { features: Record<string, boolean> }) : null;
    expect(parsed?.features.focusOutline).toBe(true);
  });

  it('does NOT overwrite existing state', async () => {
    await bootLoader({ initialFeatures: { focusOutline: true } }, {
      features: { grayscale: true },
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
    } as unknown as WidgetState);
    const parsed = JSON.parse(localStorage.getItem('accessibility-widget')!) as {
      features: Record<string, boolean>;
    };
    // Original grayscale stays ON; focusOutline is NOT seeded because state was already present.
    expect(parsed.features.grayscale).toBe(true);
    expect(parsed.features.focusOutline).toBeUndefined();
  });
});

describe('applyPersistedPreferences — early-paint DOM attrs', () => {
  it('projects boolean feature flags onto the <html> element before the core loads', async () => {
    await bootLoader(undefined, {
      // Contrast is only projected when BOTH features.contrast=true AND
      // contrastMode is set — the loader treats them as a pair.
      features: { grayscale: true, pauseAnimations: true, focusOutline: true, contrast: true },
      fontSizeLevel: 1.4,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0.1,
      contrastMode: 'high',
    } as unknown as WidgetState);
    const html = document.documentElement;
    expect(html.hasAttribute('data-aw-grayscale')).toBe(true);
    expect(html.hasAttribute('data-aw-pause-animations')).toBe(true);
    expect(html.hasAttribute('data-aw-focus')).toBe(true);
    expect(html.getAttribute('data-aw-contrast')).toBe('high');
    expect(html.style.getPropertyValue('--aw-font-scale')).toBe('1.4');
  });
});

describe('FAB drag (config.draggableFab)', () => {
  function stubLayout(el: HTMLElement, initialX = 20, initialY = 20, size = 48): void {
    // jsdom has no layout — stub getBoundingClientRect to read the CSS vars
    // the loader writes via setFabPos, falling back to the initial anchor.
    el.getBoundingClientRect = () => {
      const xVar = parseFloat(el.style.getPropertyValue('--aw-fab-x'));
      const yVar = parseFloat(el.style.getPropertyValue('--aw-fab-y'));
      const x = Number.isFinite(xVar) ? xVar : initialX;
      const y = Number.isFinite(yVar) ? yVar : initialY;
      return {
        left: x,
        top: y,
        right: x + size,
        bottom: y + size,
        width: size,
        height: size,
        x,
        y,
        toJSON: () => ({}),
      } as DOMRect;
    };

    el.setPointerCapture = () => {};

    el.releasePointerCapture = () => {};
  }

  it('is inert by default (no drag-style attributes set)', async () => {
    const fab = await bootLoader({});
    expect(fab.style.touchAction || '').toBe('');
    expect(fab.style.cursor || '').toBe('');
  });

  it('when enabled, sets touch-action and cursor to prepare pointer drag', async () => {
    const fab = await bootLoader({ draggableFab: true });
    expect(fab.style.touchAction).toBe('none');
    expect(fab.style.cursor).toBe('grab');
  });

  it('Shift+ArrowRight moves 10 px and persists fabPosition', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const fab = await bootLoader({ draggableFab: true });
    stubLayout(fab, 20, 20);

    fab.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }),
    );
    const stored = JSON.parse(localStorage.getItem('accessibility-widget')!) as {
      fabPosition?: { x: number; y: number };
    };
    expect(stored.fabPosition?.x).toBe(30); // 20 + 10
    expect(stored.fabPosition?.y).toBe(20);
    expect(fab.getAttribute('data-aw-fab-pos')).toBe('custom');
  });

  it('applies a persisted fabPosition on boot', async () => {
    const fab = await bootLoader({ draggableFab: true }, {
      features: {},
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
      fabPosition: { x: 200, y: 150 },
    } as unknown as WidgetState);
    expect(fab.getAttribute('data-aw-fab-pos')).toBe('custom');
    expect(fab.style.getPropertyValue('--aw-fab-x')).toBe('200px');
    expect(fab.style.getPropertyValue('--aw-fab-y')).toBe('150px');
  });

  it('setPosition({ x, y }) moves the FAB and persists', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const fab = await bootLoader({ draggableFab: true });
    window.AccessibilityWidget!.setPosition({ x: 300, y: 400 });
    expect(fab.style.getPropertyValue('--aw-fab-x')).toBe('300px');
    expect(fab.style.getPropertyValue('--aw-fab-y')).toBe('400px');
    const stored = JSON.parse(localStorage.getItem('accessibility-widget')!) as {
      fabPosition?: { x: number; y: number };
    };
    expect(stored.fabPosition).toEqual({ x: 300, y: 400 });
  });

  it('setPosition(null) resets to config-anchor and clears persisted state', async () => {
    const fab = await bootLoader({ draggableFab: true }, {
      features: {},
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
      fabPosition: { x: 200, y: 150 },
    } as unknown as WidgetState);
    window.AccessibilityWidget!.setPosition(null);
    expect(fab.hasAttribute('data-aw-fab-pos')).toBe(false);
    expect(fab.style.getPropertyValue('--aw-fab-x')).toBe('');
    const stored = JSON.parse(localStorage.getItem('accessibility-widget')!) as {
      fabPosition?: unknown;
    };
    expect(stored.fabPosition).toBeUndefined();
  });

  it('setPosition() with non-finite coords is a no-op (silently rejected)', async () => {
    const fab = await bootLoader({ draggableFab: true });
    window.AccessibilityWidget!.setPosition({ x: NaN, y: 50 });
    expect(fab.hasAttribute('data-aw-fab-pos')).toBe(false);
  });
});

describe('public API — AccessibilityWidget global', () => {
  it('attaches set, reset, applyProfile, setLocale, setPosition, getState, on', async () => {
    await bootLoader();
    const api = window.AccessibilityWidget!;
    for (const fn of [
      'open',
      'close',
      'reset',
      'set',
      'applyProfile',
      'setLocale',
      'setPosition',
      'getState',
      'on',
    ] as const) {
      expect(typeof api[fn]).toBe('function');
    }
  });

  it('getState reflects the persisted state', async () => {
    await bootLoader(undefined, {
      features: { grayscale: true },
      fontSizeLevel: 1,
      lineHeightLevel: 1.5,
      letterSpacingLevel: 0,
      contrastMode: 'off',
    } as unknown as WidgetState);
    expect(window.AccessibilityWidget!.getState()?.features.grayscale).toBe(true);
  });
});

describe('keyboard shortcut (configurable, disableable)', () => {
  /**
   * We drive the handler with a synthetic KeyboardEvent on `document` —
   * the loader registers a document-level listener so the shortcut works
   * from anywhere on the page, not just when focus is on the FAB.
   */
  function press(
    key: string,
    mods: { alt?: boolean; ctrl?: boolean; shift?: boolean; meta?: boolean } = {},
  ): KeyboardEvent {
    const ev = new KeyboardEvent('keydown', {
      key,
      altKey: mods.alt ?? false,
      ctrlKey: mods.ctrl ?? false,
      shiftKey: mods.shift ?? false,
      metaKey: mods.meta ?? false,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(ev);
    return ev;
  }

  it('fires the default Ctrl+Alt+A combo and preventDefault()s the event', async () => {
    const fab = await bootLoader();
    const spy = vi.spyOn(fab, 'click');
    const ev = press('a', { ctrl: true, alt: true });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(true);
  });

  it('ignores plain a (no modifiers)', async () => {
    const fab = await bootLoader();
    const spy = vi.spyOn(fab, 'click');
    press('a');
    expect(spy).not.toHaveBeenCalled();
  });

  it('ignores the old default (Alt+Shift+A) — new default is exclusive', async () => {
    // Regression guard: when we moved the default away from Alt+Shift+A,
    // that combo must no longer activate the FAB under the default config.
    const fab = await bootLoader();
    const spy = vi.spyOn(fab, 'click');
    press('a', { alt: true, shift: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('requires exact modifier match — Ctrl+Alt+Shift+A does NOT trigger ctrl+alt+a', async () => {
    const fab = await bootLoader();
    const spy = vi.spyOn(fab, 'click');
    press('a', { ctrl: true, alt: true, shift: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('respects a custom shortcut string', async () => {
    const fab = await bootLoader({ keyboardShortcut: 'alt+shift+a' });
    const spy = vi.spyOn(fab, 'click');
    // Default (ctrl+alt+a) must NOT work anymore.
    press('a', { ctrl: true, alt: true });
    expect(spy).not.toHaveBeenCalled();
    // Custom combo DOES work.
    press('a', { alt: true, shift: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('accepts an F-key with no modifiers', async () => {
    const fab = await bootLoader({ keyboardShortcut: 'F2' });
    const spy = vi.spyOn(fab, 'click');
    press('F2');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('disables the shortcut when keyboardShortcut is false', async () => {
    const fab = await bootLoader({ keyboardShortcut: false });
    const spy = vi.spyOn(fab, 'click');
    press('a', { ctrl: true, alt: true });
    press('F2');
    expect(spy).not.toHaveBeenCalled();
  });

  it('falls back to no-shortcut on invalid strings and warns when debug=true', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fab = await bootLoader({ keyboardShortcut: 'alt+', debug: true });
    const spy = vi.spyOn(fab, 'click');
    press('a', { ctrl: true, alt: true });
    expect(spy).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('keyboardShortcut'));
    warn.mockRestore();
  });
});
