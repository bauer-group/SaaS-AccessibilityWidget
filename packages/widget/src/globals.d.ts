import type { WidgetConfig, WidgetState, Locale } from './types/index.js';

export {};

declare global {
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
      getState(): WidgetState | null;
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
      reset(): void;
      getState(): WidgetState;
      version: string;
    };

    /** Internal guard against double-loading. */
    __accessibilityWidgetLoaded?: boolean;
  }
}
