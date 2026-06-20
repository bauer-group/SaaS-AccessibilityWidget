import { useEffect, useRef } from 'react';
import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';

export interface AccessibilityWidgetSri {
  loader?: string;
  core?: string;
  css?: string;
}

export interface AccessibilityWidgetProps {
  loaderSrc?: string;
  cssHref?: string;
  config?: WidgetConfig;
  sri?: AccessibilityWidgetSri;
}

declare global {
  interface Window {
    AccessibilityWidgetConfig?: WidgetConfig;
    AccessibilityWidget?: {
      open(): Promise<void>;
      close(): void;
      reset(): void;
      set(id: string, value: unknown): Promise<void>;
      getState(): WidgetState | null;
    };
  }
}

export function AccessibilityWidget({
  loaderSrc = '/accessibility-widget-loader.min.js',
  cssHref = '/accessibility-widget.min.css',
  config,
  sri,
}: AccessibilityWidgetProps): null {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (typeof window === 'undefined') return;

    if (config) {
      window.AccessibilityWidgetConfig = { ...(window.AccessibilityWidgetConfig ?? {}), ...config };
    }

    // Matches the IIFE loader's dedupe selector (link[data-aw-css]).
    if (cssHref && !document.querySelector('link[data-aw-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.setAttribute('data-aw-css', '1');
      if (sri?.css) {
        link.integrity = sri.css;
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }

    if (loaderSrc && !document.querySelector('script[data-aw-loader]')) {
      const s = document.createElement('script');
      s.src = loaderSrc;
      s.defer = true;
      s.setAttribute('data-aw-loader', '1');
      if (sri?.loader) {
        s.integrity = sri.loader;
        s.crossOrigin = 'anonymous';
      }
      document.head.appendChild(s);
    }
    // No cleanup: the widget persists across route changes in SPAs.
  }, [loaderSrc, cssHref, config, sri]);

  return null;
}

export const openAccessibilityWidget = (): Promise<void> | undefined =>
  window.AccessibilityWidget?.open();
export const closeAccessibilityWidget = (): void => window.AccessibilityWidget?.close();
export const resetAccessibilityWidget = (): void => window.AccessibilityWidget?.reset();
