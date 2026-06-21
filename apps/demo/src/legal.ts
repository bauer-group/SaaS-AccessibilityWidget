/**
 * Entry for the legal pages (accessibility statement + Impressum). They share
 * the site's design system (`styles.css`, linked in the HTML) and the page
 * i18n module, so the same DE/EN toggle and English fallback apply here.
 */
import { applyI18n, detectLang, wireLangToggle } from './i18n';

document.addEventListener('DOMContentLoaded', () => {
  applyI18n(detectLang());
  wireLangToggle();
});
