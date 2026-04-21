export const SUPPORTED_LOCALES = ['de', 'en', 'fr', 'es', 'it', 'pl', 'tr', 'ar'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(input: string | undefined | null, fallback: Locale = 'de'): Locale {
  if (!input) return fallback;
  const prefix = input.toLowerCase().split(/[-_]/)[0];
  return prefix && isLocale(prefix) ? prefix : fallback;
}
