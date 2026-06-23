import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cornerForPoint, openPanel, type PanelHandle } from '../src/panel/panel.js';
import { resolveConfig } from '../src/config.js';
import { DEFAULT_STATE, type Position } from '../src/types/index.js';

describe('cornerForPoint', () => {
  // 1000×800 viewport ⇒ midpoints at x=500, y=400.
  const vw = 1000;
  const vh = 800;

  it('maps each quadrant to its corner', () => {
    expect(cornerForPoint(100, 100, vw, vh)).toBe('top-left');
    expect(cornerForPoint(900, 100, vw, vh)).toBe('top-right');
    expect(cornerForPoint(100, 700, vw, vh)).toBe('bottom-left');
    expect(cornerForPoint(900, 700, vw, vh)).toBe('bottom-right');
  });

  it('resolves exact-center ties to bottom-right (the configured default)', () => {
    // cx === vw/2 and cy === vh/2 are NOT "< half", so both fall to the
    // far edge — keeps a centered FAB behaving like the default anchor.
    expect(cornerForPoint(500, 400, vw, vh)).toBe('bottom-right');
  });
});

describe('panel anchor follows a moved FAB', () => {
  let handle: PanelHandle | null = null;

  function installFab(rect: { left: number; top: number }, custom = true): HTMLButtonElement {
    const fab = document.createElement('button');
    fab.setAttribute('data-aw-fab', '1');
    if (custom) fab.setAttribute('data-aw-fab-pos', 'custom');
    const size = 48;
    fab.getBoundingClientRect = () =>
      ({
        left: rect.left,
        top: rect.top,
        right: rect.left + size,
        bottom: rect.top + size,
        width: size,
        height: size,
        x: rect.left,
        y: rect.top,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(fab);
    return fab;
  }

  function open(position: Position): PanelHandle {
    const config = resolveConfig({ position }, 'en');
    handle = openPanel({
      config,
      locale: 'en',
      state: structuredClone(DEFAULT_STATE),
      onClose: () => {},
      onStateChange: () => {},
    });
    return handle;
  }

  beforeEach(() => {
    document.body.replaceChildren();
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => {
    handle?.destroy();
    handle = null;
    document.body.replaceChildren();
  });

  it('reproduces the bug fix: FAB dragged bottom-left ⇒ panel anchors bottom-left, not the configured bottom-right', () => {
    installFab({ left: 10, top: 720 }); // center ≈ (34, 744) → bottom-left
    const { root } = open('bottom-right');
    expect(root.className).toContain('aw-panel--bottom-left');
    expect(root.className).not.toContain('aw-panel--bottom-right');
  });

  it('follows the FAB into the top-right quadrant', () => {
    installFab({ left: 930, top: 20 }); // center ≈ (954, 44) → top-right
    const { root } = open('bottom-left');
    expect(root.className).toContain('aw-panel--top-right');
  });

  it('uses the configured corner when the FAB has no custom position', () => {
    installFab({ left: 10, top: 720 }, /* custom */ false);
    const { root } = open('bottom-right');
    expect(root.className).toContain('aw-panel--bottom-right');
  });

  it('uses the configured corner when no FAB is present', () => {
    const { root } = open('top-left');
    expect(root.className).toContain('aw-panel--top-left');
  });
});
