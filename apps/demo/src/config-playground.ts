/**
 * Interactive configuration playground (configuration.html).
 *
 * Every `AccessibilityWidgetConfig` field is exposed as a real control. The
 * page reads all `[data-cfg]` inputs, builds a config object, and:
 *
 *   1. renders a live, copyable `window.AccessibilityWidgetConfig = {…}` snippet
 *      (always the single source of truth — this is the "documentation"),
 *   2. previews panel-affecting options instantly via `open({ config })`,
 *   3. applies the WIDGET locale instantly via the runtime `setLocale()` API,
 *   4. applies *everything* reliably via "Apply & reload" — the config is
 *      stashed in sessionStorage and the inline head bootstrap merges it back
 *      over the base config before the loader boots.
 *
 * Most fields (assets, colour, position, offset, z-index, storageKey,
 * initial/disabled features, keyboard shortcut, debug …) only take effect at
 * load time, so they carry a "reload" badge; `locale` is the only true-live
 * field and carries a "live" badge. The reload path makes all of them
 * genuinely interactive without over-promising per-option live hacks.
 */

export const DEMO_CONFIG_KEY = 'aw-demo-config';

/**
 * The 15 feature ids — kept in sync with `FEATURE_IDS` in
 * `packages/widget/src/types/widget.ts` (same convention as the LOCALES map in
 * main.ts: the widget bundle ships no value export, so the demo mirrors it).
 */
const FEATURE_IDS = [
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'contrast',
  'grayscale',
  'invertColors',
  'dyslexiaFont',
  'highlightLinks',
  'pauseAnimations',
  'bigCursor',
  'focusOutline',
  'readingMask',
  'readingGuide',
  'tts',
  'structureNav',
] as const;

/** Fill each `data-cfg-type="features"` fieldset with one checkbox per feature id. */
function populateFeatureFieldsets(root: ParentNode): void {
  for (const set of root.querySelectorAll<HTMLElement>('[data-cfg-type="features"]')) {
    if (set.childElementCount > 0) continue; // idempotent
    const name = set.getAttribute('data-cfg') ?? 'features';
    for (const id of FEATURE_IDS) {
      const label = document.createElement('label');
      label.className = 'cfg-feature';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.value = id;
      box.name = `${name}[]`;
      const span = document.createElement('span');
      span.textContent = id;
      label.append(box, span);
      set.appendChild(label);
    }
  }
}

type CfgType = 'string' | 'number' | 'boolean' | 'color' | 'select' | 'features';

interface CfgValue {
  key: string;
  type: CfgType;
  /** Dotted path for nested fields, e.g. `offset.x`. */
  path: string[];
  value: unknown;
  isDefault: boolean;
}

/** Read one `[data-cfg]` control into a typed value + whether it equals its default. */
function readControl(el: HTMLElement): CfgValue | null {
  const key = el.getAttribute('data-cfg');
  const type = el.getAttribute('data-cfg-type') as CfgType | null;
  if (!key || !type) return null;
  const path = key.split('.');

  if (type === 'features') {
    // A fieldset of feature checkboxes → { featureId: true, … } (only checked).
    const boxes = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const out: Record<string, boolean> = {};
    let any = false;
    for (const box of boxes) {
      if (box.checked) {
        out[box.value] = true;
        any = true;
      }
    }
    return { key, type, path, value: out, isDefault: !any };
  }

  if (type === 'boolean') {
    const box = el as HTMLInputElement;
    const def = box.getAttribute('data-cfg-default') === 'true';
    return { key, type, path, value: box.checked, isDefault: box.checked === def };
  }

  const input = el as HTMLInputElement | HTMLSelectElement;
  const raw = input.value.trim();
  const def = (input.getAttribute('data-cfg-default') ?? '').trim();

  if (type === 'number') {
    if (raw === '') return { key, type, path, value: undefined, isDefault: true };
    const num = Number(raw);
    return {
      key,
      type,
      path,
      value: Number.isFinite(num) ? num : undefined,
      isDefault: raw === def,
    };
  }

  // string | color | select
  return { key, type, path, value: raw === '' ? undefined : raw, isDefault: raw === def };
}

function setDeep(target: Record<string, unknown>, path: string[], value: unknown): void {
  let node = target;
  for (let i = 0; i < path.length - 1; i++) {
    const part = path[i]!;
    if (typeof node[part] !== 'object' || node[part] === null) node[part] = {};
    node = node[part] as Record<string, unknown>;
  }
  node[path[path.length - 1]!] = value;
}

/** Build the *full* config (every set field) — used for apply + panel preview. */
function collectConfig(root: ParentNode): Record<string, unknown> {
  const cfg: Record<string, unknown> = {};
  for (const el of root.querySelectorAll<HTMLElement>('[data-cfg]')) {
    const read = readControl(el);
    if (!read || read.value === undefined) continue;
    if (read.type === 'features') {
      if (Object.keys(read.value as object).length === 0) continue;
      setDeep(cfg, read.path, read.value);
    } else {
      setDeep(cfg, read.path, read.value);
    }
  }
  return cfg;
}

/** Build the *minimal* config (only fields the user changed) — used for the snippet. */
function collectChanged(root: ParentNode): Record<string, unknown> {
  const cfg: Record<string, unknown> = {};
  for (const el of root.querySelectorAll<HTMLElement>('[data-cfg]')) {
    const read = readControl(el);
    if (!read || read.isDefault || read.value === undefined) continue;
    setDeep(cfg, read.path, read.value);
  }
  return cfg;
}

/** Pretty-print a config object as a JS assignment for copy/paste. */
function renderSnippet(cfg: Record<string, unknown>, emptyHint: string): string {
  if (Object.keys(cfg).length === 0) {
    return `// ${emptyHint}\nwindow.AccessibilityWidgetConfig = {};`;
  }
  const body = JSON.stringify(cfg, null, 2)
    // JSON → JS object literal: unquote simple keys for a more idiomatic snippet.
    .replace(/^(\s*)"([A-Za-z_$][\w$]*)":/gm, '$1$2:');
  return `window.AccessibilityWidgetConfig = ${body};`;
}

export function wireConfigPlayground(t: (k: string) => string): void {
  const form = document.getElementById('cfg-form');
  const snippetEl = document.getElementById('cfg-snippet');
  if (!form || !snippetEl) return; // not on this page

  populateFeatureFieldsets(form);

  const refresh = (): void => {
    snippetEl.textContent = renderSnippet(collectChanged(form), t('config.snippetEmpty'));
  };

  // Live snippet on any change.
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  // Instant WIDGET-locale swap (the one genuinely-live field).
  form.querySelector<HTMLSelectElement>('[data-cfg="locale"]')?.addEventListener('change', (e) => {
    const v = (e.target as HTMLSelectElement).value;
    if (v && v !== 'auto') void window.AccessibilityWidget?.setLocale(v);
  });

  // Preview panel-affecting options instantly without a reload.
  document.getElementById('cfg-preview')?.addEventListener('click', () => {
    void window.AccessibilityWidget?.open({ config: collectConfig(form) });
  });

  // Apply everything: stash → reload (head bootstrap merges it before boot).
  document.getElementById('cfg-apply')?.addEventListener('click', () => {
    try {
      sessionStorage.setItem(DEMO_CONFIG_KEY, JSON.stringify(collectConfig(form)));
    } catch {
      /* private mode — preview still works, reload simply won't persist */
    }
    location.reload();
  });

  // Reset: clear the stash and the controls, then reload to a clean widget.
  document.getElementById('cfg-reset')?.addEventListener('click', () => {
    try {
      sessionStorage.removeItem(DEMO_CONFIG_KEY);
    } catch {
      /* ignore */
    }
    location.reload();
  });

  refresh();
}
