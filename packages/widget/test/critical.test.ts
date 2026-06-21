import { describe, it, expect } from 'vitest';
import { buildCriticalCss } from '../src/styles/critical.js';

const OPTS = {
  primaryColor: '#0058a3',
  hideOnPrint: true,
  offsetX: 24,
  offsetY: 24,
  zIndex: 2147483000,
};

describe('buildCriticalCss', () => {
  it('scales host typography via the font-scale custom property', () => {
    const css = buildCriticalCss(OPTS);
    expect(css).toContain('font-size:calc(1em * var(--aw-font-scale))');
  });

  // Regression: the visionImpaired profile (fontSizeLevel 1.4) used to compound
  // the scale at every nesting level inside the widget's own panel, exploding
  // its layout. The widget roots must reset the typography custom properties so
  // their descendants resolve at scale 1.
  it('keeps the panel and FAB immune to host-page typography scaling', () => {
    const css = buildCriticalCss(OPTS);
    expect(css).toContain(
      '[data-aw-panel],.aw-fab{--aw-font-scale:1;--aw-line-height:1.5;--aw-letter-spacing:0em}',
    );
  });
});
