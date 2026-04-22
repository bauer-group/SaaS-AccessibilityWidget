import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';

declare global {
  interface Window {
    AccessibilityWidget?: {
      open(opts?: Record<string, unknown>): Promise<void>;
      close(): void;
      reset(): void;
      set(id: string, value: unknown): Promise<void>;
      getState(): WidgetState | null;
      version?: string;
    };
    AccessibilityWidgetConfig?: WidgetConfig;
  }
}

const DEMO_LOCALE_KEY = 'aw-demo-locale';

/**
 * Native display names for each locale we support, used in the demo's
 * locale <select>. Keep in sync with `packages/widget/src/types/locale.ts`.
 */
const LOCALES: Record<string, string> = {
  auto: '🌐 Auto (Browser-Sprache)',
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
// Action buttons (open/reset/open-via-data-action)
// ---------------------------------------------------------------------------
function wireActions(): void {
  document.getElementById('open-panel')?.addEventListener('click', () => {
    window.AccessibilityWidget?.open();
  });
  document.getElementById('reset-panel')?.addEventListener('click', () => {
    window.AccessibilityWidget?.reset();
  });
  for (const el of document.querySelectorAll<HTMLElement>('[data-action="open"]')) {
    el.addEventListener('click', () => window.AccessibilityWidget?.open());
  }
}

// ---------------------------------------------------------------------------
// Locale switcher — stores selection, reloads page
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

  select.addEventListener('change', () => {
    try {
      localStorage.setItem(DEMO_LOCALE_KEY, select.value);
    } catch {
      /* ignore */
    }
    // The widget also persists its own feature state; we intentionally
    // do not clear it on locale change.
    location.reload();
  });
}

// ---------------------------------------------------------------------------
// Live state polling
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
  const tick = () => {
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
    // Stop polling after 10 s to avoid leaks if the widget never loads.
    setTimeout(() => clearInterval(iv), 10_000);
  }
}

// ---------------------------------------------------------------------------
// Tabs (ARIA-compliant)
// ---------------------------------------------------------------------------
function wireTabs(): void {
  for (const group of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(group.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    if (tabs.length === 0 || panels.length === 0) continue;

    const activate = (index: number) => {
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
// Copy buttons — uses Clipboard API, falls back to selection-based copy
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
        // Fallback for browsers without clipboard API (or insecure context)
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
      btn.textContent = 'Kopiert ✓';
      setTimeout(() => {
        btn.dataset.state = '';
        btn.textContent = original;
      }, 1500);
    });
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  wireActions();
  wireLocaleSwitcher();
  wireLiveState();
  wireVersion();
  wireTabs();
  wireCopyButtons();
});
