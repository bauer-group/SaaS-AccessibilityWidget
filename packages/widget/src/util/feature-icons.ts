/**
 * Lucide-based pictograms for widget features and UI controls.
 *
 * All paths are taken from Lucide (https://lucide.dev, ISC license) and
 * rendered via our programmatic buildIcon() — never innerHTML — so there is
 * no XSS surface. Only the raw `d` data is shipped, no runtime dependency.
 *
 * Convention: every icon uses the shared 24x24 Lucide viewBox and
 * `stroke: true`, which lets <svg> itself carry the stroke defaults
 * (fill:none, stroke:currentColor, stroke-width:2, round caps) — path
 * definitions therefore stay minimal and compress well under gzip.
 *
 * This module is imported ONLY from the panel (core bundle).
 * The loader bundle never pulls it in, keeping the initial FAB payload tiny.
 */
import type { FeatureId } from '../types/index.js';
import type { SvgIconOptions } from './svg.js';

export const FEATURE_ICONS: Record<FeatureId, SvgIconOptions> = {
  fontSize: {
    stroke: true,
    paths: [{ d: 'M4 7V4h16v3M9 20h6M12 4v16' }],
  },
  lineHeight: {
    stroke: true,
    paths: [{ d: 'M3 6h18M3 12h18M3 18h18' }],
  },
  letterSpacing: {
    stroke: true,
    paths: [{ d: 'M18 8l4 4-4 4M2 12h20M6 8l-4 4 4 4' }],
  },
  contrast: {
    stroke: true,
    paths: [
      { d: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
      { d: 'M12 2a10 10 0 0 1 0 20z', fill: 'currentColor' },
    ],
  },
  grayscale: {
    stroke: true,
    paths: [
      {
        d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z',
      },
    ],
  },
  invertColors: {
    stroke: true,
    paths: [{ d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z' }],
  },
  dyslexiaFont: {
    stroke: true,
    paths: [
      { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
      { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
    ],
  },
  highlightLinks: {
    stroke: true,
    paths: [
      { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' },
      { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' },
    ],
  },
  pauseAnimations: {
    stroke: true,
    paths: [{ d: 'M6 4h4v16H6zM14 4h4v16h-4z' }],
  },
  bigCursor: {
    stroke: true,
    paths: [{ d: 'M4 4l7.07 17 2.51-7.39L21 11.07z' }],
  },
  focusOutline: {
    stroke: true,
    paths: [
      { d: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
      {
        d: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2',
      },
    ],
  },
  readingMask: {
    stroke: true,
    paths: [
      {
        d: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10',
      },
    ],
  },
  readingGuide: {
    stroke: true,
    paths: [{ d: 'M21 12H3M6 8v8M18 8v8' }],
  },
  tts: {
    stroke: true,
    paths: [
      {
        d: 'M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4A.7.7 0 0 0 11 19.3z',
      },
      { d: 'M16 9a5 5 0 0 1 0 6' },
      { d: 'M19.36 18.36a9 9 0 0 0 0-12.72' },
    ],
  },
  structureNav: {
    stroke: true,
    paths: [{ d: 'M21 12h-8M21 6H8M21 18h-8M3 6v4c0 1.1.9 2 2 2h3M3 10v6c0 1.1.9 2 2 2h3' }],
  },
};

/** Reset / undo (Lucide: rotate-ccw). */
export const ICON_RESET: SvgIconOptions = {
  stroke: true,
  paths: [{ d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5' }],
};

/** Info / tooltip trigger (Lucide: info). */
export const ICON_INFO: SvgIconOptions = {
  stroke: true,
  paths: [
    { d: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
    { d: 'M12 16v-4' },
    { d: 'M12 8h.01' },
  ],
};

/** Globe / language switcher (Lucide: globe). */
export const ICON_GLOBE: SvgIconOptions = {
  stroke: true,
  paths: [
    { d: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
    { d: 'M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20' },
  ],
};

/** Oversized mode (Lucide: maximize-2). */
export const ICON_MAXIMIZE: SvgIconOptions = {
  stroke: true,
  paths: [{ d: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' }],
};

/** Collapsible section chevron (Lucide: chevron-down). */
export const ICON_CHEVRON: SvgIconOptions = {
  stroke: true,
  paths: [{ d: 'm6 9 6 6 6-6' }],
};

/** Drag handle (Lucide: grip-horizontal) — filled dots. */
export const ICON_GRIP: SvgIconOptions = {
  circles: [
    { cx: 9, cy: 5, r: 1 },
    { cx: 9, cy: 12, r: 1 },
    { cx: 9, cy: 19, r: 1 },
    { cx: 15, cy: 5, r: 1 },
    { cx: 15, cy: 12, r: 1 },
    { cx: 15, cy: 19, r: 1 },
  ],
};

/** Active state check mark (Lucide: check). */
export const ICON_CHECK: SvgIconOptions = {
  stroke: true,
  paths: [{ d: 'M20 6 9 17l-5-5' }],
};
