import { describe, it, expect } from 'vitest';
import { resolveConfig } from '../src/config.js';

describe('resolveConfig', () => {
  it('applies sensible defaults', () => {
    const cfg = resolveConfig(undefined, 'en-US');
    expect(cfg.corePath).toBe('/accessibility-widget/accessibility-widget-core.min.js');
    expect(cfg.position).toBe('bottom-right');
    expect(cfg.locale).toBe('en');
  });

  it('uses explicit locale over navigator', () => {
    const cfg = resolveConfig({ locale: 'de' }, 'en-US');
    expect(cfg.locale).toBe('de');
  });

  it('falls back to de for unsupported navigator language', () => {
    // 'lv' (Latvian) is intentionally NOT in SUPPORTED_LOCALES — picking a
    // language that is actually unsupported avoids false negatives when we
    // expand the locale list.
    const cfg = resolveConfig({ locale: 'auto' }, 'lv-LV');
    expect(cfg.locale).toBe('de');
  });

  it('keeps user-supplied primaryColor', () => {
    const cfg = resolveConfig({ primaryColor: '#ff0000' }, 'de');
    expect(cfg.primaryColor).toBe('#ff0000');
  });
});
