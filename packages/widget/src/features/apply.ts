import type { WidgetState } from '../types/index.js';
import { toggleAttr } from '../util/dom.js';
import { readingMaskApply } from './reading-mask.js';
import { readingGuideApply } from './reading-guide.js';

const HTML_ATTR = {
  contrast: 'data-aw-contrast',
  grayscale: 'data-aw-grayscale',
  invert: 'data-aw-invert',
  dyslexia: 'data-aw-dyslexia',
  highlight: 'data-aw-highlight-links',
  pauseAnim: 'data-aw-pause-animations',
  bigCursor: 'data-aw-big-cursor',
  focus: 'data-aw-focus',
} as const;

export function applyState(state: WidgetState): void {
  const html = document.documentElement;
  html.setAttribute('data-aw-instant', '1');

  html.style.setProperty('--aw-font-scale', String(state.fontSizeLevel));
  html.style.setProperty('--aw-line-height', String(state.lineHeightLevel));
  html.style.setProperty('--aw-letter-spacing', `${state.letterSpacingLevel}em`);

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
