import { describe, it, expect, beforeEach } from 'vitest';
import { createDefaultState, loadState, saveState, cycleStep, STEPS, hasAnyFeatureOn } from '../src/state.js';

/**
 * happy-dom's localStorage.clear() throws in some versions
 * (`localStorage.clear is not a function`). Iterating keys works reliably
 * across happy-dom + jsdom + real browsers.
 */
function resetLocalStorage(): void {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key !== null) localStorage.removeItem(key);
  }
}

describe('state module', () => {
  beforeEach(() => resetLocalStorage());

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
});
