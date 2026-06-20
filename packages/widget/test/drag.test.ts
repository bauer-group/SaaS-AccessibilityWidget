import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadPanelPosition, savePanelPosition, makeDraggable } from '../src/panel/drag.js';

const KEY = 'aw-test';

function dispatchPointer(
  target: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  init: PointerEventInit,
): PointerEvent {
  const ev = new PointerEvent(type, { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(ev);
  return ev;
}

/**
 * Build a root + handle fixture and stub the two DOM features jsdom lacks:
 *   - layout (getBoundingClientRect), so drag math has something to read
 *   - pointer capture, so makeDraggable doesn't throw
 *
 * The rect comes from inline style.left/top when set (drag writes those),
 * falling back to an initial offset (100, 100) — this way the test can see
 * the root "move" as the drag code updates the inline styles.
 */
function installRoot(width = 420, height = 300): { root: HTMLDivElement; handle: HTMLDivElement } {
  document.body.replaceChildren();
  const root = document.createElement('div');
  root.style.position = 'fixed';
  root.style.width = `${width}px`;
  root.style.height = `${height}px`;
  const handle = document.createElement('div');
  handle.setAttribute('data-aw-drag-handle', '1');
  root.appendChild(handle);
  document.body.appendChild(root);

  const rectFor = (el: HTMLElement) => {
    const left = el.style.left ? parseFloat(el.style.left) : 100;
    const top = el.style.top ? parseFloat(el.style.top) : 100;
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  };
  root.getBoundingClientRect = () => rectFor(root);
  handle.getBoundingClientRect = () => rectFor(handle);

  handle.setPointerCapture = () => {};

  handle.releasePointerCapture = () => {};
  handle.hasPointerCapture = () => true;

  return { root, handle };
}

describe('panel position persistence', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips coordinates under the derived storage key', () => {
    savePanelPosition(KEY, { x: 50, y: 80 });
    // Written under the "{storageKey}-pos" key, not the main storage key —
    // keeps runtime position decoupled from the user's feature state.
    expect(localStorage.getItem(`${KEY}-pos`)).toContain('50');
    expect(loadPanelPosition(KEY)).toEqual({ x: 50, y: 80 });
  });

  it('null clears the stored position', () => {
    savePanelPosition(KEY, { x: 10, y: 10 });
    savePanelPosition(KEY, null);
    expect(loadPanelPosition(KEY)).toBeNull();
  });

  it('returns null on corrupt JSON', () => {
    localStorage.setItem(`${KEY}-pos`, '{malformed');
    expect(loadPanelPosition(KEY)).toBeNull();
  });

  it('rejects payloads with non-numeric coords', () => {
    localStorage.setItem(`${KEY}-pos`, JSON.stringify({ x: 'nope', y: 5 }));
    expect(loadPanelPosition(KEY)).toBeNull();
  });
});

describe('makeDraggable', () => {
  beforeEach(() => localStorage.clear());

  it('leaves CSS-class positioning intact when no position is persisted', () => {
    // Initialising with no stored position must NOT set inline coords — the
    // panel keeps whatever its `.aw-panel--bottom-right` class dictates.
    const { root, handle } = installRoot();
    makeDraggable({ root, handle, storageKey: KEY });
    expect(root.style.left).toBe('');
    expect(root.style.top).toBe('');
    expect(root.hasAttribute('data-aw-moved')).toBe(false);
  });

  it('restores a persisted position synchronously on construction', () => {
    savePanelPosition(KEY, { x: 42, y: 64 });
    const { root, handle } = installRoot();
    makeDraggable({ root, handle, storageKey: KEY });
    expect(root.style.left).toBe('42px');
    expect(root.style.top).toBe('64px');
    expect(root.getAttribute('data-aw-moved')).toBe('1');
  });

  it('pointerdown + pointermove + pointerup translates root and persists', () => {
    const { root, handle } = installRoot();
    const onChange = vi.fn();
    makeDraggable({ root, handle, storageKey: KEY, onChange });

    dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 150, clientY: 150, button: 0 });
    dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 220, clientY: 180 });
    dispatchPointer(handle, 'pointerup', { pointerId: 1, clientX: 220, clientY: 180 });

    // Start was left=100, a 70px drag right + 30px down ⇒ 170, 130.
    expect(root.style.left).toBe('170px');
    expect(root.style.top).toBe('130px');
    expect(loadPanelPosition(KEY)).toEqual({ x: 170, y: 130 });
    expect(onChange).toHaveBeenCalledWith({ x: 170, y: 130 });
  });

  it('pointerdown on interactive child is ignored (close button, select …)', () => {
    const { root, handle } = installRoot();
    const closeBtn = document.createElement('button');
    handle.appendChild(closeBtn);
    makeDraggable({ root, handle, storageKey: KEY });

    dispatchPointer(closeBtn, 'pointerdown', {
      pointerId: 1,
      clientX: 150,
      clientY: 150,
      button: 0,
    });
    dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 300, clientY: 300 });

    // No drag should have happened — style.left stays empty (CSS rules apply)
    // and no position is persisted.
    expect(root.style.left).toBe('');
    expect(root.hasAttribute('data-aw-moved')).toBe(false);
    expect(loadPanelPosition(KEY)).toBeNull();
  });

  it('clamps movement to stay inside the viewport with an 8 px margin', () => {
    const { root, handle } = installRoot(420, 300);
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    makeDraggable({ root, handle, storageKey: KEY });
    dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 150, clientY: 150, button: 0 });
    // Drag wildly beyond the right/bottom edges.
    dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 9999, clientY: 9999 });
    dispatchPointer(handle, 'pointerup', { pointerId: 1, clientX: 9999, clientY: 9999 });

    const stored = loadPanelPosition(KEY)!;
    // Max x = 1000 - 420 - 8 = 572; max y = 800 - 300 - 8 = 492.
    expect(stored.x).toBe(572);
    expect(stored.y).toBe(492);
  });

  it('Ctrl+Shift+Arrow moves in 20 px steps and persists each keystroke', () => {
    const { root, handle } = installRoot();
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    makeDraggable({ root, handle, storageKey: KEY });
    root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(root.style.left).toBe('120px');
    expect(loadPanelPosition(KEY)).toEqual({ x: 120, y: 100 });
  });

  it('plain Arrow (no modifiers) is ignored — pattern matches Ctrl+Shift only', () => {
    const { root, handle } = installRoot();
    makeDraggable({ root, handle, storageKey: KEY });
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(root.style.left).toBe('');
    expect(loadPanelPosition(KEY)).toBeNull();
  });

  it('reset() clears the in-memory position and the storage entry', () => {
    const { root, handle } = installRoot();
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    const drag = makeDraggable({ root, handle, storageKey: KEY });
    // Move once to create persisted state.
    dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 150, clientY: 150, button: 0 });
    dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 160, clientY: 160 });
    dispatchPointer(handle, 'pointerup', { pointerId: 1, clientX: 160, clientY: 160 });
    expect(loadPanelPosition(KEY)).not.toBeNull();

    drag.reset();
    expect(loadPanelPosition(KEY)).toBeNull();
    expect(root.hasAttribute('data-aw-moved')).toBe(false);
    expect(root.style.left).toBe('');
  });

  it('destroy() detaches pointer listeners — subsequent events are no-ops', () => {
    const { root, handle } = installRoot();
    const onChange = vi.fn();
    const drag = makeDraggable({ root, handle, storageKey: KEY, onChange });
    drag.destroy();

    dispatchPointer(handle, 'pointerdown', { pointerId: 1, clientX: 150, clientY: 150, button: 0 });
    dispatchPointer(handle, 'pointermove', { pointerId: 1, clientX: 200, clientY: 200 });
    dispatchPointer(handle, 'pointerup', { pointerId: 1, clientX: 200, clientY: 200 });

    expect(onChange).not.toHaveBeenCalled();
    // No drag means no inline position got written — CSS stays in control.
    expect(root.style.left).toBe('');
    expect(root.hasAttribute('data-aw-moved')).toBe(false);
  });
});
