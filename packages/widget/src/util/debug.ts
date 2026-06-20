/**
 * Emits a console warning only when debug mode is enabled on
 * `window.AccessibilityWidgetConfig.debug`. Silent by default so production
 * bundles don't leak noise, but makes genuine failures discoverable when the
 * developer opts in.
 */
export function warnIfDebug(message: string, error?: unknown): void {
  if (typeof window === 'undefined') return;
  if (!window.AccessibilityWidgetConfig?.debug) return;

  console.warn(`[aw] ${message}`, error);
}
