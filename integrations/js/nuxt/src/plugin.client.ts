import type { WidgetConfig } from '@bauer-group/accessibility-widget';

/**
 * Nuxt 3 client-only plugin. Copy this file to `plugins/accessibility-widget.client.ts`
 * in your Nuxt app. Configure via `runtimeConfig.public.bfsgWidget` in nuxt.config.ts:
 *
 *   export default defineNuxtConfig({
 *     runtimeConfig: {
 *       public: {
 *         bfsgWidget: {
 *           loaderSrc: '/accessibility-widget/accessibility-widget-loader.min.js',
 *           cssHref:   '/accessibility-widget/accessibility-widget.min.css',
 *           config:    { locale: 'auto' },
 *         },
 *       },
 *     },
 *   });
 */
interface NuxtRuntime {
  public: {
    bfsgWidget?: {
      loaderSrc?: string;
      cssHref?: string;
      config?: WidgetConfig;
      sri?: { loader?: string; css?: string };
    };
  };
}

declare function defineNuxtPlugin(fn: () => void): unknown;
declare function useRuntimeConfig(): NuxtRuntime;

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;
  const cfg = useRuntimeConfig().public.bfsgWidget ?? {};
  const loaderSrc = cfg.loaderSrc ?? '/accessibility-widget-loader.min.js';
  const cssHref = cfg.cssHref ?? '/accessibility-widget.min.css';
  const sri = cfg.sri ?? {};

  (window as unknown as { AccessibilityWidgetConfig?: WidgetConfig }).AccessibilityWidgetConfig = {
    ...((window as unknown as { AccessibilityWidgetConfig?: WidgetConfig }).AccessibilityWidgetConfig ?? {}),
    ...(cfg.config ?? {}),
  };

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
});
