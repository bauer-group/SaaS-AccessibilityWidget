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
});
