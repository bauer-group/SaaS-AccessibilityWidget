/**
 * Panel-level integration tests: mount the real panel into jsdom, simulate
 * user interactions, and assert DOM + state + event side-effects.
 *
 * Covers the bugs that slipped past the unit tests last round:
 *   - drag handlers dropping after rerender (bug #1)
 *   - focus restoration keyed on stable data-attrs, not aria-label (bug #4)
 *   - locale switch re-rendering the whole panel with new translations
 *   - disabledFeatures filtering out both the tile and profile auto-enablement
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { openPanel, type PanelHandle } from '../src/panel/panel.js';
import { resolveConfig, type ResolvedConfig } from '../src/config.js';
import { createDefaultState, loadState, saveState } from '../src/state.js';
import type { WidgetConfig, WidgetState } from '../src/types/index.js';

const STORAGE = 'aw-panel-test';

function buildConfig(overrides: WidgetConfig = {}): ResolvedConfig {
  return resolveConfig({ storageKey: STORAGE, ...overrides }, 'en-US');
}

function mount(state?: WidgetState, cfgOverride?: WidgetConfig, locale: 'de' | 'en' = 'en'): {
  handle: PanelHandle;
  onClose: ReturnType<typeof vi.fn>;
  onStateChange: ReturnType<typeof vi.fn>;
} {
  const onClose = vi.fn();
  const onStateChange = vi.fn();
  const handle = openPanel({
    config: buildConfig(cfgOverride),
    locale,
    state: state ?? createDefaultState(),
    onClose,
    onStateChange,
  });
  return { handle, onClose, onStateChange };
}

let mounted: PanelHandle | null = null;

beforeEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-aw-contrast');
  document.documentElement.removeAttribute('data-aw-grayscale');
  localStorage.clear();
});

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

describe('openPanel — DOM output', () => {
  it('attaches a labelled dialog to document.body', () => {
    mounted = mount().handle;
    const root = document.querySelector('[data-aw-panel]');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('dialog');
    expect(root?.getAttribute('aria-modal')).toBe('true');
    expect(root?.getAttribute('lang')).toBe('en');
  });

  it('uses dir=rtl for RTL locales', () => {
    mounted = openPanel({
      config: buildConfig(),
      locale: 'ar',
      state: createDefaultState(),
      onClose: () => {},
      onStateChange: () => {},
    });
    expect(document.querySelector('[data-aw-panel]')?.getAttribute('dir')).toBe('rtl');
  });

  it('renders one profile button per PROFILE_ID', () => {
    mounted = mount().handle;
    expect(document.querySelectorAll('[data-profile]').length).toBe(6);
  });

  it('hides features listed in config.disabledFeatures', () => {
    mounted = mount(undefined, { disabledFeatures: ['tts', 'readingGuide'] }).handle;
    expect(document.querySelector('[data-feature="tts"]')).toBeNull();
    expect(document.querySelector('[data-feature="readingGuide"]')).toBeNull();
    expect(document.querySelector('[data-feature="fontSize"]')).not.toBeNull();
  });
});

describe('feature toggling', () => {
  it('clicking a boolean feature toggles is-on and persists', () => {
    const { handle, onStateChange } = mount();
    mounted = handle;
    document.querySelector<HTMLButtonElement>('[data-feature="grayscale"]')!.click();
    // rerender() replaces the DOM — re-query for the fresh button.
    const after = document.querySelector<HTMLButtonElement>('[data-feature="grayscale"]');
    expect(after?.classList.contains('is-on')).toBe(true);
    expect(after?.getAttribute('aria-checked')).toBe('true');
    expect(loadState(STORAGE).features.grayscale).toBe(true);
    expect(onStateChange).toHaveBeenCalled();
  });

  it('cycle feature (fontSize) exposes role=slider and steps through aria-valuenow', () => {
    const { handle } = mount();
    mounted = handle;
    const btn = document.querySelector<HTMLButtonElement>('[data-feature="fontSize"]');
    expect(btn?.getAttribute('role')).toBe('slider');
    expect(btn?.getAttribute('aria-valuenow')).toBe('0');

    btn?.click(); // → step 1
    expect(
      document.querySelector<HTMLButtonElement>('[data-feature="fontSize"]')?.getAttribute('aria-valuenow'),
    ).toBe('1');
  });

  it('focus survives the commit-triggered re-render for the clicked feature', () => {
    const { handle } = mount();
    mounted = handle;
    const btn = document.querySelector<HTMLButtonElement>('[data-feature="grayscale"]')!;
    btn.focus();
    btn.click();
    const after = document.querySelector<HTMLButtonElement>('[data-feature="grayscale"]');
    expect(document.activeElement).toBe(after);
  });
});

describe('locale switching', () => {
  it('setLocale() rebuilds the panel in the new language', () => {
    const { handle } = mount(undefined, {}, 'en');
    mounted = handle;
    expect(document.querySelector('#aw-panel-title')?.textContent).toBe('Accessibility');
    handle.setLocale('de');
    expect(document.querySelector('#aw-panel-title')?.textContent).toBe('Barrierefreiheit');
    expect(document.querySelector('[data-aw-panel]')?.getAttribute('lang')).toBe('de');
  });

  it('setLocale() persists the choice to WidgetState', () => {
    const { handle } = mount(undefined, {}, 'en');
    mounted = handle;
    handle.setLocale('ja');
    expect(loadState(STORAGE).locale).toBe('ja');
  });

  it('setLocale() to the same locale is a no-op', () => {
    const { handle, onStateChange } = mount(undefined, {}, 'en');
    mounted = handle;
    const calls = onStateChange.mock.calls.length;
    handle.setLocale('en');
    expect(onStateChange.mock.calls.length).toBe(calls);
  });
});

describe('drag attachment across rerenders', () => {
  it('the header carries the drag-handle attribute immediately', () => {
    mounted = mount().handle;
    expect(document.querySelector('header.aw-header')?.getAttribute('data-aw-drag-handle')).toBe('1');
  });

  it('after a feature toggle, the re-rendered header still has the drag handle', () => {
    // Bug #1 from the first review — commit() rebuilt the header but
    // didn't re-attach the drag handler. Now rerender() does the attach
    // itself, so the data-attribute survives and the fresh handle is live.
    const { handle } = mount();
    mounted = handle;
    document.querySelector<HTMLButtonElement>('[data-feature="grayscale"]')?.click();
    expect(
      document.querySelector('header.aw-header')?.getAttribute('data-aw-drag-handle'),
    ).toBe('1');
  });
});

describe('reset button', () => {
  it('clears all features + cycle levels + locale and announces', () => {
    const seed: WidgetState = {
      ...createDefaultState(),
      features: { ...createDefaultState().features, grayscale: true, bigCursor: true },
      fontSizeLevel: 1.4,
      contrastMode: 'high',
      locale: 'ja',
    };
    saveState(STORAGE, seed);
    mounted = mount(seed).handle;

    document.querySelector<HTMLButtonElement>('[data-aw-action="reset"]')?.click();
    const stored = loadState(STORAGE);
    expect(stored.features.grayscale).toBe(false);
    expect(stored.features.bigCursor).toBe(false);
    expect(stored.contrastMode).toBe('off');
    expect(stored.fontSizeLevel).toBe(1);
  });
});

describe('close button', () => {
  it('invokes the onClose callback', () => {
    const { handle, onClose } = mount();
    mounted = handle;
    document.querySelector<HTMLButtonElement>('[data-aw-action="close"]')?.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape also fires onClose', () => {
    const { handle, onClose } = mount();
    mounted = handle;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('oversized toggle', () => {
  it('applies the aw-panel--xl class and persists', () => {
    const { handle } = mount();
    mounted = handle;
    const btn = document.querySelector<HTMLButtonElement>('[data-aw-action="oversized"]');
    btn?.click();
    expect(document.querySelector('[data-aw-panel]')?.classList.contains('aw-panel--xl')).toBe(true);
    expect(loadState(STORAGE).oversized).toBe(true);
  });
});

describe('profile auto-application', () => {
  it('clicking a profile button flips the correct feature set', () => {
    const { handle } = mount();
    mounted = handle;
    document.querySelector<HTMLButtonElement>('[data-profile="visionImpaired"]')?.click();
    const stored = loadState(STORAGE);
    expect(stored.features.fontSize).toBe(true);
    expect(stored.features.contrast).toBe(true);
  });

  it('refuses to enable features that the host has disabled, even via a profile', () => {
    const { handle } = mount(undefined, { disabledFeatures: ['fontSize'] });
    mounted = handle;
    document.querySelector<HTMLButtonElement>('[data-profile="visionImpaired"]')?.click();
    expect(loadState(STORAGE).features.fontSize).toBe(false);
  });
});

describe('footer: disclaimer + powered-by', () => {
  it('renders no disclaimer paragraph when config.disclaimer is unset', () => {
    mounted = mount().handle;
    expect(document.querySelector('.aw-disclaimer')).toBeNull();
  });

  it('renders the host-supplied disclaimer as plain text (no HTML injection)', () => {
    mounted = mount(undefined, { disclaimer: 'Feedback an a11y@example.com' }).handle;
    const p = document.querySelector<HTMLParagraphElement>('.aw-disclaimer');
    expect(p?.textContent).toBe('Feedback an a11y@example.com');
  });

  it('does NOT render HTML inside disclaimer — tags appear as literal text', () => {
    mounted = mount(undefined, { disclaimer: '<script>alert(1)</script>' }).handle;
    const p = document.querySelector<HTMLParagraphElement>('.aw-disclaimer');
    expect(p?.querySelector('script')).toBeNull();
    expect(p?.textContent).toBe('<script>alert(1)</script>');
  });

  it('shows the powered-by line by default, linking to the product page', () => {
    mounted = mount().handle;
    const p = document.querySelector<HTMLParagraphElement>('.aw-poweredby');
    expect(p).not.toBeNull();
    const a = p?.querySelector<HTMLAnchorElement>('a');
    expect(a?.getAttribute('href')).toBe('https://accessibility-widget.app.professional-hosting.com');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a?.textContent).toBe('BAUER GROUP Accessibility-Widget');
  });

  it('uses the localised connector phrase ("Powered by" in en, "Bereitgestellt von" in de)', () => {
    mounted = mount(undefined, {}, 'en').handle;
    expect(document.querySelector('.aw-poweredby')?.textContent).toContain('Powered by');
    mounted.destroy();
    mounted = mount(undefined, {}, 'de').handle;
    expect(document.querySelector('.aw-poweredby')?.textContent).toContain('Bereitgestellt von');
  });

  it('hides the powered-by line when config.hidePoweredBy=true (white-label)', () => {
    mounted = mount(undefined, { hidePoweredBy: true }).handle;
    expect(document.querySelector('.aw-poweredby')).toBeNull();
  });
});

describe('accessibility statement link (statementUrl)', () => {
  function mountWithStatement(statementUrl?: string): PanelHandle {
    const handle = openPanel({
      config: buildConfig(),
      locale: 'en',
      state: createDefaultState(),
      statementUrl,
      onClose: () => {},
      onStateChange: () => {},
    });
    return handle;
  }

  it('renders no link when statementUrl is omitted', () => {
    mounted = mountWithStatement();
    expect(document.querySelector('.aw-statement-link')).toBeNull();
  });

  it('renders a relative URL as same-tab link — no target attribute', () => {
    mounted = mountWithStatement('/barrierefreiheit.html');
    const link = document.querySelector<HTMLAnchorElement>('.aw-statement-link');
    expect(link?.getAttribute('href')).toBe('/barrierefreiheit.html');
    expect(link?.hasAttribute('target')).toBe(false);
    expect(link?.hasAttribute('rel')).toBe(false);
  });

  it('renders an absolute https URL with target=_blank + rel=noopener noreferrer', () => {
    // External origins: open in a new tab so the panel stays put,
    // rel guards against reverse-tabnabbing + referrer leakage.
    mounted = mountWithStatement('https://example.com/a11y');
    const link = document.querySelector<HTMLAnchorElement>('.aw-statement-link');
    expect(link?.getAttribute('href')).toBe('https://example.com/a11y');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('treats protocol-relative URLs (//cdn.example.com/...) as external', () => {
    mounted = mountWithStatement('//cdn.example.com/a11y.html');
    const link = document.querySelector<HTMLAnchorElement>('.aw-statement-link');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('keeps hash-fragment URLs in same tab', () => {
    mounted = mountWithStatement('#a11y');
    const link = document.querySelector<HTMLAnchorElement>('.aw-statement-link');
    expect(link?.hasAttribute('target')).toBe(false);
  });
});
