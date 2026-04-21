import {
  CONTRAST_MODES,
  FEATURE_IDS,
  PROFILE_IDS,
  type FeatureId,
  type Locale,
  type WidgetState,
} from '../types/index.js';
import { createFocusTrap, type FocusTrap } from '../focus-trap.js';
import { make } from '../util/dom.js';
import { buildIcon, ICON_CLOSE } from '../util/svg.js';
import { t, type Translation } from '../i18n/index.js';
import { applyState } from '../features/apply.js';
import { applyProfile } from '../features/profile.js';
import { collectReadableText, ttsActive, ttsStart, ttsStop } from '../features/tts.js';
import { structureNavToggle } from '../features/structure-nav.js';
import { cycleStep, saveState, STEPS } from '../state.js';
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
}

export function openPanel(ctx: PanelContext): PanelHandle {
  const T = t(ctx.locale);
  let state = ctx.state;
  let liveEl: HTMLDivElement | null = null;
  let trap: FocusTrap | null = null;

  const root = make('div', {
    class: `bfsg-panel bfsg-panel--${ctx.config.position}`,
    attrs: {
      id: 'bfsg-panel',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'bfsg-panel-title',
      'data-bfsg-panel': '1',
      dir: ctx.locale === 'ar' ? 'rtl' : 'ltr',
      lang: ctx.locale,
    },
  });

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
    // Preserve currently focused element label for restoration
    const focusLabel =
      document.activeElement instanceof HTMLElement
        ? document.activeElement.getAttribute('aria-label')
        : null;

    while (root.firstChild) root.removeChild(root.firstChild);
    build();

    if (focusLabel) {
      const target = root.querySelector<HTMLElement>(`[aria-label="${CSS.escape(focusLabel)}"]`);
      target?.focus();
    }
  }

  function build(): void {
    // Header ---------------------------------------------------------
    const closeBtn = make('button', {
      class: 'bfsg-close',
      attrs: { type: 'button', 'aria-label': T.close },
      on: { click: ctx.onClose },
      children: [buildIcon({ ...ICON_CLOSE, width: 20, height: 20 })],
    });
    const title = make('h2', {
      class: 'bfsg-title',
      attrs: { id: 'bfsg-panel-title' },
      text: T.title,
    });
    const header = make('header', { class: 'bfsg-header', children: [title, closeBtn] });

    // Profiles -------------------------------------------------------
    const profGrid = make('div', {
      class: 'bfsg-profile-grid',
      attrs: { role: 'group', 'aria-label': T.profiles.h },
      children: PROFILE_IDS.map((id) =>
        make('button', {
          class: 'bfsg-profile-btn',
          attrs: { type: 'button', 'data-profile': id },
          text: T.profiles[id],
          on: {
            click: () => {
              commit(applyProfile(state, id), T.profiles[id]);
            },
          },
        }),
      ),
    });

    // Features -------------------------------------------------------
    const featGrid = make('div', {
      class: 'bfsg-feat-grid',
      attrs: { role: 'group', 'aria-label': T.features.h },
      children: FEATURE_IDS.map((id) => renderFeature(id, T)),
    });

    // Footer ---------------------------------------------------------
    const resetBtn = make('button', {
      class: 'bfsg-reset',
      attrs: { type: 'button' },
      text: T.reset,
      on: {
        click: () => {
          const fresh: WidgetState = {
            features: Object.fromEntries(FEATURE_IDS.map((id) => [id, false])) as WidgetState['features'],
            fontSizeLevel: 1,
            lineHeightLevel: 1.5,
            letterSpacingLevel: 0,
            contrastMode: 'off',
          };
          ttsStop();
          commit(fresh, T.resetDone);
        },
      },
    });

    liveEl = make('div', { class: 'bfsg-live', attrs: { 'aria-live': 'polite', 'aria-atomic': 'true' } });

    const footerChildren: HTMLElement[] = [resetBtn];
    if (ctx.statementUrl) {
      footerChildren.push(
        make('a', {
          class: 'bfsg-statement-link',
          attrs: { href: ctx.statementUrl },
          text: T.statementLink,
        }),
      );
    }
    footerChildren.push(
      make('p', { class: 'bfsg-disclaimer', text: T.disclaimer }),
      liveEl,
    );
    const footer = make('footer', { class: 'bfsg-footer', children: footerChildren });

    root.appendChild(header);
    root.appendChild(
      make('div', {
        class: 'bfsg-section',
        children: [make('h3', { class: 'bfsg-h3', text: T.profiles.h }), profGrid],
      }),
    );
    root.appendChild(
      make('div', {
        class: 'bfsg-section',
        children: [make('h3', { class: 'bfsg-h3', text: T.features.h }), featGrid],
      }),
    );
    root.appendChild(footer);
  }

  function renderFeature(id: FeatureId, T: Translation): HTMLButtonElement {
    const label = T.features[id];
    const active = state.features[id];
    const badge = computeBadge(id, T);

    const btn = make('button', {
      class: 'bfsg-feat' + (active ? ' is-on' : ''),
      attrs: {
        type: 'button',
        role: 'switch',
        'aria-checked': active ? 'true' : 'false',
        'aria-label': `${T.aria.switch} ${label}`,
        'data-feature': id,
      },
      children: [
        make('span', { class: 'bfsg-feat-label', text: label }),
        make('span', { class: 'bfsg-feat-badge', text: badge }),
      ],
      on: {
        click: () => onFeatureClick(id, label),
      },
    });
    return btn;
  }

  function computeBadge(id: FeatureId, T: Translation): string {
    if (id === 'fontSize') {
      return state.features.fontSize ? String(state.fontSizeLevel) : T.values.off;
    }
    if (id === 'lineHeight') {
      return state.features.lineHeight ? String(state.lineHeightLevel) : T.values.off;
    }
    if (id === 'letterSpacing') {
      return state.features.letterSpacing ? String(state.letterSpacingLevel) : T.values.off;
    }
    if (id === 'contrast') {
      return T.contrastLabels[state.contrastMode];
    }
    return state.features[id] ? T.values.on : T.values.off;
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
  root.querySelector<HTMLButtonElement>('.bfsg-close')?.focus();

  return {
    root,
    destroy: () => {
      trap?.deactivate();
      document.removeEventListener('keydown', onEsc);
      root.remove();
    },
    rerender,
  };
}
