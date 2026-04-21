import { PROFILES, type ProfileId, type WidgetState } from '../types/index.js';

export function applyProfile(state: WidgetState, profileId: ProfileId): WidgetState {
  const preset = PROFILES[profileId];
  const next: WidgetState = {
    features: { ...state.features },
    fontSizeLevel: preset.fontSizeLevel ?? state.fontSizeLevel,
    lineHeightLevel: preset.lineHeightLevel ?? state.lineHeightLevel,
    letterSpacingLevel: preset.letterSpacingLevel ?? state.letterSpacingLevel,
    contrastMode: preset.contrastMode ?? state.contrastMode,
  };
  if (preset.features) {
    for (const [k, v] of Object.entries(preset.features)) {
      next.features[k as keyof typeof next.features] = v as boolean;
    }
  }
  return next;
}
