/**
 * Native language labels for the runtime language switcher.
 *
 * Each entry is the language's endonym (its own native name), not a localized
 * translation. Showing "Deutsch" to a Japanese reader is more useful than
 * "German" — the user who needs German will recognise their own word for it.
 *
 * The autonym pattern also sidesteps N×N translation matrices.
 */
import type { Locale } from '../types/index.js';

export const LANGUAGE_NAMES: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  tr: 'Türkçe',
  ar: 'العربية',
  zh: '中文',
  hi: 'हिन्दी',
  pt: 'Português',
  bn: 'বাংলা',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  vi: 'Tiếng Việt',
  fa: 'فارسی',
  ur: 'اردو',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  he: 'עברית',
  nl: 'Nederlands',
  sv: 'Svenska',
  cs: 'Čeština',
  el: 'Ελληνικά',
  hu: 'Magyar',
  ro: 'Română',
  uk: 'Українська',
  lv: 'Latviešu',
};
