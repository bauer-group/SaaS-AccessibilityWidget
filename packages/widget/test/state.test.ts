import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDefaultState,
  loadState,
  saveState,
  cycleStep,
  STEPS,
  hasAnyFeatureOn,
} from '../src/state.js';

describe('state module', () => {
  beforeEach(() => localStorage.clear());

  it('returns a pristine default state', () => {
    const s = createDefaultState();
    expect(s.fontSizeLevel).toBe(1);
    expect(s.contrastMode).toBe('off');
    expect(hasAnyFeatureOn(s)).toBe(false);
  });

  it('round-trips through localStorage', () => {
    const s = createDefaultState();
    s.features.fontSize = true;
    s.fontSizeLevel = 1.4;
    saveState('aw-test', s);
    const loaded = loadState('aw-test');
    expect(loaded.features.fontSize).toBe(true);
    expect(loaded.fontSizeLevel).toBe(1.4);
  });

  it('merges partial persisted state with defaults', () => {
    localStorage.setItem('aw-partial', JSON.stringify({ fontSizeLevel: 1.6 }));
    const loaded = loadState('aw-partial');
    expect(loaded.fontSizeLevel).toBe(1.6);
    expect(loaded.contrastMode).toBe('off');
    expect(Object.keys(loaded.features).length).toBeGreaterThan(0);
  });

  it('returns defaults on corrupt JSON', () => {
    localStorage.setItem('aw-corrupt', '{not json');
    const loaded = loadState('aw-corrupt');
    expect(loaded).toEqual(createDefaultState());
  });

  it('cycleStep wraps correctly', () => {
    const { next, wrapped } = cycleStep(1.6, STEPS.fontSize);
    expect(next).toBe(1);
    expect(wrapped).toBe(true);
    const again = cycleStep(1, STEPS.fontSize);
    expect(again.next).toBe(1.2);
    expect(again.wrapped).toBe(false);
  });

  it('preserves locale override across load/save — otherwise any feature toggle wipes it', () => {
    localStorage.setItem(
      'aw-pref',
      JSON.stringify({ features: {}, fontSizeLevel: 1, locale: 'ja' }),
    );
    const loaded = loadState('aw-pref');
    expect(loaded.locale).toBe('ja');

    // Simulate a feature toggle that re-saves the loaded state — locale must survive.
    loaded.features.bigCursor = true;
    saveState('aw-pref', loaded);
    expect(loadState('aw-pref').locale).toBe('ja');
  });

  it('drops an unsupported locale string rather than trusting it', () => {
    localStorage.setItem('aw-bad', JSON.stringify({ features: {}, locale: 'xx' }));
    expect(loadState('aw-bad').locale).toBeUndefined();
  });

  it('preserves fabPosition across load/save', () => {
    localStorage.setItem(
      'aw-fab',
      JSON.stringify({ features: {}, fabPosition: { x: 120, y: 340 } }),
    );
    const loaded = loadState('aw-fab');
    expect(loaded.fabPosition).toEqual({ x: 120, y: 340 });
    saveState('aw-fab', loaded);
    expect(loadState('aw-fab').fabPosition).toEqual({ x: 120, y: 340 });
  });

  describe('untrusted-payload validation', () => {
    it('clamps an out-of-domain contrastMode to the default', () => {
      localStorage.setItem(
        'aw-poison',
        JSON.stringify({ contrastMode: '"] html{display:none}' }),
      );
      expect(loadState('aw-poison').contrastMode).toBe('off');
    });

    it('rejects a step value that is not one of the known steps', () => {
      localStorage.setItem('aw-poison', JSON.stringify({ fontSizeLevel: 9999 }));
      expect(loadState('aw-poison').fontSizeLevel).toBe(1);
    });

    it('keeps a valid non-default step value', () => {
      localStorage.setItem('aw-ok', JSON.stringify({ lineHeightLevel: 1.8 }));
      expect(loadState('aw-ok').lineHeightLevel).toBe(1.8);
    });

    it('drops unknown feature keys, coerces values to boolean, and resists proto pollution', () => {
      // Raw JSON string — a literal "__proto__" key is the actual pollution
      // vector (an object-literal __proto__ would set the prototype instead).
      localStorage.setItem(
        'aw-poison',
        '{"features":{"grayscale":1,"bogus":true},"__proto__":{"polluted":true}}',
      );
      const loaded = loadState('aw-poison');
      expect(loaded.features.grayscale).toBe(true);
      expect((loaded.features as Record<string, unknown>).bogus).toBeUndefined();
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('coerces a non-boolean oversized flag', () => {
      localStorage.setItem('aw-poison', JSON.stringify({ oversized: 'yes' }));
      expect(loadState('aw-poison').oversized).toBe(true);
    });
  });
});
