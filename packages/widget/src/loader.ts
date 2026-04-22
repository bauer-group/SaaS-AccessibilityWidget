/*!
 * BAUER GROUP Accessibility Widget — Loader (IIFE, ~4 KB gzip)
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
import type { FeatureId, WidgetConfig, WidgetState, Locale } from './types/index.js';
import { buildCriticalCss } from './styles/critical.js';
import {
  onWidgetEvent,
  type WidgetEventMap,
  type WidgetEventName,
} from './util/events.js';

type CoreApi = NonNullable<Window['AccessibilityWidgetCore']>;

const userCfg: WidgetConfig = window.AccessibilityWidgetConfig ?? {};

const cfg = {
  corePath: userCfg.corePath ?? '/accessibility-widget/accessibility-widget-core.min.js',
  cssPath: userCfg.cssPath ?? '/accessibility-widget/accessibility-widget.min.css',
  position: userCfg.position ?? 'bottom-right',
  offset: {
    x: Number.isFinite(userCfg.offset?.x) ? (userCfg.offset!.x as number) : 20,
    y: Number.isFinite(userCfg.offset?.y) ? (userCfg.offset!.y as number) : 20,
  },
  zIndex: Number.isFinite(userCfg.zIndex) ? (userCfg.zIndex as number) : 2_147_483_646,
  storageKey: userCfg.storageKey ?? 'accessibility-widget',
  draggableFab: Boolean(userCfg.draggableFab),
  respectReducedMotion: userCfg.respectReducedMotion ?? true,
  primaryColor: userCfg.primaryColor ?? '#0058a3',
  hideOnPrint: userCfg.hideOnPrint ?? true,
  debug: Boolean(userCfg.debug),
  locale: userCfg.locale ?? 'auto',
  coreIntegrity: userCfg.coreIntegrity ?? null,
  cssIntegrity: userCfg.cssIntegrity ?? null,
  buttonLabel: userCfg.buttonLabel ?? null,
  initialFeatures: userCfg.initialFeatures ?? null,
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
  zh: '无障碍设置',
  hi: 'सुगम्यता सेटिंग्स',
  pt: 'Definições de acessibilidade',
  bn: 'অ্যাক্সেসযোগ্যতা সেটিংস',
  ru: 'Настройки доступности',
  ja: 'アクセシビリティ設定',
  ko: '접근성 설정',
  vi: 'Cài đặt trợ năng',
  fa: 'تنظیمات دسترس‌پذیری',
  ur: 'رسائی کی ترتیبات',
  th: 'การตั้งค่าการเข้าถึง',
  id: 'Pengaturan aksesibilitas',
  he: 'הגדרות נגישות',
  nl: 'Toegankelijkheidsinstellingen',
  sv: 'Tillgänglighetsinställningar',
  cs: 'Nastavení přístupnosti',
  el: 'Ρυθμίσεις προσβασιμότητας',
  hu: 'Akadálymentességi beállítások',
  ro: 'Setări de accesibilitate',
  uk: 'Налаштування доступності',
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
  seedInitialFeaturesIfEmpty();
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
  // Runtime override wins: setLocale() persists the user choice to
  // state.locale and we must honor it here so the FAB aria-label matches
  // the language the panel will render in.
  const stateLocale = readState()?.locale;
  if (typeof stateLocale === 'string' && isSupportedLocale(stateLocale)) return stateLocale;
  if (cfg.locale !== 'auto') return cfg.locale as Locale;
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

/**
 * If the visitor has no persisted state yet and the host declared
 * `initialFeatures`, write that as the initial state. Next-load
 * behavior is identical to a normal returning user — once something
 * is persisted, the persisted state takes over.
 */
function seedInitialFeaturesIfEmpty(): void {
  if (!cfg.initialFeatures) return;
  let existing: string | null;
  try {
    existing = localStorage.getItem(cfg.storageKey);
  } catch {
    return;
  }
  if (existing) return;
  const features: Record<string, boolean> = {};
  for (const [id, on] of Object.entries(cfg.initialFeatures)) {
    features[id] = Boolean(on);
  }
  const seed = {
    features,
    fontSizeLevel: 1,
    lineHeightLevel: 1.5,
    letterSpacingLevel: 0,
    contrastMode: 'off',
  };
  try {
    localStorage.setItem(cfg.storageKey, JSON.stringify(seed));
  } catch (err) {
    if (cfg.debug) console.warn('[aw] loader.seedInitialFeatures failed', err);
  }
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
  const f = s.features as Partial<Record<FeatureId, boolean>>;
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
  const css = buildCriticalCss({
    primaryColor: cfg.primaryColor,
    hideOnPrint: cfg.hideOnPrint,
    offsetX: cfg.offset.x,
    offsetY: cfg.offset.y,
    zIndex: cfg.zIndex,
  });
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
    // Toggle: if the panel is already open, second click closes it.
    // We read aria-expanded off the FAB itself — it's the single source of
    // truth, kept in sync with panel state via the widget's open/close events.
    if (btn.getAttribute('aria-expanded') === 'true') {
      window.AccessibilityWidgetCore?.close();
      return;
    }
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
        });
      })
      .catch((err) => {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        if (cfg.debug) console.error('[aw] Core load failed:', err);
      });
  });

  // Keep FAB's aria-expanded in sync when the panel closes by any route
  // (ESC key, X button, programmatic close via AccessibilityWidget.close()).
  // Without this, the toggle logic above would think the panel is still open.
  onWidgetEvent('close', () => {
    btn.setAttribute('aria-expanded', 'false');
  });
  onWidgetEvent('open', () => {
    btn.setAttribute('aria-expanded', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      btn.click();
    }
  });

  if (cfg.draggableFab) {
    attachDragHandlers(btn);
    applyPersistedFabPosition(btn);
  }

  document.body.appendChild(btn);
}

// ─── FAB drag (opt-in via config.draggableFab) ─────────────────────
// Shift+Arrow moves in 10 px steps (WCAG 2.1.1 — no pointer-only interactions).

function applyPersistedFabPosition(btn: HTMLButtonElement): void {
  const p = readState()?.fabPosition;
  if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) setFabPos(btn, p.x, p.y);
}

function setFabPos(btn: HTMLButtonElement, x: number, y: number): void {
  const size = 48;
  const cx = Math.min(Math.max(0, x), Math.max(0, window.innerWidth - size));
  const cy = Math.min(Math.max(0, y), Math.max(0, window.innerHeight - size));
  btn.setAttribute('data-aw-fab-pos', 'custom');
  btn.style.setProperty('--aw-fab-x', cx + 'px');
  btn.style.setProperty('--aw-fab-y', cy + 'px');
}

function persistFab(x: number, y: number): void {
  try {
    const raw = localStorage.getItem(cfg.storageKey);
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    parsed.fabPosition = { x, y };
    localStorage.setItem(cfg.storageKey, JSON.stringify(parsed));
  } catch (err) {
    if (cfg.debug) console.warn('[aw] persistFab failed', err);
  }
}

function attachDragHandlers(btn: HTMLButtonElement): void {
  btn.style.touchAction = 'none';
  btn.style.cursor = 'grab';
  let pid = -1;
  let sx = 0;
  let sy = 0;
  let bx = 0;
  let by = 0;
  let moved = false;

  btn.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    pid = e.pointerId;
    sx = e.clientX;
    sy = e.clientY;
    const r = btn.getBoundingClientRect();
    bx = r.left;
    by = r.top;
    moved = false;
    try {
      btn.setPointerCapture(pid);
    } catch {
      /* noop */
    }
  });

  btn.addEventListener('pointermove', (e) => {
    if (pid !== e.pointerId) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    e.preventDefault();
    setFabPos(btn, bx + dx, by + dy);
  });

  const finish = (e: PointerEvent): void => {
    if (pid !== e.pointerId) return;
    try {
      btn.releasePointerCapture(pid);
    } catch {
      /* noop */
    }
    pid = -1;
    if (moved) {
      const r = btn.getBoundingClientRect();
      persistFab(r.left, r.top);
      // Swallow the synthetic click so a drag doesn't open the panel.
      btn.addEventListener(
        'click',
        (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
        },
        { capture: true, once: true },
      );
    }
  };
  btn.addEventListener('pointerup', finish);
  btn.addEventListener('pointercancel', finish);

  btn.addEventListener('keydown', (e) => {
    if (!e.shiftKey) return;
    const k = e.key;
    const dx = k === 'ArrowLeft' ? -10 : k === 'ArrowRight' ? 10 : 0;
    const dy = k === 'ArrowUp' ? -10 : k === 'ArrowDown' ? 10 : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    const r = btn.getBoundingClientRect();
    setFabPos(btn, r.left + dx, r.top + dy);
    const final = btn.getBoundingClientRect();
    persistFab(final.left, final.top);
  });
}

let corePromise: Promise<CoreApi> | null = null;
function loadCore(): Promise<CoreApi> {
  if (corePromise) return corePromise;
  if (cfg.cssPath && !document.querySelector('link[data-aw-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cfg.cssPath;
    link.setAttribute('data-aw-css', '1');
    if (cfg.cssIntegrity) {
      link.integrity = cfg.cssIntegrity;
      link.crossOrigin = 'anonymous';
    }
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
  applyProfile(id: string): Promise<boolean> {
    return loadCore().then((c) => c.applyProfile(id));
  },
  setLocale(locale: string): Promise<boolean> {
    return loadCore().then((c) => c.setLocale(locale));
  },
  /**
   * Programmatically move the FAB to viewport-pixel coords (from top-left)
   * or reset to the config-anchor via `null`. Works independently of
   * `draggableFab` — the host is always allowed to set the position.
   */
  setPosition(pos: { x: number; y: number } | null): void {
    const btn = document.querySelector<HTMLButtonElement>('[data-aw-fab]');
    if (!btn) return;
    if (pos === null) {
      btn.removeAttribute('data-aw-fab-pos');
      btn.style.removeProperty('--aw-fab-x');
      btn.style.removeProperty('--aw-fab-y');
      try {
        const raw = localStorage.getItem(cfg.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          delete parsed.fabPosition;
          localStorage.setItem(cfg.storageKey, JSON.stringify(parsed));
        }
      } catch (err) {
        if (cfg.debug) console.warn('[aw] setPosition(null) clear failed', err);
      }
      return;
    }
    if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y)) {
      if (cfg.debug) console.warn('[aw] setPosition: x and y must be finite numbers');
      return;
    }
    setFabPos(btn, pos.x, pos.y);
    persistFab(pos.x, pos.y);
  },
  getState(): WidgetState | null {
    return readState();
  },
  /**
   * Subscribe to widget lifecycle events. Returns unsubscribe function.
   * Events dispatch as CustomEvent on document — consumers can also use
   * `document.addEventListener('accessibility-widget:<name>', …)` directly.
   */
  on<K extends WidgetEventName>(
    name: K,
    handler: (detail: WidgetEventMap[K]) => void,
  ): () => void {
    return onWidgetEvent(name, handler);
  },
  version: '1.0.0-alpha.1',
};

window.AccessibilityWidget = publicApi;
