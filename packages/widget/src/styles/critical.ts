/**
 * Critical CSS inlined by the loader. Kept minimal so the loader stays ~4 KB gzip.
 * Uses only `data-bfsg-*` attributes on <html>, never touches host DOM.
 *
 * The primaryColor is interpolated at runtime so brands can theme without a build step.
 */
export function buildCriticalCss(primaryColor: string, hideOnPrint: boolean): string {
  return (
    // base CSS variables
    'html[data-bfsg-instant]{--bfsg-font-scale:1;--bfsg-line-height:1.5;--bfsg-letter-spacing:0em}' +
    // typography applied via rem-safe inheritance
    'html[data-bfsg-instant] body,html[data-bfsg-instant] p,html[data-bfsg-instant] li,html[data-bfsg-instant] td,html[data-bfsg-instant] span,html[data-bfsg-instant] a,html[data-bfsg-instant] button,html[data-bfsg-instant] input,html[data-bfsg-instant] textarea{font-size:calc(1em * var(--bfsg-font-scale));line-height:var(--bfsg-line-height);letter-spacing:var(--bfsg-letter-spacing)}' +
    // contrast modes (filter-only — no DOM mutation)
    'html[data-bfsg-contrast="high"]{filter:contrast(1.35)}' +
    'html[data-bfsg-contrast="dark"]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-bfsg-contrast="dark"] img,html[data-bfsg-contrast="dark"] video,html[data-bfsg-contrast="dark"] picture{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-bfsg-contrast="invert"]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-bfsg-grayscale]{filter:grayscale(1)}' +
    'html[data-bfsg-invert]{filter:invert(1) hue-rotate(180deg)}' +
    'html[data-bfsg-invert] img,html[data-bfsg-invert] video{filter:invert(1) hue-rotate(180deg)}' +
    // dyslexia
    'html[data-bfsg-dyslexia] *{font-family:"OpenDyslexic","Comic Sans MS",sans-serif!important}' +
    // links
    'html[data-bfsg-highlight-links] a{text-decoration:underline!important;outline:2px solid #ffeb3b!important;background:#fffde7!important;color:#000!important}' +
    // motion
    'html[data-bfsg-pause-animations] *,html[data-bfsg-pause-animations] *::before,html[data-bfsg-pause-animations] *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' +
    // big cursor (embedded SVG — no extra request)
    'html[data-bfsg-big-cursor],html[data-bfsg-big-cursor] *{cursor:url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22 viewBox=%220 0 48 48%22><path d=%22M6 4 L42 24 L26 28 L22 44 Z%22 fill=%22%23000%22 stroke=%22%23fff%22 stroke-width=%222%22/></svg>") 0 0,auto!important}' +
    // thick focus
    'html[data-bfsg-focus] *:focus,html[data-bfsg-focus] *:focus-visible{outline:4px solid #ff6a00!important;outline-offset:2px!important}' +
    // FAB
    `.bfsg-fab{position:fixed;width:48px;height:48px;border-radius:50%;background:${primaryColor};color:#fff;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2147483646;padding:0;transition:transform .15s}` +
    '.bfsg-fab:hover,.bfsg-fab:focus-visible{outline:3px solid #ff6a00;outline-offset:2px;transform:scale(1.05)}' +
    '.bfsg-fab svg{width:28px;height:28px;fill:currentColor}' +
    '.bfsg-fab--bottom-right{bottom:20px;right:20px}' +
    '.bfsg-fab--bottom-left{bottom:20px;left:20px}' +
    '.bfsg-fab--top-right{top:20px;right:20px}' +
    '.bfsg-fab--top-left{top:20px;left:20px}' +
    (hideOnPrint ? '@media print{.bfsg-fab{display:none!important}}' : '') +
    '@media (prefers-reduced-motion:reduce){.bfsg-fab{transition:none}}'
  );
}
