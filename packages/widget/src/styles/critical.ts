/**
 * Critical CSS inlined by the loader. Kept minimal so the loader stays ~4 KB gzip.
 * Uses only `data-aw-*` attributes on <html>, never touches host DOM.
 *
 * The primaryColor is interpolated at runtime so brands can theme without a build step.
 */
export function buildCriticalCss(primaryColor: string, hideOnPrint: boolean): string {
  return (
    // base CSS variables
    'html[data-aw-instant]{--aw-font-scale:1;--aw-line-height:1.5;--aw-letter-spacing:0em}' +
    // typography applied via rem-safe inheritance
    'html[data-aw-instant] body,html[data-aw-instant] p,html[data-aw-instant] li,html[data-aw-instant] td,html[data-aw-instant] span,html[data-aw-instant] a,html[data-aw-instant] button,html[data-aw-instant] input,html[data-aw-instant] textarea{font-size:calc(1em * var(--aw-font-scale));line-height:var(--aw-line-height);letter-spacing:var(--aw-letter-spacing)}' +
    // contrast modes (filter-only — no DOM mutation)
    'html[data-aw-contrast="high"]{filter:contrast(1.35)}' +
    'html[data-aw-contrast="dark"]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-aw-contrast="dark"] img,html[data-aw-contrast="dark"] video,html[data-aw-contrast="dark"] picture{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-aw-contrast="invert"]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-aw-grayscale]{filter:grayscale(1)}' +
    'html[data-aw-invert]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-aw-invert] img,html[data-aw-invert] video{filter:invert(1) hue-rotate(180deg)}' +
    // dyslexia
    'html[data-aw-dyslexia] *{font-family:"OpenDyslexic","Comic Sans MS",sans-serif!important}' +
    // links
    'html[data-aw-highlight-links] a{text-decoration:underline!important;outline:2px solid #ffeb3b!important;background:#fffde7!important;color:#000!important}' +
    // motion
    'html[data-aw-pause-animations] *,html[data-aw-pause-animations] *::before,html[data-aw-pause-animations] *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' +
    // big cursor (embedded SVG — no extra request)
    'html[data-aw-big-cursor],html[data-aw-big-cursor] *{cursor:url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><path d=%22M6 4 L42 24 L26 28 L22 44 Z%22 fill=%22%23000%22 stroke=%22%23fff%22 stroke-width=%222%22/></svg>") 0 0,auto!important}' +
    // thick focus
    'html[data-aw-focus] *:focus,html[data-aw-focus] *:focus-visible{outline:4px solid #ff6a00!important;outline-offset:2px!important}' +
    // FAB
    `.aw-fab{position:fixed;width:48px;height:48px;border-radius:50%;background:${primaryColor};color:#fff;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2147483646;padding:0;transition:transform .15s}` +
    '.aw-fab:hover,.aw-fab:focus-visible{outline:3px solid #ff6a00;outline-offset:2px;transform:scale(1.05)}' +
    '.aw-fab svg{width:28px;height:28px;fill:currentColor}' +
    '.aw-fab--bottom-right{bottom:20px;right:20px}' +
    '.aw-fab--bottom-left{bottom:20px;left:20px}' +
    '.aw-fab--top-right{top:20px;right:20px}' +
    '.aw-fab--top-left{top:20px;left:20px}' +
    (hideOnPrint ? '@media print{.aw-fab{display:none!important}}' : '') +
    '@media (prefers-reduced-motion:reduce){.aw-fab{transition:none}}'
  );
}
