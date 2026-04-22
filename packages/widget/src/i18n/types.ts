import type { FeatureId, ProfileId, ContrastMode } from '../types/index.js';

export interface Translation {
  title: string;
  close: string;
  reset: string;
  resetDone: string;
  profiles: { h: string } & Record<ProfileId, string>;
  features: { h: string } & Record<FeatureId, string>;
  /**
   * Optional per-feature descriptions shown as tooltip / aria-describedby.
   * Not all locales must fully translate these; consumers fall back to
   * English when a key is missing. Keeping this decoupled from `features`
   * avoids forcing 17×28 brand-new translations on every locale.
   */
  featureDescriptions?: Partial<Record<FeatureId, string>>;
  values: { off: string; on: string; step: string };
  contrastLabels: Record<ContrastMode, string>;
  aria: {
    dialog: string;
    switch: string;
    triggerLabel: string;
    dragHandle: string;
    oversized: string;
    language: string;
    info: string;
  };
  disclaimer: string;
  statementLink: string;
}
