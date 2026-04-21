import type { Locale } from '../types/index.js';
import { de } from './de.js';
import { en } from './en.js';
import { fr } from './fr.js';
import { es } from './es.js';
import { it } from './it.js';
import { pl } from './pl.js';
import { tr } from './tr.js';
import { ar } from './ar.js';
import type { Translation } from './types.js';

export const translations: Record<Locale, Translation> = { de, en, fr, es, it, pl, tr, ar };

export function t(locale: Locale): Translation {
  return translations[locale] ?? translations.en;
}

export type { Translation };
