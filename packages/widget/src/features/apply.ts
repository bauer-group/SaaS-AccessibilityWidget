import type { WidgetState } from '../types/index.js';
import { toggleAttr } from '../util/dom.js';
import { readingMaskApply } from './reading-mask.js';
import { readingGuideApply } from './reading-guide.js';

const HTML_ATTR = {
  contrast: 'data-bfsg-contrast',
  grayscale: 'data-bfsg-grayscale',
  invert: 'data-bfsg-invert',
  dyslexia: 'data-bfsg-dyslexia',
  highlight: 'data-bfsg-highlight-links',
  pauseAnim: 'data-bfsg-pause-animations',
  bigCursor: 'data-bfsg-big-cursor',
  focus: 'data-bfsg-focus',
} as const;

export function applyState(state: WidgetState): void {
  const html = document.documentElement;
  html.setAttribute('data-bfsg-instant', '1');

  html.style.setProperty('--bfsg-font-scale', String(state.fontSizeLevel));
  html.style.setProperty('--bfsg-line-height', String(state.lineHeightLevel));
  html.style.setProperty('--bfsg-letter-spacing', `${state.letterSpacingLevel}em`);

  const f = state.features;
  toggleAttr(html, HTML_ATTR.contrast, f.contrast ? state.contrastMode : false);
  toggleAttr(html, HTML_ATTR.grayscale, f.grayscale ? '1' : false);
  toggleAttr(html, HTML_ATTR.invert, f.invertColors ? '1' : false);
  toggleAttr(html, HTML_ATTR.dyslexia, f.dyslexiaFont ? '1' : false);
  toggleAttr(html, HTML_ATTR.highlight, f.highlightLinks ? '1' : false);
  toggleAttr(html, HTML_ATTR.pauseAnim, f.pauseAnimations ? '1' : false);
  toggleAttr(html, HTML_ATTR.bigCursor, f.bigCursor ? '1' : false);
  toggleAttr(html, HTML_ATTR.focus, f.focusOutline ? '1' : false);

  readingMaskApply(f.readingMask);
  readingGuideApply(f.readingGuide);
}
