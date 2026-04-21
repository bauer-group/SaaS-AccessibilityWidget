import { describe, it, expect, beforeEach } from 'vitest';
import { applyState } from '../src/features/apply.js';
import { createDefaultState } from '../src/state.js';

describe('applyState', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-bfsg-contrast');
    document.documentElement.removeAttribute('data-bfsg-grayscale');
    document.documentElement.removeAttribute('data-bfsg-focus');
    document.documentElement.style.cssText = '';
  });

  it('sets data-bfsg-instant and default CSS variables', () => {
    applyState(createDefaultState());
    expect(document.documentElement.getAttribute('data-bfsg-instant')).toBe('1');
    expect(document.documentElement.style.getPropertyValue('--bfsg-font-scale')).toBe('1');
  });

  it('adds data-bfsg-contrast when contrast feature is on', () => {
    const s = createDefaultState();
    s.features.contrast = true;
    s.contrastMode = 'high';
    applyState(s);
    expect(document.documentElement.getAttribute('data-bfsg-contrast')).toBe('high');
  });

  it('removes data-bfsg-contrast when toggled off', () => {
    const s = createDefaultState();
    s.features.contrast = true;
    s.contrastMode = 'dark';
    applyState(s);
    expect(document.documentElement.getAttribute('data-bfsg-contrast')).toBe('dark');
    s.features.contrast = false;
    applyState(s);
    expect(document.documentElement.hasAttribute('data-bfsg-contrast')).toBe(false);
  });
});
