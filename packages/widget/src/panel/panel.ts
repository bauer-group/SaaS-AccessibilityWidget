import {
  CONTRAST_MODES,
  FEATURE_IDS,
  PROFILE_IDS,
  SUPPORTED_LOCALES,
  isLocale,
  isRtl,
  type FeatureId,
  type Locale,
  type WidgetState,
} from '../types/index.js';
import { createFocusTrap, type FocusTrap } from '../focus-trap.js';
import { make } from '../util/dom.js';
import { buildIcon, ICON_CLOSE } from '../util/svg.js';
import {
  FEATURE_ICONS,
  ICON_CHECK,
  ICON_CHEVRON,
  ICON_GLOBE,
  ICON_GRIP,
  ICON_INFO,
  ICON_MAXIMIZE,
  ICON_RESET,
} from '../util/feature-icons.js';
import { LANGUAGE_NAMES } from '../util/language-names.js';
import { makeDraggable, type DraggableHandle } from './drag.js';
import { t, translations, type Translation } from '../i18n/index.js';
import { applyState } from '../features/apply.js';
import { applyProfile } from '../features/profile.js';
import { collectReadableText, ttsActive, ttsStart, ttsStop } from '../features/tts.js';
import { structureNavToggle } from '../features/structure-nav.js';
import { cycleStep, saveState, STEPS } from '../state.js';

interface CycleDescriptor {
  readonly steps: readonly (number | string)[];
  readonly index: number;
  readonly max: number;
  readonly label: string;
}

function indexIn<T extends number | string>(steps: readonly T[], value: T): number {
  const i = (steps as readonly unknown[]).indexOf(value);
  return i < 0 ? 0 : i;
}

function describeCycle(id: FeatureId, state: WidgetState, T: Translation): CycleDescriptor | null {
  switch (id) {
    case 'fontSize':
      return {
        steps: STEPS.fontSize,
        index: state.features.fontSize ? indexIn(STEPS.fontSize, state.fontSizeLevel as never) : 0,
        max: STEPS.fontSize.length - 1,
        label: state.features.fontSize ? String(state.fontSizeLevel) : T.values.off,
      };
    case 'lineHeight':
      return {
        steps: STEPS.lineHeight,
        index: state.features.lineHeight
          ? indexIn(STEPS.lineHeight, state.lineHeightLevel as never)
          : 0,
        max: STEPS.lineHeight.length - 1,
        label: state.features.lineHeight ? String(state.lineHeightLevel) : T.values.off,
      };
    case 'letterSpacing':
      return {
        steps: STEPS.letterSpacing,
        index: state.features.letterSpacing
          ? indexIn(STEPS.letterSpacing, state.letterSpacingLevel as never)
          : 0,
        max: STEPS.letterSpacing.length - 1,
        label: state.features.letterSpacing ? String(state.letterSpacingLevel) : T.values.off,
      };
    case 'contrast':
      return {
        steps: STEPS.contrast,
        index: indexIn(STEPS.contrast, state.contrastMode),
        max: STEPS.contrast.length - 1,
        label: T.contrastLabels[state.contrastMode],
      };
    default:
      return null;
  }
}

function featureDescription(id: FeatureId, T: Translation): string {
  return T.featureDescriptions?.[id] ?? translations.en.featureDescriptions?.[id] ?? '';
}

function renderStageDots(currentIndex: number, max: number): HTMLElement {
  const dots: HTMLElement[] = [];
  for (let i = 0; i <= max; i += 1) {
    dots.push(
      make('span', {
        class: 'aw-stage-dot' + (i <= currentIndex && currentIndex > 0 ? ' is-filled' : ''),
      }),
    );
  }
  return make('span', {
    class: 'aw-stage-dots',
    attrs: { 'aria-hidden': 'true' },
    children: dots,
  });
}
import type { ResolvedConfig } from '../config.js';

interface PanelContext {
  config: ResolvedConfig;
  locale: Locale;
  state: WidgetState;
  statementUrl?: string;
  onClose: () => void;
  onStateChange: (s: WidgetState) => void;
}

export interface PanelHandle {
  root: HTMLDivElement;
  destroy(): void;
  rerender(): void;
  /**
   * Swap the active locale while the panel stays open. Silently no-ops
   * when the locale is already active or not supported.
   */
  setLocale(next: Locale): void;
}

export function openPanel(ctx: PanelContext): PanelHandle {
  let locale = ctx.locale;
  let T = t(locale);
  let state = ctx.state;
  let liveEl: HTMLDivElement | null = null;
  let trap: FocusTrap | null = null;
  let drag: DraggableHandle | null = null;

  const root = make('div', {
    class: `aw-panel aw-panel--${ctx.config.position}`,
    attrs: {
      id: 'aw-panel',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'aw-panel-title',
      'data-aw-panel': '1',
      dir: isRtl(locale) ? 'rtl' : 'ltr',
      lang: locale,
    },
  });

  function applyLocaleAttrs(): void {
    root.setAttribute('dir', isRtl(locale) ? 'rtl' : 'ltr');
    root.setAttribute('lang', locale);
  }

  function applyOversized(): void {
    root.classList.toggle('aw-panel--xl', Boolean(state.oversized));
  }
  applyOversized();

  function announce(text: string): void {
    if (liveEl) liveEl.textContent = text;
  }

  function commit(next: WidgetState, message?: string): void {
    state = next;
    applyState(state);
    saveState(ctx.config.storageKey, state);
    ctx.onStateChange(state);
    if (message) announce(message);
    rerender();
  }

  function rerender(): void {
    // Preserve focus across re-render via a language-stable selector.
    // aria-label would break when the user switches locale mid-session.
    const focusSelector = focusRestoreSelector();

    while (root.firstChild) root.removeChild(root.firstChild);
    build();
    attachDrag();

    if (focusSelector) root.querySelector<HTMLElement>(focusSelector)?.focus();
  }

  // Forward declaration so build()/commit() can reference it; defined below
  // after the initial DOM exists because it reads from `root` directly.
  function attachDrag(): void {
    const handle = root.querySelector<HTMLElement>('[data-aw-drag-handle]');
    if (!handle) return;
    drag?.destroy();
    drag = makeDraggable({ root, handle, storageKey: ctx.config.storageKey });
  }

  function focusRestoreSelector(): string | null {
    const el = document.activeElement;
    if (!(el instanceof HTMLElement) || !root.contains(el)) return null;
    for (const attr of ['data-feature', 'data-profile', 'data-aw-action'] as const) {
      const v = el.getAttribute(attr);
      if (v) return `[${attr}="${CSS.escape(v)}"]`;
    }
    return null;
  }

  function build(): void {
    // Header ---------------------------------------------------------
    const closeBtn = make('button', {
      class: 'aw-close',
      attrs: { type: 'button', 'aria-label': T.close, 'data-aw-action': 'close' },
      on: { click: ctx.onClose },
      children: [buildIcon({ ...ICON_CLOSE, width: 20, height: 20 })],
    });
    const title = make('h2', {
      class: 'aw-title',
      attrs: { id: 'aw-panel-title' },
      text: T.title,
    });
    const gripIcon = make('span', {
      class: 'aw-drag-grip',
      attrs: { 'aria-hidden': 'true' },
      children: [buildIcon({ ...ICON_GRIP, width: 20, height: 20 })],
    });
    const header = make('header', {
      class: 'aw-header',
      attrs: { 'data-aw-drag-handle': '1', title: T.aria.dragHandle },
      children: [gripIcon, title, closeBtn],
    });

    // Toolbar: language + oversized ---------------------------------
    const langSelect = make('select', {
      class: 'aw-lang',
      attrs: { 'aria-label': T.aria.language, 'data-aw-action': 'language' },
      children: SUPPORTED_LOCALES.map((loc) =>
        make('option', {
          attrs: { value: loc, selected: loc === locale },
          text: LANGUAGE_NAMES[loc],
        }),
      ),
      on: {
        change: (ev) => {
          const next = (ev.target as HTMLSelectElement).value;
          if (isLocale(next) && next !== locale) {
            setActiveLocale(next);
          }
        },
      },
    });
    const langWrap = make('label', {
      class: 'aw-tool aw-tool--lang',
      children: [
        buildIcon({ ...ICON_GLOBE, width: 18, height: 18 }),
        langSelect,
      ],
    });

    const oversizedBtn = make('button', {
      class: 'aw-tool aw-tool--oversize' + (state.oversized ? ' is-on' : ''),
      attrs: {
        type: 'button',
        role: 'switch',
        'aria-checked': state.oversized ? 'true' : 'false',
        'aria-label': T.aria.oversized,
        'data-aw-action': 'oversized',
      },
      children: [
        buildIcon({ ...ICON_MAXIMIZE, width: 18, height: 18 }),
        make('span', { text: T.aria.oversized }),
      ],
      on: {
        click: () => {
          const next = !state.oversized;
          commit({ ...state, oversized: next }, T.aria.oversized);
          applyOversized();
        },
      },
    });

    const toolbar = make('div', {
      class: 'aw-toolbar',
      attrs: { role: 'group', 'aria-label': T.title },
      children: [langWrap, oversizedBtn],
    });

    // Profiles -------------------------------------------------------
    const profGrid = make('div', {
      class: 'aw-profile-grid',
      attrs: { role: 'group', 'aria-label': T.profiles.h },
      children: PROFILE_IDS.map((id) =>
        make('button', {
          class: 'aw-profile-btn',
          attrs: { type: 'button', 'data-profile': id },
          text: T.profiles[id],
          on: {
            click: () => {
              const next = applyProfile(state, id);
              // Strip features the host has disabled so profile presets
              // can't re-enable them.
              for (const disabled of ctx.config.disabledFeatures) {
                next.features[disabled] = false;
              }
              commit(next, T.profiles[id]);
            },
          },
        }),
      ),
    });

    // Features -------------------------------------------------------
    const visibleFeatures = FEATURE_IDS.filter(
      (id) => !ctx.config.disabledFeatures.has(id),
    );
    const featGrid = make('div', {
      class: 'aw-feat-grid',
      attrs: { role: 'group', 'aria-label': T.features.h },
      children: visibleFeatures.map((id) => renderFeature(id, T)),
    });

    // Footer ---------------------------------------------------------
    const resetBtn = make('button', {
      class: 'aw-reset',
      attrs: { type: 'button', 'data-aw-action': 'reset' },
      children: [
        buildIcon({ ...ICON_RESET, width: 18, height: 18 }),
        make('span', { text: T.reset }),
      ],
      on: {
        click: () => {
          // Also clear any drag-dropped FAB position so it returns to its
          // config-defined anchor on next paint (user reset-intent spans
          // feature toggles AND visual overrides).
          const fab = document.querySelector<HTMLElement>('[data-aw-fab]');
          if (fab) {
            fab.removeAttribute('data-aw-fab-pos');
            fab.style.removeProperty('--aw-fab-x');
            fab.style.removeProperty('--aw-fab-y');
          }
          const fresh: WidgetState = {
            features: Object.fromEntries(FEATURE_IDS.map((id) => [id, false])) as WidgetState['features'],
            fontSizeLevel: 1,
            lineHeightLevel: 1.5,
            letterSpacingLevel: 0,
            contrastMode: 'off',
            fabPosition: null,
          };
          ttsStop();
          commit(fresh, T.resetDone);
        },
      },
    });

    liveEl = make('div', { class: 'aw-live', attrs: { 'aria-live': 'polite', 'aria-atomic': 'true' } });

    const footerChildren: HTMLElement[] = [resetBtn];
    if (ctx.statementUrl) {
      // Absolute / protocol-relative URLs point at a different origin;
      // open those in a new tab so the user doesn't lose their panel state
      // when reading the statement. rel=noopener+noreferrer is the standard
      // hardening against reverse-tabnabbing + referrer leakage on _blank.
      const isExternal = /^(?:https?:)?\/\//i.test(ctx.statementUrl);
      const attrs: Record<string, string> = { href: ctx.statementUrl };
      if (isExternal) {
        attrs.target = '_blank';
        attrs.rel = 'noopener noreferrer';
      }
      footerChildren.push(
        make('a', {
          class: 'aw-statement-link',
          attrs,
          text: T.statementLink,
        }),
      );
    }
    footerChildren.push(
      make('p', { class: 'aw-disclaimer', text: T.disclaimer }),
      liveEl,
    );
    const footer = make('footer', { class: 'aw-footer', children: footerChildren });

    root.appendChild(header);
    root.appendChild(toolbar);

    const profSummary = make('summary', {
      class: 'aw-h3 aw-summary',
      children: [
        make('span', { text: T.profiles.h }),
        buildIcon({ ...ICON_CHEVRON, width: 16, height: 16 }),
      ],
    });
    const profDetails = make('details', {
      class: 'aw-section aw-collapsible',
      attrs: { open: true },
      children: [profSummary, profGrid],
    });
    root.appendChild(profDetails);

    root.appendChild(
      make('div', {
        class: 'aw-section',
        children: [make('h3', { class: 'aw-h3', text: T.features.h }), featGrid],
      }),
    );
    root.appendChild(footer);
  }

  function renderFeature(id: FeatureId, T: Translation): HTMLElement {
    const label = T.features[id];
    const active = state.features[id];
    const cycle = describeCycle(id, state, T);
    const isCycle = cycle !== null;
    const description = featureDescription(id, T);

    const iconSpec = FEATURE_ICONS[id];
    const iconEl = make('span', {
      class: 'aw-feat-icon',
      children: [buildIcon({ ...iconSpec, width: 28, height: 28 })],
    });

    const activeBadge = make('span', {
      class: 'aw-feat-check',
      attrs: { 'aria-hidden': 'true' },
      children: [buildIcon({ ...ICON_CHECK, width: 14, height: 14 })],
    });

    const descId = `aw-desc-${id}`;
    const infoBadge = description
      ? make('span', {
          class: 'aw-feat-info',
          attrs: { 'aria-hidden': 'true', role: 'img', 'aria-label': T.aria.info },
          children: [buildIcon({ ...ICON_INFO, width: 14, height: 14 })],
        })
      : null;
    const descEl = description
      ? make('span', {
          class: 'aw-feat-tooltip',
          attrs: { id: descId, role: 'tooltip' },
          text: description,
        })
      : null;

    const children: (HTMLElement | null)[] = [
      infoBadge,
      iconEl,
      make('span', { class: 'aw-feat-label', text: label }),
    ];
    if (cycle) {
      children.push(renderStageDots(cycle.index, cycle.max));
      children.push(make('span', { class: 'aw-feat-badge', text: cycle.label }));
    } else {
      children.push(
        make('span', {
          class: 'aw-feat-badge',
          text: active ? T.values.on : T.values.off,
        }),
      );
    }
    children.push(activeBadge);

    const attrs: Record<string, string> = {
      type: 'button',
      'aria-label': `${T.aria.switch} ${label}`,
      'data-feature': id,
    };
    if (description) attrs['aria-describedby'] = descId;
    if (isCycle && cycle) {
      // Multi-stage control: expose slider semantics so screenreaders announce "step 2 of 3".
      attrs.role = 'slider';
      attrs['aria-valuemin'] = '0';
      attrs['aria-valuemax'] = String(cycle.max);
      attrs['aria-valuenow'] = String(cycle.index);
      attrs['aria-valuetext'] = cycle.label;
    } else {
      attrs.role = 'switch';
      attrs['aria-checked'] = active ? 'true' : 'false';
    }

    const button = make('button', {
      class: 'aw-feat' + (active ? ' is-on' : ''),
      attrs,
      children: children.filter((c): c is HTMLElement => c !== null),
      on: { click: () => onFeatureClick(id, label) },
    });

    if (!descEl) return button;
    return make('div', {
      class: 'aw-feat-wrap',
      children: [button, descEl],
    });
  }

  function onFeatureClick(id: FeatureId, label: string): void {
    if (id === 'tts') {
      if (ttsActive()) {
        ttsStop();
        commit({ ...state, features: { ...state.features, tts: false } }, label);
      } else {
        const text = collectReadableText();
        ttsStart(text, ctx.locale);
        commit({ ...state, features: { ...state.features, tts: true } }, label);
      }
      return;
    }
    if (id === 'structureNav') {
      const opened = structureNavToggle(T.aria.dialog);
      commit({ ...state, features: { ...state.features, structureNav: opened } }, label);
      return;
    }
    if (id === 'fontSize') {
      const { next, wrapped } = cycleStep(state.fontSizeLevel, STEPS.fontSize);
      commit(
        {
          ...state,
          fontSizeLevel: next,
          features: { ...state.features, fontSize: !wrapped },
        },
        label,
      );
      return;
    }
    if (id === 'lineHeight') {
      const { next, wrapped } = cycleStep(state.lineHeightLevel, STEPS.lineHeight);
      commit(
        {
          ...state,
          lineHeightLevel: next,
          features: { ...state.features, lineHeight: !wrapped },
        },
        label,
      );
      return;
    }
    if (id === 'letterSpacing') {
      const { next, wrapped } = cycleStep(state.letterSpacingLevel, STEPS.letterSpacing);
      commit(
        {
          ...state,
          letterSpacingLevel: next,
          features: { ...state.features, letterSpacing: !wrapped },
        },
        label,
      );
      return;
    }
    if (id === 'contrast') {
      const { next, wrapped } = cycleStep(state.contrastMode, CONTRAST_MODES);
      commit(
        {
          ...state,
          contrastMode: next,
          features: { ...state.features, contrast: !wrapped },
        },
        label,
      );
      return;
    }
    commit({ ...state, features: { ...state.features, [id]: !state.features[id] } }, label);
  }

  function onEsc(e: KeyboardEvent): void {
    if (e.key === 'Escape') ctx.onClose();
  }

  build();
  document.body.appendChild(root);
  trap = createFocusTrap(root);
  trap.activate();
  document.addEventListener('keydown', onEsc);
  root.querySelector<HTMLButtonElement>('.aw-close')?.focus();
  attachDrag();

  function setActiveLocale(next: Locale): void {
    if (next === locale || !isLocale(next)) return;
    locale = next;
    T = t(locale);
    applyLocaleAttrs();
    // Persist to state so the new locale survives page reload.
    state = { ...state, locale: next };
    saveState(ctx.config.storageKey, state);
    ctx.onStateChange(state);
    announce(LANGUAGE_NAMES[locale]);
    rerender();
  }

  return {
    root,
    destroy: () => {
      trap?.deactivate();
      drag?.destroy();
      drag = null;
      document.removeEventListener('keydown', onEsc);
      root.remove();
    },
    rerender,
    setLocale: setActiveLocale,
  };
}
