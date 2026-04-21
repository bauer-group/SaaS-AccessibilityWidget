import { useEffect, useRef } from 'react';
import type { WidgetConfig, WidgetState } from '@bauer-group/bfsg-widget';

export interface BFSGWidgetSri {
  loader?: string;
  core?: string;
  css?: string;
}

export interface BFSGWidgetProps {
  loaderSrc?: string;
  cssHref?: string;
  config?: WidgetConfig;
  sri?: BFSGWidgetSri;
}

declare global {
  interface Window {
    BFSGWidgetConfig?: WidgetConfig;
    BFSGWidget?: {
      open(): Promise<void>;
      close(): void;
      reset(): void;
      set(id: string, value: unknown): Promise<void>;
      getState(): WidgetState | null;
    };
  }
}

export function BFSGWidget({
  loaderSrc = '/bfsg-widget-loader.min.js',
  cssHref = '/bfsg-widget.min.css',
  config,
  sri,
}: BFSGWidgetProps): null {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (typeof window === 'undefined') return;

    if (config) {
      window.BFSGWidgetConfig = { ...(window.BFSGWidgetConfig ?? {}), ...config };
    }

    if (cssHref && !document.querySelector('link[data-bfsg="css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.dataset.bfsg = 'css';
      if (sri?.css) {
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

export const openBFSGWidget = (): Promise<void> | undefined => window.BFSGWidget?.open();
export const closeBFSGWidget = (): void => window.BFSGWidget?.close();
export const resetBFSGWidget = (): void => window.BFSGWidget?.reset();
