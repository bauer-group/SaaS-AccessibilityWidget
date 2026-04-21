import { describe, it, expect } from 'vitest';
import { translations, t } from '../src/i18n/index.js';
import { FEATURE_IDS, PROFILE_IDS, CONTRAST_MODES, SUPPORTED_LOCALES } from '../src/types/index.js';

describe('i18n completeness', () => {
  it('provides translations for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(translations[locale]).toBeDefined();
    }
  });

  it('every locale has all feature labels', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const T = t(locale);
      for (const id of FEATURE_IDS) {
        expect(T.features[id], `${locale}.features.${id}`).toBeTruthy();
      }
      for (const id of PROFILE_IDS) {
        expect(T.profiles[id], `${locale}.profiles.${id}`).toBeTruthy();
      }
      for (const mode of CONTRAST_MODES) {
        expect(T.contrastLabels[mode], `${locale}.contrastLabels.${mode}`).toBeTruthy();
      }
    }
  });
});
