const SVG_NS = 'http://www.w3.org/2000/svg';

export interface SvgPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}

export interface SvgCircle {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
}

export interface SvgIconOptions {
  viewBox?: string;
  width?: number;
  height?: number;
  paths?: readonly SvgPath[];
  circles?: readonly SvgCircle[];
  /**
   * Lucide-style outline icon. Applies fill:none, stroke:currentColor,
   * stroke-width:2, round caps/joins at the <svg> root, so individual
   * paths/circles don't need to repeat these attributes.
   */
  stroke?: boolean;
  ariaHidden?: boolean;
}

/**
 * Build an SVG element programmatically — no innerHTML, no DOMParser,
 * so no XSS surface even if path data ever comes from config.
 */
export function buildIcon(opts: SvgIconOptions): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', opts.viewBox ?? '0 0 24 24');
  if (opts.width !== undefined) svg.setAttribute('width', String(opts.width));
  if (opts.height !== undefined) svg.setAttribute('height', String(opts.height));
  if (opts.ariaHidden !== false) svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const strokeMode = Boolean(opts.stroke);
  if (strokeMode) {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
  }

  for (const p of opts.paths ?? []) {
    const el = document.createElementNS(SVG_NS, 'path');
    el.setAttribute('d', p.d);
    if (p.fill !== undefined) el.setAttribute('fill', p.fill);
    else if (!strokeMode) el.setAttribute('fill', 'currentColor');
    if (p.stroke !== undefined) el.setAttribute('stroke', p.stroke);
    if (p.strokeWidth !== undefined) el.setAttribute('stroke-width', String(p.strokeWidth));
    svg.appendChild(el);
  }
  for (const c of opts.circles ?? []) {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('cx', String(c.cx));
    el.setAttribute('cy', String(c.cy));
    el.setAttribute('r', String(c.r));
    if (c.fill !== undefined) el.setAttribute('fill', c.fill);
    else if (!strokeMode) el.setAttribute('fill', 'currentColor');
    if (c.stroke !== undefined) el.setAttribute('stroke', c.stroke);
    if (c.strokeWidth !== undefined) el.setAttribute('stroke-width', String(c.strokeWidth));
    svg.appendChild(el);
  }
  return svg;
}

/** Accessibility person icon (BFSG signature icon). */
export const ICON_ACCESSIBILITY: SvgIconOptions = {
  viewBox: '0 0 24 24',
  paths: [
    {
      d: 'M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-6 5 6 2 6-2 .5 1.8L13 10.2v3.2l3.2 7.4-1.7.8L12 15l-2.5 6.6-1.7-.8L11 13.4V10.2L5.5 8.8 6 7z',
    },
  ],
};

/** Close / X icon (Lucide: x). */
export const ICON_CLOSE: SvgIconOptions = {
  viewBox: '0 0 24 24',
  stroke: true,
  paths: [{ d: 'M18 6 6 18M6 6l12 12' }],
};
