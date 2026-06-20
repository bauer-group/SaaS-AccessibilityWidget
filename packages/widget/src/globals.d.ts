import type { ProfileId, WidgetConfig, WidgetState, Locale } from './types/index.js';
import type { WidgetEventMap, WidgetEventName } from './util/events.js';

export {};

declare global {
  /**
   * The package version, injected at build time via esbuild `define`
   * (and by vitest's `define` in tests). Never a literal in source.
   */
  const __AW_VERSION__: string;

  interface Window {
    /** Public API — set by the loader. */
    AccessibilityWidget?: {
      open(opts?: {
        trigger?: HTMLElement;
        config?: WidgetConfig;
        locale?: Locale;
        statementUrl?: string;
      }): Promise<void>;
      close(): void;
      reset(): void;
      set(id: string, value: unknown): Promise<void>;
      applyProfile(id: string): Promise<boolean>;
      setLocale(locale: string): Promise<boolean>;
      setPosition(pos: { x: number; y: number } | null): void;
      getState(): WidgetState | null;
      on<K extends WidgetEventName>(
        name: K,
        handler: (detail: WidgetEventMap[K]) => void,
      ): () => void;
      version: string;
    };

    /** Developer-supplied config. */
    AccessibilityWidgetConfig?: WidgetConfig;

    /** Internal — set by the core bundle once loaded. */
    AccessibilityWidgetCore?: {
      open(opts: {
        trigger?: HTMLElement;
        config?: WidgetConfig;
        locale?: Locale | 'auto';
        statementUrl?: string;
      }): void;
      close(): void;
      set(id: string, value: unknown): void;
      applyProfile(id: string): boolean;
      setLocale(locale: string): boolean;
      reset(): void;
      getState(): WidgetState;
      version: string;
    };

    /** Internal guard against double-loading. */
    __accessibilityWidgetLoaded?: boolean;
  }
}

// Re-export public types so consumers importing from the package root
// also get the event map for `window.AccessibilityWidget.on<...>`.
export type { ProfileId, WidgetConfig, WidgetState, Locale, WidgetEventMap, WidgetEventName };
