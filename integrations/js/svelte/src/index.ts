import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';

declare global {
  interface Window {
    AccessibilityWidgetConfig?: WidgetConfig;
    AccessibilityWidget?: {
      open(): Promise<void>;
      close(): void;
      reset(): void;
      getState(): WidgetState | null;
    };
  }
}

export interface BfsgOptions {
  loaderSrc?: string;
  cssHref?: string;
  config?: WidgetConfig;
  sri?: { loader?: string; core?: string; css?: string };
}

/**
 * Svelte 5 "action" — attach to any element, e.g. <div use:bfsgWidget={{ config: {...} }} />.
 * Idempotent: adding the action to multiple elements is safe.
 */
export function bfsgWidget(_node: HTMLElement, opts: BfsgOptions = {}): { destroy(): void } {
  if (typeof window === 'undefined') return { destroy() {} };

  const loaderSrc = opts.loaderSrc ?? '/accessibility-widget-loader.min.js';
  const cssHref = opts.cssHref ?? '/accessibility-widget.min.css';
  const sri = opts.sri ?? {};

  if (opts.config) {
    window.AccessibilityWidgetConfig = { ...(window.AccessibilityWidgetConfig ?? {}), ...opts.config };
  }
  if (cssHref && !document.querySelector('link[data-bfsg="css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.dataset.bfsg = 'css';
    if (sri.css) {
      link.integrity = sri.css;
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }
  if (loaderSrc && !document.querySelector('script[data-bfsg="loader"]')) {
    const s = document.createElement('script');
    s.src = loaderSrc;
    s.defer = true;
    s.dataset.bfsg = 'loader';
    if (sri.loader) {
      s.integrity = sri.loader;
      s.crossOrigin = 'anonymous';
    }
    document.head.appendChild(s);
  }
  return { destroy() {} };
}

export const openAccessibilityWidget = (): Promise<void> | undefined => window.AccessibilityWidget?.open();
export const closeAccessibilityWidget = (): void => window.AccessibilityWidget?.close();
export const resetAccessibilityWidget = (): void => window.AccessibilityWidget?.reset();
