import { describe, it, expect } from 'vitest';
import { resolveConfig } from '../src/config.js';

describe('resolveConfig — defaults', () => {
  it('applies sensible defaults when given undefined', () => {
    const cfg = resolveConfig(undefined, 'en-US');
    expect(cfg.corePath).toBe('/accessibility-widget/accessibility-widget-core.min.js');
    expect(cfg.cssPath).toBe('/accessibility-widget/accessibility-widget.min.css');
    expect(cfg.position).toBe('bottom-right');
    expect(cfg.offset).toEqual({ x: 20, y: 20 });
    expect(cfg.zIndex).toBe(2_147_483_646);
    expect(cfg.primaryColor).toBe('#0058a3');
    expect(cfg.storageKey).toBe('accessibility-widget');
    expect(cfg.respectReducedMotion).toBe(true);
    expect(cfg.hideOnPrint).toBe(true);
    expect(cfg.debug).toBe(false);
    expect(cfg.locale).toBe('en');
    expect(cfg.coreIntegrity).toBeNull();
    expect(cfg.cssIntegrity).toBeNull();
    expect(cfg.statementUrl).toBeNull();
    expect(cfg.buttonLabel).toBeNull();
    expect(cfg.initialFeatures).toEqual({});
    expect(cfg.disabledFeatures.size).toBe(0);
  });
});

describe('resolveConfig — locale', () => {
  it('uses explicit locale over navigator', () => {
    expect(resolveConfig({ locale: 'de' }, 'en-US').locale).toBe('de');
  });

  it('falls back to de for unsupported navigator language', () => {
    // lv (Latvian) is intentionally NOT in SUPPORTED_LOCALES.
    expect(resolveConfig({ locale: 'auto' }, 'lv-LV').locale).toBe('de');
  });

  it('respects BCP47 primary subtag', () => {
    expect(resolveConfig({ locale: 'auto' }, 'pt-BR').locale).toBe('pt');
    expect(resolveConfig({ locale: 'auto' }, 'zh-Hans-CN').locale).toBe('zh');
  });
});

describe('resolveConfig — offset + zIndex', () => {
  it('keeps user-supplied offset', () => {
    expect(resolveConfig({ offset: { x: 80, y: 120 } }, 'de').offset).toEqual({ x: 80, y: 120 });
  });

  it('merges partial offset with defaults', () => {
    expect(resolveConfig({ offset: { x: 40 } }, 'de').offset).toEqual({ x: 40, y: 20 });
  });

  it('falls back to default offset when non-finite', () => {
    expect(resolveConfig({ offset: { x: NaN, y: Infinity } }, 'de').offset).toEqual({ x: 20, y: 20 });
  });

  it('keeps user-supplied zIndex', () => {
    expect(resolveConfig({ zIndex: 9999 }, 'de').zIndex).toBe(9999);
  });

  it('falls back for non-finite zIndex', () => {
    expect(resolveConfig({ zIndex: NaN }, 'de').zIndex).toBe(2_147_483_646);
  });
});

describe('resolveConfig — color', () => {
  it('keeps user-supplied primaryColor', () => {
    expect(resolveConfig({ primaryColor: '#ff0000' }, 'de').primaryColor).toBe('#ff0000');
  });

  it('accepts CSS functional forms', () => {
    expect(resolveConfig({ primaryColor: 'rgb(10, 20, 30)' }, 'de').primaryColor).toBe('rgb(10, 20, 30)');
    expect(resolveConfig({ primaryColor: 'oklch(0.7 0.2 250)' }, 'de').primaryColor).toBe('oklch(0.7 0.2 250)');
  });

  it('falls back when empty', () => {
    expect(resolveConfig({ primaryColor: '  ' }, 'de').primaryColor).toBe('#0058a3');
  });
});

describe('resolveConfig — storageKey', () => {
  it('keeps user-supplied storageKey', () => {
    expect(resolveConfig({ storageKey: 'mycorp-a11y' }, 'de').storageKey).toBe('mycorp-a11y');
  });

  it('trims whitespace', () => {
    expect(resolveConfig({ storageKey: '  foo  ' }, 'de').storageKey).toBe('foo');
  });

  it('falls back when empty', () => {
    expect(resolveConfig({ storageKey: '' }, 'de').storageKey).toBe('accessibility-widget');
  });
});

describe('resolveConfig — disabledFeatures', () => {
  it('stores valid feature ids in a Set', () => {
    const cfg = resolveConfig({ disabledFeatures: ['tts', 'structureNav'] }, 'de');
    expect(cfg.disabledFeatures.has('tts')).toBe(true);
    expect(cfg.disabledFeatures.has('structureNav')).toBe(true);
    expect(cfg.disabledFeatures.has('fontSize')).toBe(false);
  });

  it('silently drops unknown feature ids', () => {
    const cfg = resolveConfig(
      { disabledFeatures: ['tts', 'not-a-real-feature' as never] },
      'de',
    );
    expect(cfg.disabledFeatures.has('tts')).toBe(true);
    expect(cfg.disabledFeatures.size).toBe(1);
  });
});

describe('resolveConfig — initialFeatures', () => {
  it('keeps valid entries and coerces values to boolean', () => {
    const cfg = resolveConfig(
      { initialFeatures: { focusOutline: true, highlightLinks: 1 as unknown as boolean } },
      'de',
    );
    expect(cfg.initialFeatures).toEqual({ focusOutline: true, highlightLinks: true });
  });

  it('silently drops unknown feature ids', () => {
    const cfg = resolveConfig(
      {
        initialFeatures: {
          focusOutline: true,
          'not-a-feature': true,
        } as Record<string, boolean>,
      },
      'de',
    );
    expect(cfg.initialFeatures).toEqual({ focusOutline: true });
  });
});

describe('resolveConfig — statementUrl', () => {
  it('passes through normal URLs', () => {
    expect(resolveConfig({ statementUrl: '/accessibility' }, 'de').statementUrl).toBe('/accessibility');
    expect(resolveConfig({ statementUrl: 'https://example.com/a11y' }, 'de').statementUrl).toBe('https://example.com/a11y');
  });

  it('blocks javascript: scheme', () => {
    expect(resolveConfig({ statementUrl: 'javascript:alert(1)' }, 'de').statementUrl).toBeNull();
  });

  it('blocks data: scheme', () => {
    expect(resolveConfig({ statementUrl: 'data:text/html,<script>' }, 'de').statementUrl).toBeNull();
  });

  it('treats empty / whitespace as not set', () => {
    expect(resolveConfig({ statementUrl: '   ' }, 'de').statementUrl).toBeNull();
  });
});

describe('resolveConfig — draggableFab', () => {
  it('defaults to false', () => {
    expect(resolveConfig(undefined, 'de').draggableFab).toBe(false);
    expect(resolveConfig({}, 'de').draggableFab).toBe(false);
  });

  it('passes through explicit true', () => {
    expect(resolveConfig({ draggableFab: true }, 'de').draggableFab).toBe(true);
  });

  it('is independent from the config.position anchor', () => {
    const cfg = resolveConfig({ position: 'top-left', draggableFab: true }, 'de');
    expect(cfg.position).toBe('top-left');
    expect(cfg.draggableFab).toBe(true);
  });
});

describe('resolveConfig — SRI', () => {
  it('keeps user-supplied coreIntegrity + cssIntegrity', () => {
    const cfg = resolveConfig(
      { coreIntegrity: 'sha384-CORE', cssIntegrity: 'sha384-CSS' },
      'de',
    );
    expect(cfg.coreIntegrity).toBe('sha384-CORE');
    expect(cfg.cssIntegrity).toBe('sha384-CSS');
  });
});
