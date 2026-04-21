export type AttrMap = Record<string, string | number | boolean | null | undefined>;
export type EventMap = Record<string, EventListener>;

export interface MakeOptions {
  class?: string;
  text?: string;
  attrs?: AttrMap;
  on?: EventMap;
  children?: (Node | null | undefined)[];
}

/**
 * Type-safe DOM builder. Intentionally does NOT accept raw HTML strings —
 * all content is set via textContent or pre-built child nodes. This keeps
 * the widget XSS-safe even if a future config field leaks untrusted input.
 */
export function make<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  opts: MakeOptions = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (opts.class) el.className = opts.class;
  if (opts.text !== undefined) el.textContent = opts.text;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) {
      if (v === null || v === undefined || v === false) continue;
      el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  if (opts.on) {
    for (const [evt, handler] of Object.entries(opts.on)) {
      el.addEventListener(evt, handler);
    }
  }
  if (opts.children) {
    for (const child of opts.children) {
      if (child) el.appendChild(child);
    }
  }
  return el;
}

export function toggleAttr(
  el: Element,
  name: string,
  value: string | number | null | undefined | false,
): void {
  if (value === null || value === undefined || value === false || value === '') {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, String(value));
  }
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function onceIdle(cb: () => void, timeout = 2000): void {
  const win = window as unknown as {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, Math.min(timeout, 1000));
  }
}
