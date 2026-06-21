/**
 * Shared page chrome (topbar + footer). Rather than copy-pasting the nav and
 * footer into seven HTML files, this overwrites the `.topbar__inner` /
 * `.footer__inner` containers on load so the navigation IA, branding and footer
 * live in ONE place. The static HTML in each page stays as a no-JS fallback.
 *
 * Markup is trusted, build-time content (no user input) — innerHTML is safe
 * here, the same contract as src/i18n's `data-i18n-html`.
 *
 * Call BEFORE applyI18n() (so the injected [data-i18n] nodes get localized) and
 * before wireLangToggle() (so the freshly-created [data-lang] buttons get wired).
 */

const GITHUB_URL = 'https://github.com/bauer-group/SaaS-AccessibilityWidget';
const NPM_URL = 'https://www.npmjs.com/package/@bauer-group/accessibility-widget';

/** Primary navigation — single source of truth for order + labels. */
const NAV: ReadonlyArray<{ page: string; href: string; key: string }> = [
  { page: 'home', href: '/', key: 'nav.home' },
  { page: 'playground', href: '/playground.html', key: 'nav.playground' },
  { page: 'configuration', href: '/configuration.html', key: 'nav.configuration' },
  { page: 'api', href: '/api.html', key: 'nav.api' },
  { page: 'events', href: '/events.html', key: 'nav.events' },
];

const LOGO_SVG = `<svg class="topbar__logo" viewBox="-4 -4 32 32" aria-hidden="true" focusable="false" width="28" height="28">
  <rect x="-4" y="-4" width="32" height="32" rx="7" fill="#0058a3" />
  <g fill="none" stroke="#fff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5.5 3-2.36 3.5" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </g>
</svg>`;

function topbarHtml(current: string): string {
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}"${n.page === current ? ' aria-current="page"' : ''} data-i18n="${n.key}"></a>`,
  ).join('');
  return `<a class="topbar__brand" href="/" data-i18n-attr="aria-label:nav.home">
  ${LOGO_SVG}
  <span class="topbar__title"><strong>Accessibility Widget</strong><em>BAUER GROUP</em></span>
</a>
<nav class="topbar__nav" aria-label="Main navigation">${links}</nav>
<div class="topbar__controls">
  <div class="lang-toggle" role="group" data-i18n-attr="aria-label:nav.langLabel" aria-label="Page language">
    <button type="button" data-lang="de" aria-pressed="false" data-i18n-attr="aria-label:nav.langDe">DE</button>
    <button type="button" data-lang="en" aria-pressed="true" data-i18n-attr="aria-label:nav.langEn">EN</button>
  </div>
</div>`;
}

function footerHtml(): string {
  return `<div class="footer__brand">
  <strong>BAUER GROUP</strong> · <span data-i18n="footer.license">AGPL-3.0-only / commercial</span>
  <p class="muted">
    <span data-i18n="footer.versionLabel">Version</span> <code id="widget-version">—</code> ·
    <a href="/accessibility-widget/integrity.txt" data-i18n="footer.sri">SRI hashes</a> ·
    <a href="${NPM_URL}" rel="noopener" data-i18n="footer.npmLink">Source (npm)</a> ·
    <a href="${GITHUB_URL}" rel="noopener" data-i18n="nav.github">GitHub</a>
  </p>
</div>
<div class="footer__meta">
  <p>
    <a href="/barrierefreiheit.html" data-i18n="footer.statement">Accessibility statement</a> ·
    <a href="/impressum.html" data-i18n="footer.impressum">Legal notice</a>
  </p>
</div>`;
}

/** Render the canonical topbar + footer into their containers (overwrites the static fallback). */
export function renderChrome(): void {
  const current = document.body.dataset.page ?? '';
  const top = document.querySelector('.topbar__inner');
  if (top) top.innerHTML = topbarHtml(current);
  const foot = document.querySelector('.footer__inner');
  if (foot) foot.innerHTML = footerHtml();
}
