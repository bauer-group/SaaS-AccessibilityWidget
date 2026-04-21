import type { Locale } from '../types/index.js';

const LOCALE_TO_BCP47: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pl: 'pl-PL',
  tr: 'tr-TR',
  ar: 'ar-SA',
};

let active = false;
let utter: SpeechSynthesisUtterance | null = null;

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function ttsActive(): boolean {
  return active;
}

export function ttsStart(text: string, locale: Locale, rate = 1.0): boolean {
  if (!ttsSupported() || !text.trim()) return false;
  ttsStop();
  utter = new SpeechSynthesisUtterance(text);
  utter.lang = LOCALE_TO_BCP47[locale];
  utter.rate = rate;
  utter.onend = () => {
    active = false;
  };
  utter.onerror = () => {
    active = false;
  };
  active = true;
  window.speechSynthesis.speak(utter);
  return true;
}

export function ttsStop(): void {
  if (ttsSupported()) window.speechSynthesis.cancel();
  active = false;
  utter = null;
}

export function collectReadableText(root: Element = document.body, limit = 4000): string {
  const excluded = 'script,style,noscript,[aria-hidden="true"],[data-aw-panel],[data-aw-fab]';
  const clone = root.cloneNode(true) as Element;
  clone.querySelectorAll(excluded).forEach((n) => n.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}
