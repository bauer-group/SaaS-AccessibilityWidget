import type { Locale } from './locale.js';

export const FEATURE_IDS = [
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'contrast',
  'grayscale',
  'invertColors',
  'dyslexiaFont',
  'highlightLinks',
  'pauseAnimations',
  'bigCursor',
  'focusOutline',
  'readingMask',
  'readingGuide',
  'tts',
  'structureNav',
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export const CONTRAST_MODES = ['off', 'high', 'dark', 'invert'] as const;
export type ContrastMode = (typeof CONTRAST_MODES)[number];

export const PROFILE_IDS = [
  'visionImpaired',
  'motor',
  'cognitive',
  'seizureSafe',
  'adhd',
  'blind',
] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export const POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const;
export type Position = (typeof POSITIONS)[number];

export interface WidgetState {
  features: Record<FeatureId, boolean>;
  fontSizeLevel: number;
  lineHeightLevel: number;
  letterSpacingLevel: number;
  contrastMode: ContrastMode;
  /** Enlarges panel controls & tap targets — independent from font-size feature. */
  oversized?: boolean;
  /**
   * Custom FAB position set by user drag (only populated when `draggableFab`
   * is enabled and the user actually moved the button). Coordinates are
   * viewport-pixel distances from the **top-left** corner. When absent, the
   * FAB uses the configured `position` + `offset` anchor.
   */
  fabPosition?: { x: number; y: number } | null;
  /**
   * User-chosen locale override. When set, wins over `config.locale`
   * on the next panel open and gets applied on reload by the loader.
   * Populated by the in-panel language dropdown and the public
   * `setLocale()` runtime API.
   */
  locale?: string;
}

/**
 * Host-supplied configuration for the widget loader.
 *
 * Set via `window.AccessibilityWidgetConfig = { … }` **before** the loader
 * script executes. All fields are optional — the widget ships with sensible
 * defaults. Invalid values are coerced to defaults; with `debug: true` they
 * emit console warnings so mis-configurations are discoverable.
 *
 * @example Minimal override
 * ```ts
 * window.AccessibilityWidgetConfig = { locale: 'de', primaryColor: '#0058a3' };
 * ```
 *
 * @example Enterprise deployment
 * ```ts
 * window.AccessibilityWidgetConfig = {
 *   corePath: '/assets/accessibility-widget-core.min.js',
 *   cssPath:  '/assets/accessibility-widget.min.css',
 *   coreIntegrity: 'sha384-…',
 *   cssIntegrity:  'sha384-…',
 *   position: 'bottom-left',
 *   offset: { x: 24, y: 96 },  // clear the chat widget
 *   zIndex: 9999,
 *   primaryColor: '#0058a3',
 *   storageKey: 'mycorp-a11y',
 *   statementUrl: '/accessibility-statement',
 *   disabledFeatures: ['tts'],
 *   initialFeatures: { focusOutline: true },
 *   debug: false,
 * };
 * ```
 */
export interface WidgetConfig {
  // ─── asset loading ────────────────────────────────────────────────
  /** URL to the on-demand core bundle. Default: `/accessibility-widget/accessibility-widget-core.min.js`. */
  corePath?: string;
  /** URL to the widget stylesheet. Default: `/accessibility-widget/accessibility-widget.min.css`. */
  cssPath?: string;
  /** SRI hash for the core bundle (`sha384-…`). Matches the value printed in `dist/integrity.txt`. */
  coreIntegrity?: string | null;
  /** SRI hash for the stylesheet. Matches the value printed in `dist/integrity.txt`. */
  cssIntegrity?: string | null;

  // ─── localization ─────────────────────────────────────────────────
  /**
   * Widget locale. `'auto'` (default) picks from `document.documentElement.lang`
   * or `navigator.language`, falling back to `de`. Set explicitly to override.
   */
  locale?: Locale | 'auto';

  // ─── UI / branding ────────────────────────────────────────────────
  /** FAB anchor corner. Default: `bottom-right`. */
  position?: Position;
  /**
   * Pixel offset of the FAB from its anchor corner.
   * Useful when other fixed elements (chat widgets, cookie banners) would collide.
   * Default: `{ x: 20, y: 20 }`.
   */
  offset?: { x?: number; y?: number };
  /**
   * Override the FAB z-index. Default: `2147483646` (one below max int32).
   * Lower values allow in-page dialogs to stack on top of the FAB.
   */
  zIndex?: number;
  /** FAB background color. Default: `#0058a3` (BAUER GROUP blue). Must be a valid CSS color. */
  primaryColor?: string;
  /** Override the FAB `aria-label`. `null` → use the localized default for the active locale. */
  buttonLabel?: string | null;

  // ─── persistence ──────────────────────────────────────────────────
  /**
   * localStorage key for user preferences. Default: `accessibility-widget`.
   * Change this to namespace the widget on multi-tenant platforms where
   * different sub-brands need isolated preferences.
   */
  storageKey?: string;

  // ─── initial experience ───────────────────────────────────────────
  /**
   * Features turned ON for a first-time visitor (no persisted state yet).
   * Only applies once — once the user has modified anything in the panel,
   * the persisted state wins.
   *
   * @example Public-sector site that wants a visible focus ring by default
   * ```ts
   * { initialFeatures: { focusOutline: true, highlightLinks: true } }
   * ```
   */
  initialFeatures?: Partial<Record<FeatureId, boolean>>;

  // ─── feature gating ───────────────────────────────────────────────
  /**
   * Features hidden from the panel UI. Useful when certain features don't
   * make sense in context (e.g. `tts` on a site with no text content).
   * Hidden features are neither toggle-able nor activated by profile presets.
   */
  disabledFeatures?: readonly FeatureId[];

  // ─── legal / compliance ───────────────────────────────────────────
  /**
   * URL of the site's accessibility statement. When set, a link is rendered
   * in the panel footer (label is localized — see `Translation.statementLink`).
   * Recommended for BFSG § 14 / EN 301 549 § 12.1.1 compliance.
   */
  statementUrl?: string;

  // ─── behavior ─────────────────────────────────────────────────────
  /**
   * When true, end users can drag the FAB to a custom position (pointer or
   * keyboard). The chosen position persists under `storageKey` as part of
   * the widget state and is restored on the next visit. Default: `false`.
   *
   * Keyboard: focus the FAB, hold Shift + Arrow keys to move in 10 px steps.
   */
  draggableFab?: boolean;
  /**
   * Keyboard shortcut that opens the widget from anywhere on the page.
   *
   * - `string` — a combo like `'alt+shift+a'`, `'ctrl+alt+w'`, `'f2'`. Tokens
   *   are case-insensitive and joined with `+`. Supported modifiers:
   *   `alt`, `ctrl`, `shift`, `meta`. Exactly one non-modifier key is required.
   * - `false` — disable the shortcut entirely. Useful when the default clashes
   *   with a browser / OS / extension binding (e.g. Chrome Lens on some
   *   locales also uses Alt+Shift+A).
   *
   * Invalid strings fall back to the default and emit a `console.warn` when
   * `debug: true`. Default: `'alt+shift+a'`.
   *
   * @example Quake-style
   * ```ts
   * { keyboardShortcut: 'f2' }
   * ```
   *
   * @example Disable completely
   * ```ts
   * { keyboardShortcut: false }
   * ```
   */
  keyboardShortcut?: string | false;
  /** When true, features that add motion respect `prefers-reduced-motion`. Default: `true`. */
  respectReducedMotion?: boolean;
  /** When true, the FAB is hidden in print media (`@media print`). Default: `true`. */
  hideOnPrint?: boolean;

  // ─── debug ────────────────────────────────────────────────────────
  /**
   * When true, normally-silent failures (localStorage quota, malformed
   * persisted state, failed core fetch) emit `console.warn`. Production
   * bundles should keep this `false` (default) to avoid noise.
   */
  debug?: boolean;
}

export interface ProfilePreset {
  features?: Partial<Record<FeatureId, boolean>>;
  fontSizeLevel?: number;
  lineHeightLevel?: number;
  letterSpacingLevel?: number;
  contrastMode?: ContrastMode;
}

export const DEFAULT_STATE: WidgetState = {
  features: FEATURE_IDS.reduce(
    (acc, id) => {
      acc[id] = false;
      return acc;
    },
    {} as Record<FeatureId, boolean>,
  ),
  fontSizeLevel: 1,
  lineHeightLevel: 1.5,
  letterSpacingLevel: 0,
  contrastMode: 'off',
  oversized: false,
  fabPosition: null,
};

export const PROFILES: Record<ProfileId, ProfilePreset> = {
  visionImpaired: {
    features: {
      fontSize: true,
      contrast: true,
      highlightLinks: true,
      focusOutline: true,
      bigCursor: true,
    },
    fontSizeLevel: 1.4,
    contrastMode: 'high',
  },
  motor: {
    features: { bigCursor: true, focusOutline: true, pauseAnimations: true },
  },
  cognitive: {
    features: {
      dyslexiaFont: true,
      lineHeight: true,
      letterSpacing: true,
      readingGuide: true,
    },
    lineHeightLevel: 1.8,
    letterSpacingLevel: 0.05,
  },
  seizureSafe: {
    features: { pauseAnimations: true, grayscale: true },
  },
  adhd: {
    features: { readingMask: true, pauseAnimations: true, focusOutline: true },
  },
  blind: {
    features: { structureNav: true, highlightLinks: true, focusOutline: true },
  },
};
