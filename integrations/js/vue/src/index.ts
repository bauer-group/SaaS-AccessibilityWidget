import { defineComponent, onMounted, type PropType } from 'vue';
import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';

export interface SriMap {
  loader?: string;
  core?: string;
  css?: string;
}

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

export const AccessibilityWidget = defineComponent({
  name: 'AccessibilityWidget',
  props: {
    loaderSrc: { type: String, default: '/accessibility-widget-loader.min.js' },
    cssHref: { type: String, default: '/accessibility-widget.min.css' },
    config: { type: Object as PropType<WidgetConfig>, default: () => ({}) },
    sri: { type: Object as PropType<SriMap>, default: () => ({}) },
  },
  setup(props) {
    onMounted(() => {
      if (typeof window === 'undefined') return;
      window.AccessibilityWidgetConfig = {
        ...(window.AccessibilityWidgetConfig ?? {}),
        ...props.config,
      };

      if (props.cssHref && !document.querySelector('link[data-aw-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = props.cssHref;
        link.setAttribute('data-aw-css', '1');
        if (props.sri.css) {
          link.integrity = props.sri.css;
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
      if (props.loaderSrc && !document.querySelector('script[data-aw-loader]')) {
        const s = document.createElement('script');
        s.src = props.loaderSrc;
        s.defer = true;
        s.setAttribute('data-aw-loader', '1');
        if (props.sri.loader) {
          s.integrity = props.sri.loader;
          s.crossOrigin = 'anonymous';
        }
        document.head.appendChild(s);
      }
    });
    return () => null;
  },
});

export const openAccessibilityWidget = (): Promise<void> | undefined =>
  window.AccessibilityWidget?.open();
export const closeAccessibilityWidget = (): void => window.AccessibilityWidget?.close();
export const resetAccessibilityWidget = (): void => window.AccessibilityWidget?.reset();
