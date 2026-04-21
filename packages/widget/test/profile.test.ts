import { describe, it, expect } from 'vitest';
import { applyProfile } from '../src/features/profile.js';
import { createDefaultState } from '../src/state.js';

describe('applyProfile', () => {
  it('visionImpaired enables relevant features and raises fontSize', () => {
    const next = applyProfile(createDefaultState(), 'visionImpaired');
    expect(next.features.fontSize).toBe(true);
    expect(next.features.contrast).toBe(true);
    expect(next.features.highlightLinks).toBe(true);
    expect(next.fontSizeLevel).toBe(1.4);
    expect(next.contrastMode).toBe('high');
  });

  it('seizureSafe enables pauseAnimations and grayscale', () => {
    const next = applyProfile(createDefaultState(), 'seizureSafe');
    expect(next.features.pauseAnimations).toBe(true);
    expect(next.features.grayscale).toBe(true);
  });

  it('profiles do not mutate input', () => {
    const input = createDefaultState();
    const snapshot = JSON.stringify(input);
    applyProfile(input, 'motor');
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
