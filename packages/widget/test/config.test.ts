import { describe, it, expect } from 'vitest';
import { resolveConfig } from '../src/config.js';

describe('resolveConfig', () => {
  it('applies sensible defaults', () => {
    const cfg = resolveConfig(undefined, 'en-US');
    expect(cfg.corePath).toBe('/bfsg-widget/bfsg-widget-core.min.js');
    expect(cfg.position).toBe('bottom-right');
    expect(cfg.locale).toBe('en');
  });

  it('uses explicit locale over navigator', () => {
    const cfg = resolveConfig({ locale: 'de' }, 'en-US');
    expect(cfg.locale).toBe('de');
  });

  it('falls back to de for unsupported navigator language', () => {
    const cfg = resolveConfig({ locale: 'auto' }, 'ja-JP');
    expect(cfg.locale).toBe('de');
  });

  it('keeps user-supplied primaryColor', () => {
    const cfg = resolveConfig({ primaryColor: '#ff0000' }, 'de');
    expect(cfg.primaryColor).toBe('#ff0000');
  });
});
