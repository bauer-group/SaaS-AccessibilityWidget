import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';
import { applyI18n, detectLang, wireLangToggle, t } from './i18n';

declare global {
  interface Window {
    AccessibilityWidget?: {
      open(opts?: Record<string, unknown>): Promise<void>;
      close(): void;
      reset(): void;
      set(id: string, value: unknown): Promise<void>;
      applyProfile(id: string): Promise<boolean>;
      setLocale(locale: string): Promise<boolean>;
      setPosition(pos: { x: number; y: number } | null): void;
      getState(): WidgetState | null;
      on(name: string, handler: (detail: unknown) => void): () => void;
      version?: string;
    };
    AccessibilityWidgetConfig?: WidgetConfig;
  }
}

const DEMO_LOCALE_KEY = 'aw-demo-locale';
const MAX_EVENT_LOG = 30;

/**
 * Native display names for each supported locale.
 * Keep in sync with `packages/widget/src/types/locale.ts`.
 */
const LOCALES: Record<string, string> = {
  auto: '🌐 Auto',
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  tr: 'Türkçe',
  ar: 'العربية',
  zh: '中文',
  hi: 'हिन्दी',
  pt: 'Português',
  bn: 'বাংলা',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  vi: 'Tiếng Việt',
  fa: 'فارسی',
  ur: 'اردو',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  he: 'עברית',
  nl: 'Nederlands',
  sv: 'Svenska',
  cs: 'Čeština',
  el: 'Ελληνικά',
  hu: 'Magyar',
  ro: 'Română',
  uk: 'Українська',
};

// ---------------------------------------------------------------------------
// Page-level action wiring — hero buttons, data-action=open, hard-reset
// ---------------------------------------------------------------------------
function wireActions(): void {
  document.getElementById('open-panel')?.addEventListener('click', () => {
    window.AccessibilityWidget?.open();
  });
  document.getElementById('reset-panel')?.addEventListener('click', () => {
    window.AccessibilityWidget?.reset();
  });
  document.getElementById('hard-reset')?.addEventListener('click', () => {
    window.AccessibilityWidget?.reset();
  });
  for (const el of document.querySelectorAll<HTMLElement>('[data-action="open"]')) {
    el.addEventListener('click', () => void window.AccessibilityWidget?.open());
  }
}

// ---------------------------------------------------------------------------
// Profile Quick-Actions (uses new applyProfile API, no panel open required)
// ---------------------------------------------------------------------------
function wireProfileQuickActions(): void {
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-profile]')) {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-profile');
      if (!id) return;
      btn.setAttribute('aria-busy', 'true');
      try {
        await window.AccessibilityWidget?.applyProfile(id);
        markTemporaryActive(btn);
      } finally {
        btn.removeAttribute('aria-busy');
      }
    });
  }
}

function markTemporaryActive(btn: HTMLElement): void {
  btn.dataset.state = 'just-applied';
  setTimeout(() => {
    if (btn.dataset.state === 'just-applied') btn.dataset.state = '';
  }, 1500);
}

// ---------------------------------------------------------------------------
// Locale switcher — uses runtime setLocale() API (no page reload)
// ---------------------------------------------------------------------------
function wireLocaleSwitcher(): void {
  const select = document.getElementById('locale-select');
  if (!(select instanceof HTMLSelectElement)) return;

  const current = (() => {
    try {
      return localStorage.getItem(DEMO_LOCALE_KEY) ?? 'auto';
    } catch {
      return 'auto';
    }
  })();

  for (const [code, label] of Object.entries(LOCALES)) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = code === 'auto' ? label : `${label}  (${code})`;
    if (code === current) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener('change', async () => {
    const next = select.value;
    try {
      localStorage.setItem(DEMO_LOCALE_KEY, next);
    } catch {
      /* ignore */
    }
    if (next === 'auto') {
      // No API for "reset to auto-detect" — reload with cleared demo key.
      try {
        localStorage.removeItem(DEMO_LOCALE_KEY);
      } catch {
        /* ignore */
      }
      location.reload();
      return;
    }
    // Runtime locale swap — panel (if open) rerenders, persisted in WidgetState.
    const ok = await window.AccessibilityWidget?.setLocale(next);
    if (ok === false) {
      // Fallback path: widget not loaded yet → reload to pick up config
      location.reload();
    }
  });
}

// ---------------------------------------------------------------------------
// Live state polling (panel JSON dump)
// ---------------------------------------------------------------------------
function wireLiveState(): void {
  const output = document.getElementById('state-output');
  if (!output) return;

  let last = '';
  const render = () => {
    const state = window.AccessibilityWidget?.getState?.() ?? null;
    const next = JSON.stringify(state, null, 2) ?? 'null';
    if (next !== last) {
      output.textContent = next;
      last = next;
    }
  };

  render();
  setInterval(render, 500);
}

// ---------------------------------------------------------------------------
// Version display
// ---------------------------------------------------------------------------
function wireVersion(): void {
  const el = document.getElementById('widget-version');
  if (!el) return;
  const tick = (): boolean => {
    const v = window.AccessibilityWidget?.version;
    if (v) {
      el.textContent = v;
      return true;
    }
    return false;
  };
  if (!tick()) {
    const iv = setInterval(() => {
      if (tick()) clearInterval(iv);
    }, 250);
    setTimeout(() => clearInterval(iv), 10_000);
  }
}

// ---------------------------------------------------------------------------
// Tabs (ARIA-compliant keyboard navigation)
// ---------------------------------------------------------------------------
function wireTabs(): void {
  for (const group of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    if (tabs.length === 0 || panels.length === 0) continue;

    const activate = (index: number): void => {
      tabs.forEach((t, i) => {
        const active = i === index;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
      });
      panels.forEach((p, i) => {
        p.hidden = i !== index;
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const delta = e.key === 'ArrowRight' ? 1 : -1;
          const next = (i + delta + tabs.length) % tabs.length;
          tabs[next]?.focus();
          activate(next);
        } else if (e.key === 'Home') {
          e.preventDefault();
          tabs[0]?.focus();
          activate(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          const last = tabs.length - 1;
          tabs[last]?.focus();
          activate(last);
        }
      });
    });
  }
}

// ---------------------------------------------------------------------------
// Copy buttons (clipboard API + textarea fallback)
// ---------------------------------------------------------------------------
function wireCopyButtons(): void {
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    btn.addEventListener('click', async () => {
      const codeEl = btn.parentElement?.querySelector('code');
      const text = codeEl?.textContent ?? '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch {
          /* give up silently */
        }
        ta.remove();
      }
      const original = btn.textContent;
      btn.dataset.state = 'copied';
      btn.textContent = t('hero.copied');
      setTimeout(() => {
        btn.dataset.state = '';
        btn.textContent = original;
      }, 1500);
    });
  }
}

// ---------------------------------------------------------------------------
// Runtime-API Explorer — calls data-api methods with data-args, renders result
// ---------------------------------------------------------------------------
function wireApiExplorer(): void {
  const output = document.getElementById('api-result-output');
  if (!output) return;

  const render = (label: string, value: unknown): void => {
    const ts = new Date().toLocaleTimeString(undefined, { hour12: false });
    const serialized = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    output.textContent = `[${ts}] ${label}\n\n${serialized}`;
  };

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-api]')) {
    btn.addEventListener('click', async () => {
      const method = btn.getAttribute('data-api') ?? '';
      const argsAttr = btn.getAttribute('data-args');
      let args: unknown[] = [];
      if (argsAttr) {
        try {
          args = JSON.parse(argsAttr);
        } catch {
          render(method + '()', 'Error: data-args is not valid JSON');
          return;
        }
      }
      const api = window.AccessibilityWidget;
      if (!api) {
        render(method + '()', 'Widget not loaded yet');
        return;
      }
      const fn = (api as unknown as Record<string, unknown>)[method];
      if (typeof fn !== 'function') {
        render(method + '()', `Error: ${method} is not a function`);
        return;
      }
      const callSig = `${method}(${args.map((a) => JSON.stringify(a)).join(', ')})`;
      try {
        const ret = (fn as (...a: unknown[]) => unknown).apply(api, args);
        const resolved = ret instanceof Promise ? await ret : ret;
        render(callSig + ' →', resolved === undefined ? 'void' : resolved);
      } catch (err) {
        render(callSig + ' threw', err instanceof Error ? err.message : String(err));
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Event-Stream — subscribes to all 6 widget events + renders live log
// ---------------------------------------------------------------------------
const EVENT_NAMES = [
  'stateChange',
  'open',
  'close',
  'profileApplied',
  'localeChanged',
  'reset',
] as const;
type EventName = (typeof EVENT_NAMES)[number];

function wireEventStream(): void {
  const log = document.getElementById('events-log');
  const countEl = document.getElementById('events-count');
  const clearBtn = document.getElementById('events-clear');
  if (!log) return;

  let count = 0;
  let entries: HTMLElement[] = [];

  const updateCount = (): void => {
    if (countEl) countEl.textContent = `${count} Event${count === 1 ? '' : 's'}`;
  };

  const append = (name: EventName, detail: unknown): void => {
    // Remove the "empty" placeholder on first real event
    const empty = log.querySelector('.event-stream__empty');
    empty?.remove();

    count += 1;
    updateCount();

    const ts = new Date().toLocaleTimeString(undefined, { hour12: false });
    const li = document.createElement('li');
    li.className = 'event-stream__entry';
    li.innerHTML = `
      <span class="event-stream__time">${ts}</span>
      <span class="event-stream__name" data-event="${name}">${name}</span>
      <pre class="event-stream__payload"><code></code></pre>
    `;
    const code = li.querySelector('code');
    if (code) code.textContent = JSON.stringify(detail, replaceCircular(), 2);
    log.insertBefore(li, log.firstChild);

    entries.unshift(li);
    // Drop oldest entries beyond the limit
    while (entries.length > MAX_EVENT_LOG) {
      entries.pop()?.remove();
    }
  };

  // Use document.addEventListener directly — gives us stable CustomEvent typing
  // and works even before the widget loader has finished booting.
  for (const name of EVENT_NAMES) {
    document.addEventListener(`accessibility-widget:${name}`, (e) => {
      append(name, (e as CustomEvent).detail);
    });
  }

  clearBtn?.addEventListener('click', () => {
    const li = document.createElement('li');
    li.className = 'event-stream__empty';
    li.textContent = t('events.cleared');
    log.replaceChildren(li);
    entries = [];
    count = 0;
    updateCount();
  });
}

/**
 * JSON.stringify replacer that drops DOM nodes and circular references —
 * the `open` event payload includes an HTMLElement, which JSON.stringify
 * would otherwise serialize as the empty object `{}`.
 */
function replaceCircular(): (key: string, value: unknown) => unknown {
  const seen = new WeakSet<object>();
  return (_key, value) => {
    if (value instanceof Element) {
      return `<${value.tagName.toLowerCase()}${value.id ? '#' + value.id : ''}>`;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  };
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // i18n first: localize the (English-default) DOM and lift the cloak for DE.
  applyI18n(detectLang());
  wireLangToggle();
  wireActions();
  wireProfileQuickActions();
  wireLocaleSwitcher();
  wireLiveState();
  wireVersion();
  wireTabs();
  wireCopyButtons();
  wireApiExplorer();
  wireEventStream();
});
