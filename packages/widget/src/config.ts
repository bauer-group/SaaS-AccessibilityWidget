import type { WidgetConfig, Position, Locale } from './types/index.js';
import { normalizeLocale, isLocale } from './types/index.js';

export interface ResolvedConfig extends Required<Omit<WidgetConfig, 'locale' | 'coreIntegrity' | 'buttonLabel'>> {
  locale: Locale;
  coreIntegrity: string | null;
  buttonLabel: string | null;
}

const DEFAULTS = {
  corePath: '/accessibility-widget/accessibility-widget-core.min.js',
  cssPath: '/accessibility-widget/accessibility-widget.min.css',
  position: 'bottom-right' as Position,
  storageKey: 'accessibility-widget',
  respectReducedMotion: true,
  primaryColor: '#0058a3',
  hideOnPrint: true,
  debug: false,
};

export function resolveConfig(input: WidgetConfig | undefined, navLang: string): ResolvedConfig {
  const cfg = input ?? {};
  const locale = resolveLocale(cfg.locale, navLang);
  return {
    corePath: cfg.corePath ?? DEFAULTS.corePath,
    cssPath: cfg.cssPath ?? DEFAULTS.cssPath,
    position: cfg.position ?? DEFAULTS.position,
    locale,
    storageKey: cfg.storageKey ?? DEFAULTS.storageKey,
    buttonLabel: cfg.buttonLabel ?? null,
    respectReducedMotion: cfg.respectReducedMotion ?? DEFAULTS.respectReducedMotion,
    primaryColor: cfg.primaryColor ?? DEFAULTS.primaryColor,
    hideOnPrint: cfg.hideOnPrint ?? DEFAULTS.hideOnPrint,
    coreIntegrity: cfg.coreIntegrity ?? null,
    debug: cfg.debug ?? DEFAULTS.debug,
  };
}

function resolveLocale(requested: WidgetConfig['locale'], navLang: string): Locale {
  if (!requested || requested === 'auto') return normalizeLocale(navLang, 'de');
  return isLocale(requested) ? requested : normalizeLocale(navLang, 'de');
}
