import type { Locale, ProfileId, WidgetState } from '../types/index.js';

/**
 * Public event map. Events are dispatched as `CustomEvent` on `document`
 * under the prefixed type name (`accessibility-widget:<name>`). Using
 * the DOM event system keeps loader and core decoupled — neither needs
 * to share a listener registry.
 */
export interface WidgetEventMap {
  stateChange: { state: WidgetState };
  open: { trigger?: HTMLElement | null };
  close: Record<string, never>;
  profileApplied: { profile: ProfileId; state: WidgetState };
  localeChanged: { locale: Locale };
  reset: Record<string, never>;
}

export type WidgetEventName = keyof WidgetEventMap;

const PREFIX = 'accessibility-widget:';

export function dispatchWidgetEvent<K extends WidgetEventName>(
  name: K,
  detail: WidgetEventMap[K],
): void {
  if (typeof document === 'undefined') return;
  try {
    document.dispatchEvent(new CustomEvent(PREFIX + name, { detail }));
  } catch {
    /* CustomEvent not supported on ancient browsers — widget drops this event */
  }
}

/**
 * Subscribe to a widget event. Returns an unsubscribe function.
 *
 * @example
 * ```ts
 * const off = onWidgetEvent('stateChange', (e) => analytics.track('a11y', e.state));
 * // later
 * off();
 * ```
 */
export function onWidgetEvent<K extends WidgetEventName>(
  name: K,
  handler: (detail: WidgetEventMap[K]) => void,
): () => void {
  if (typeof document === 'undefined') return () => {};
  const listener = (e: Event): void => {
    handler((e as CustomEvent<WidgetEventMap[K]>).detail);
  };
  document.addEventListener(PREFIX + name, listener);
  return () => document.removeEventListener(PREFIX + name, listener);
}
