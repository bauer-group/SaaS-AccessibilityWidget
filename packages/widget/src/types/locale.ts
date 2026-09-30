export const SUPPORTED_LOCALES = [
  // Original set (≥ 8M speakers, EU focus)
  'de',
  'en',
  'fr',
  'es',
  'it',
  'pl',
  'tr',
  'ar',
  // Added: all remaining languages with ≥ 8M speakers whose scripts render
  // reliably with standard system fonts on current browsers.
  'zh', // Mandarin Chinese (Simplified)
  'hi', // Hindi
  'pt', // Portuguese
  'bn', // Bengali
  'ru', // Russian
  'ja', // Japanese
  'ko', // Korean
  'vi', // Vietnamese
  'fa', // Persian / Farsi (RTL)
  'ur', // Urdu (RTL)
  'th', // Thai
  'id', // Indonesian (covers Malay speakers via Bahasa)
  'he', // Hebrew (RTL)
  'nl', // Dutch
  'sv', // Swedish
  'cs', // Czech
  'el', // Greek
  'hu', // Hungarian
  'ro', // Romanian
  'uk', // Ukrainian
  'lv', // Latvian
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Right-to-left locales. Used by the panel renderer to set `dir="rtl"`.
 * Keep in sync with the list of locales we ship translations for.
 */
export const RTL_LOCALES: readonly Locale[] = ['ar', 'fa', 'ur', 'he'];

export function isRtl(locale: Locale): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(input: string | undefined | null, fallback: Locale = 'de'): Locale {
  if (!input) return fallback;
  const prefix = input.toLowerCase().split(/[-_]/)[0];
  return prefix && isLocale(prefix) ? prefix : fallback;
}
