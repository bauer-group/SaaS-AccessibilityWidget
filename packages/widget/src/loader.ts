/*!
 * BFSG Accessibility Widget — Loader (IIFE, ~4 KB gzip)
 * License: MIT — © BAUER GROUP
 *
 * Responsibilities:
 *   1. Read persisted preferences and apply them BEFORE first paint (no FOUAC).
 *   2. Inject critical CSS for data-attribute based features.
 *   3. Render the FAB (Floating Action Button).
 *   4. Lazy-load the core bundle on first user intent (click / keyboard shortcut).
 *
 * Does NOT import from /shared — everything must be inlined to keep the bundle tiny.
 */
import type { WidgetConfig, WidgetState, Locale } from './types/index.js';
import { buildCriticalCss } from './styles/critical.js';

type CoreApi = NonNullable<Window['AccessibilityWidgetCore']>;

const cfg: Required<
  Pick<
    WidgetConfig,
    | 'corePath'
    | 'cssPath'
    | 'position'
    | 'storageKey'
    | 'respectReducedMotion'
    | 'primaryColor'
    | 'hideOnPrint'
    | 'debug'
  >
> & { locale: Locale | 'auto'; coreIntegrity: string | null; buttonLabel: string | null } = {
  corePath: window.AccessibilityWidgetConfig?.corePath ?? '/accessibility-widget/accessibility-widget-core.min.js',
  cssPath: window.AccessibilityWidgetConfig?.cssPath ?? '/accessibility-widget/accessibility-widget.min.css',
  position: window.AccessibilityWidgetConfig?.position ?? 'bottom-right',
  storageKey: window.AccessibilityWidgetConfig?.storageKey ?? 'accessibility-widget',
  respectReducedMotion: window.AccessibilityWidgetConfig?.respectReducedMotion ?? true,
  primaryColor: window.AccessibilityWidgetConfig?.primaryColor ?? '#0058a3',
  hideOnPrint: window.AccessibilityWidgetConfig?.hideOnPrint ?? true,
  debug: Boolean(window.AccessibilityWidgetConfig?.debug),
  locale: window.AccessibilityWidgetConfig?.locale ?? 'auto',
  coreIntegrity: window.AccessibilityWidgetConfig?.coreIntegrity ?? null,
  buttonLabel: window.AccessibilityWidgetConfig?.buttonLabel ?? null,
};

const LABELS: Record<Locale, string> = {
  de: 'Barrierefreiheit einstellen',
  en: 'Accessibility settings',
  fr: 'Réglages d’accessibilité',
  es: 'Ajustes de accesibilidad',
  it: 'Impostazioni di accessibilità',
  pl: 'Ustawienia dostępności',
  tr: 'Erişilebilirlik ayarları',
  ar: 'إعدادات إمكانية الوصول',
};

if (window.__accessibilityWidgetLoaded) {
  // Idempotent: a second loader tag is a no-op.
} else {
  window.__accessibilityWidgetLoaded = true;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

function boot(): void {
  injectCriticalCSS();
  applyPersistedPreferences();
  renderFab();
  if (hasPersistedSettings()) {
    // user has settings → warm core in idle time so next open is instant
    const idle = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(cb, { timeout: 2000 });
      else setTimeout(cb, 1000);
    };
    idle(() => {
      loadCore().catch(() => {
        /* silent — user can click FAB to retry */
      });
    });
  }
}

function detectLocale(): Locale {
  if (cfg.locale !== 'auto') return cfg.locale;
  const htmlLang = (document.documentElement.lang || '').toLowerCase();
  const candidate = (htmlLang || (navigator.language ?? 'en').toLowerCase()).split(/[-_]/)[0];
  return isSupportedLocale(candidate) ? candidate : 'de';
}

function isSupportedLocale(x: string | undefined): x is Locale {
  return Boolean(x) && x! in LABELS;
}

function readState(): WidgetState | null {
  try {
    const raw = localStorage.getItem(cfg.storageKey);
    return raw ? (JSON.parse(raw) as WidgetState) : null;
  } catch (err) {
    if (cfg.debug) console.warn('[aw] loader.readState failed', err);
    return null;
  }
}

function hasPersistedSettings(): boolean {
  const s = readState();
  return Boolean(s?.features && Object.values(s.features).some(Boolean));
}

function applyPersistedPreferences(): void {
  const s = readState();
  if (!s?.features) return;
  const html = document.documentElement;
  html.setAttribute('data-aw-instant', '1');
  if (typeof s.fontSizeLevel === 'number')
    html.style.setProperty('--aw-font-scale', String(s.fontSizeLevel));
  if (typeof s.lineHeightLevel === 'number')
    html.style.setProperty('--aw-line-height', String(s.lineHeightLevel));
  if (typeof s.letterSpacingLevel === 'number')
    html.style.setProperty('--aw-letter-spacing', `${s.letterSpacingLevel}em`);
  const f = s.features;
  if (f.contrast) html.setAttribute('data-aw-contrast', s.contrastMode ?? 'high');
  if (f.grayscale) html.setAttribute('data-aw-grayscale', '1');
  if (f.invertColors) html.setAttribute('data-aw-invert', '1');
  if (f.dyslexiaFont) html.setAttribute('data-aw-dyslexia', '1');
  if (f.highlightLinks) html.setAttribute('data-aw-highlight-links', '1');
  if (f.pauseAnimations) html.setAttribute('data-aw-pause-animations', '1');
  if (f.bigCursor) html.setAttribute('data-aw-big-cursor', '1');
  if (f.focusOutline) html.setAttribute('data-aw-focus', '1');
}

function injectCriticalCSS(): void {
  if (document.getElementById('aw-critical-css')) return;
  const css = buildCriticalCss(cfg.primaryColor, cfg.hideOnPrint);
  const style = document.createElement('style');
  style.id = 'aw-critical-css';
  style.textContent = css;
  (document.head ?? document.documentElement).appendChild(style);
}

function renderFab(): void {
  const locale = detectLocale();
  const label = cfg.buttonLabel ?? LABELS[locale];

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `aw-fab aw-fab--${cfg.position}`;
  btn.setAttribute('aria-label', label);
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-controls', 'aw-panel');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('data-aw-fab', '1');

  // Inline SVG person-icon — programmatic, no innerHTML.
  const svgNs = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(svgNs, 'path');
  path.setAttribute(
    'd',
    'M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-6 5 6 2 6-2 .5 1.8L13 10.2v3.2l3.2 7.4-1.7.8L12 15l-2.5 6.6-1.7-.8L11 13.4V10.2L5.5 8.8 6 7z',
  );
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);
  btn.appendChild(svg);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    loadCore()
      .then((core) => {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.setAttribute('aria-expanded', 'true');
        core.open({
          trigger: btn,
          config: window.AccessibilityWidgetConfig,
          locale,
        });
      })
      .catch((err) => {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        if (cfg.debug) console.error('[bfsg] Core load failed:', err);
      });
  });

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      btn.click();
    }
  });

  document.body.appendChild(btn);
}

let corePromise: Promise<CoreApi> | null = null;
function loadCore(): Promise<CoreApi> {
  if (corePromise) return corePromise;
  if (cfg.cssPath && !document.querySelector('link[data-aw-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cfg.cssPath;
    link.setAttribute('data-aw-css', '1');
    document.head.appendChild(link);
  }
  corePromise = new Promise<CoreApi>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = cfg.corePath;
    s.async = true;
    s.defer = true;
    if (cfg.coreIntegrity) {
      s.integrity = cfg.coreIntegrity;
      s.crossOrigin = 'anonymous';
    }
    s.onload = () => {
      if (window.AccessibilityWidgetCore) resolve(window.AccessibilityWidgetCore);
      else reject(new Error('Core loaded but AccessibilityWidgetCore is undefined'));
    };
    s.onerror = () => reject(new Error(`Failed to load ${cfg.corePath}`));
    document.head.appendChild(s);
  });
  return corePromise;
}

const publicApi = {
  open(opts?: Parameters<CoreApi['open']>[0]): Promise<void> {
    return loadCore().then((c) => c.open(opts ?? {}));
  },
  close(): void {
    window.AccessibilityWidgetCore?.close();
  },
  reset(): void {
    try {
      localStorage.removeItem(cfg.storageKey);
    } catch (err) {
      if (cfg.debug) console.warn('[aw] loader.reset clear failed', err);
    }
    location.reload();
  },
  set(id: string, value: unknown): Promise<void> {
    return loadCore().then((c) => c.set(id, value));
  },
  getState(): WidgetState | null {
    return readState();
  },
  version: '1.0.0-alpha.1',
};

window.AccessibilityWidget = publicApi;
