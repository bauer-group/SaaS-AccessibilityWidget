import { describe, it, expect, beforeEach } from 'vitest';
import { applyState } from '../src/features/apply.js';
import { createDefaultState } from '../src/state.js';

describe('applyState', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-aw-contrast');
    document.documentElement.removeAttribute('data-aw-grayscale');
    document.documentElement.removeAttribute('data-aw-focus');
    document.documentElement.style.cssText = '';
  });

  it('sets data-aw-instant and default CSS variables', () => {
    applyState(createDefaultState());
    expect(document.documentElement.getAttribute('data-aw-instant')).toBe('1');
    expect(document.documentElement.style.getPropertyValue('--aw-font-scale')).toBe('1');
  });

  it('adds data-aw-contrast when contrast feature is on', () => {
    const s = createDefaultState();
    s.features.contrast = true;
    s.contrastMode = 'high';
    applyState(s);
    expect(document.documentElement.getAttribute('data-aw-contrast')).toBe('high');
  });

  it('removes data-aw-contrast when toggled off', () => {
    const s = createDefaultState();
    s.features.contrast = true;
    s.contrastMode = 'dark';
    applyState(s);
    expect(document.documentElement.getAttribute('data-aw-contrast')).toBe('dark');
    s.features.contrast = false;
    applyState(s);
    expect(document.documentElement.hasAttribute('data-aw-contrast')).toBe(false);
  });
});
