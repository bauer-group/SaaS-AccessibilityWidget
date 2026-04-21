import { describe, it, expect, beforeEach } from 'vitest';
import { createDefaultState, loadState, saveState, cycleStep, STEPS, hasAnyFeatureOn } from '../src/state.js';

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
    saveState('bfsg-test', s);
    const loaded = loadState('bfsg-test');
    expect(loaded.features.fontSize).toBe(true);
    expect(loaded.fontSizeLevel).toBe(1.4);
  });

  it('merges partial persisted state with defaults', () => {
    localStorage.setItem('bfsg-partial', JSON.stringify({ fontSizeLevel: 1.6 }));
    const loaded = loadState('bfsg-partial');
    expect(loaded.fontSizeLevel).toBe(1.6);
    expect(loaded.contrastMode).toBe('off');
    expect(Object.keys(loaded.features).length).toBeGreaterThan(0);
  });

  it('returns defaults on corrupt JSON', () => {
    localStorage.setItem('bfsg-corrupt', '{not json');
    const loaded = loadState('bfsg-corrupt');
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
});
