import type { FeatureId, ProfileId, ContrastMode } from '../types/index.js';

export interface Translation {
  title: string;
  close: string;
  reset: string;
  resetDone: string;
  profiles: { h: string } & Record<ProfileId, string>;
  features: { h: string } & Record<FeatureId, string>;
  values: { off: string; on: string; step: string };
  contrastLabels: Record<ContrastMode, string>;
  aria: { dialog: string; switch: string; triggerLabel: string };
  disclaimer: string;
  statementLink: string;
}
