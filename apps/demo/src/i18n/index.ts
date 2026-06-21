import { en } from './en';
import { de } from './de';

/**
 * The page-chrome dictionary shape. English is the canonical source of keys
 * (it is also the fallback), so the `Dict` type is derived from `en`. The
 * German dictionary is declared `: Dict`, which makes a missing or extra key a
 * compile-time `typecheck` error — DE/EN parity is enforced, not hoped for.
 *
 * NOTE: This is the *page* language (marketing chrome + legal pages). It is
 * deliberately independent of the *widget* locale (28 languages, driven by the
 * `#locale-select` control and the widget's own runtime API).
 */
export type Dict = typeof en;

export type PageLang = 'de' | 'en';

const DICTS: Record<PageLang, Dict> = { en, de };

export const PAGE_LANG_KEY = 'aw-page-lang';

/**
 * localStorage → navigator.language → English.
 *
 * English is the fallback for every unknown browser language; only an explicit
 * stored choice or a `de*` browser language yields German. Kept in sync with
 * the inline `<head>` bootstrap in the HTML files (which cloaks `de` to avoid
 * a flash of English before this module runs).
 */
export function detectLang(): PageLang {
  try {
    const stored = localStorage.getItem(PAGE_LANG_KEY);
    if (stored === 'de' || stored === 'en') return stored;
  } catch {
    /* private mode / disabled storage — fall through to navigator */
  }
  const nav = (navigator.language || '').toLowerCase().split('-')[0];
  return nav === 'de' ? 'de' : 'en';
}

/** Resolve a dotted key path (`'hero.title'`) against a dictionary object. */
function resolve(dict: Dict, path: string): string | undefined {
  let node: unknown = dict;
  for (const part of path.split('.')) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === 'string' ? node : undefined;
}

let current: PageLang = 'en';

export function getLang(): PageLang {
  return current;
}

/** Look up a single string in the active dictionary (page-language). */
export function t(path: string): string {
  return resolve(DICTS[current], path) ?? path;
}

/**
 * Apply a language to the whole document: text nodes (`data-i18n`), trusted
 * HTML fragments (`data-i18n-html`), attributes (`data-i18n-attr="attr:key"`),
 * `<title>`, `<html lang>`, the toggle's pressed state, and finally un-cloak.
 *
 * The dictionary is trusted, build-time content (no user input), so
 * `innerHTML` for `data-i18n-html` is safe here.
 */
export function applyI18n(lang: PageLang): void {
  current = lang;
  const dict = DICTS[lang];
  const root = document.documentElement;

  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const value = resolve(dict, el.dataset.i18n ?? '');
    if (value !== undefined) el.textContent = value;
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-html]')) {
    const value = resolve(dict, el.dataset.i18nHtml ?? '');
    if (value !== undefined) el.innerHTML = value;
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-attr]')) {
    // Format: "aria-label:nav.home" or "title:a;aria-label:b"
    for (const pair of (el.dataset.i18nAttr ?? '').split(';')) {
      const idx = pair.indexOf(':');
      if (idx < 0) continue;
      const attr = pair.slice(0, idx).trim();
      const value = resolve(dict, pair.slice(idx + 1).trim());
      if (attr && value !== undefined) el.setAttribute(attr, value);
    }
  }

  const title = resolve(dict, 'meta.title');
  if (title) document.title = title;
  root.lang = lang;

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  }

  root.classList.remove('i18n-cloak');
}

/** Persist + apply a language without reloading. */
export function setLang(lang: PageLang): void {
  try {
    localStorage.setItem(PAGE_LANG_KEY, lang);
  } catch {
    /* ignore */
  }
  applyI18n(lang);
}

/** Wire the `[data-lang]` toggle buttons. Idempotent per element. */
export function wireLangToggle(): void {
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === 'de' || lang === 'en') setLang(lang);
    });
  }
}
