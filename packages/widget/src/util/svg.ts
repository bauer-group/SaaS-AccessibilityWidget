const SVG_NS = 'http://www.w3.org/2000/svg';

export interface SvgIconOptions {
  viewBox?: string;
  width?: number;
  height?: number;
  paths: readonly SvgPath[];
  ariaHidden?: boolean;
}

export interface SvgPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
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

  for (const p of opts.paths) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', p.d);
    if (p.fill !== undefined) path.setAttribute('fill', p.fill);
    else path.setAttribute('fill', 'currentColor');
    if (p.stroke !== undefined) path.setAttribute('stroke', p.stroke);
    if (p.strokeWidth !== undefined) path.setAttribute('stroke-width', String(p.strokeWidth));
    svg.appendChild(path);
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

/** Close / X icon. */
export const ICON_CLOSE: SvgIconOptions = {
  viewBox: '0 0 24 24',
  paths: [
    {
      d: 'M6 6l12 12M18 6 6 18',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
    },
  ],
};
