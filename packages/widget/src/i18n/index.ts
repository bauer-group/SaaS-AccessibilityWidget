import type { Locale } from '../types/index.js';
import type { Translation } from './types.js';

// Original 8
import { de } from './de.js';
import { en } from './en.js';
import { fr } from './fr.js';
import { es } from './es.js';
import { it } from './it.js';
import { pl } from './pl.js';
import { tr } from './tr.js';
import { ar } from './ar.js';
// Added (all ≥ 8M speakers)
import { zh } from './zh.js';
import { hi } from './hi.js';
import { pt } from './pt.js';
import { bn } from './bn.js';
import { ru } from './ru.js';
import { ja } from './ja.js';
import { ko } from './ko.js';
import { vi } from './vi.js';
import { fa } from './fa.js';
import { ur } from './ur.js';
import { th } from './th.js';
import { id } from './id.js';
import { he } from './he.js';
import { nl } from './nl.js';
import { sv } from './sv.js';
import { cs } from './cs.js';
import { el } from './el.js';
import { hu } from './hu.js';
import { ro } from './ro.js';
import { uk } from './uk.js';

export const translations: Record<Locale, Translation> = {
  de, en, fr, es, it, pl, tr, ar,
  zh, hi, pt, bn, ru, ja, ko, vi, fa, ur, th, id, he, nl, sv, cs, el, hu, ro, uk,
};

export function t(locale: Locale): Translation {
  return translations[locale] ?? translations.en;
}

export type { Translation };
