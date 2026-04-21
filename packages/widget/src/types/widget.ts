import type { Locale } from './locale.js';

export const FEATURE_IDS = [
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'contrast',
  'grayscale',
  'invertColors',
  'dyslexiaFont',
  'highlightLinks',
  'pauseAnimations',
  'bigCursor',
  'focusOutline',
  'readingMask',
  'readingGuide',
  'tts',
  'structureNav',
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export const CONTRAST_MODES = ['off', 'high', 'dark', 'invert'] as const;
export type ContrastMode = (typeof CONTRAST_MODES)[number];

export const PROFILE_IDS = [
  'visionImpaired',
  'motor',
  'cognitive',
  'seizureSafe',
  'adhd',
  'blind',
] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export const POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const;
export type Position = (typeof POSITIONS)[number];

export interface WidgetState {
  features: Record<FeatureId, boolean>;
  fontSizeLevel: number;
  lineHeightLevel: number;
  letterSpacingLevel: number;
  contrastMode: ContrastMode;
}

export interface WidgetConfig {
  corePath?: string;
  cssPath?: string;
  position?: Position;
  locale?: Locale | 'auto';
  storageKey?: string;
  buttonLabel?: string | null;
  respectReducedMotion?: boolean;
  primaryColor?: string;
  hideOnPrint?: boolean;
  coreIntegrity?: string | null;
  debug?: boolean;
}

export interface ProfilePreset {
  features?: Partial<Record<FeatureId, boolean>>;
  fontSizeLevel?: number;
  lineHeightLevel?: number;
  letterSpacingLevel?: number;
  contrastMode?: ContrastMode;
}

export const DEFAULT_STATE: WidgetState = {
  features: FEATURE_IDS.reduce(
    (acc, id) => {
      acc[id] = false;
      return acc;
    },
    {} as Record<FeatureId, boolean>,
  ),
  fontSizeLevel: 1,
  lineHeightLevel: 1.5,
  letterSpacingLevel: 0,
  contrastMode: 'off',
};

export const PROFILES: Record<ProfileId, ProfilePreset> = {
  visionImpaired: {
    features: {
      fontSize: true,
      contrast: true,
      highlightLinks: true,
      focusOutline: true,
      bigCursor: true,
    },
    fontSizeLevel: 1.4,
    contrastMode: 'high',
  },
  motor: {
    features: { bigCursor: true, focusOutline: true, pauseAnimations: true },
  },
  cognitive: {
    features: {
      dyslexiaFont: true,
      lineHeight: true,
      letterSpacing: true,
      readingGuide: true,
    },
    lineHeightLevel: 1.8,
    letterSpacingLevel: 0.05,
  },
  seizureSafe: {
    features: { pauseAnimations: true, grayscale: true },
  },
  adhd: {
    features: { readingMask: true, pauseAnimations: true, focusOutline: true },
  },
  blind: {
    features: { structureNav: true, highlightLinks: true, focusOutline: true },
  },
};
