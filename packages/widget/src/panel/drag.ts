/**
 * Panel drag-to-move — pointer-events based, with pointer capture so the drag
 * survives the cursor leaving the panel. Position is persisted per device via
 * a dedicated localStorage key, intentionally separate from WidgetState so the
 * loader does not touch it before first paint.
 *
 * Keyboard users get an equivalent shortcut (Ctrl+Shift+Arrow) — a draggable
 * accessibility widget with no keyboard path would be self-defeating.
 */

import { warnIfDebug } from '../util/debug.js';

export interface PanelPosition {
  /** Left offset in pixels from the viewport edge. */
  x: number;
  /** Top offset in pixels from the viewport edge. */
  y: number;
}

const KEYBOARD_STEP = 20;
const EDGE_MARGIN = 8;

export interface DraggableOptions {
  root: HTMLElement;
  handle: HTMLElement;
  storageKey: string;
  /** Called with null when the user resets, otherwise with the new position. */
  onChange?: (pos: PanelPosition | null) => void;
}

export interface DraggableHandle {
  /** Re-apply the saved position (call after rerender). */
  restore(): void;
  /** Remove listeners. */
  destroy(): void;
  /** Clear saved position. */
  reset(): void;
}

export function loadPanelPosition(storageKey: string): PanelPosition | null {
  try {
    const raw = localStorage.getItem(positionKey(storageKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PanelPosition>;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null;
    return { x: parsed.x, y: parsed.y };
  } catch (err) {
    warnIfDebug('loadPanelPosition failed', err);
    return null;
  }
}

export function savePanelPosition(storageKey: string, pos: PanelPosition | null): void {
  try {
    if (pos === null) localStorage.removeItem(positionKey(storageKey));
    else localStorage.setItem(positionKey(storageKey), JSON.stringify(pos));
  } catch (err) {
    warnIfDebug('savePanelPosition failed', err);
  }
}

function positionKey(storageKey: string): string {
  return `${storageKey}-pos`;
}

export function makeDraggable(opts: DraggableOptions): DraggableHandle {
  const { root, handle, storageKey, onChange } = opts;

  let current: PanelPosition | null = loadPanelPosition(storageKey);
  applyPosition(root, current);

  // One controller owns every listener this handle registers, so destroy() is
  // a single abort() instead of a remove-per-listener checklist that can drift.
  const ac = new AbortController();
  const { signal } = ac;

  // --- Pointer drag --------------------------------------------------------
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let pointerId = -1;

  function onPointerDown(ev: PointerEvent): void {
    // Only primary button / primary touch.
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    // Don't steal clicks from interactive controls within the handle.
    const target = ev.target as Element | null;
    if (
      target &&
      target.closest('button, a, input, select, [role="button"]') &&
      target !== handle
    ) {
      return;
    }
    const rect = root.getBoundingClientRect();
    dragging = true;
    pointerId = ev.pointerId;
    startX = ev.clientX;
    startY = ev.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    handle.setPointerCapture(pointerId);
    handle.classList.add('is-dragging');
    ev.preventDefault();
  }

  function onPointerMove(ev: PointerEvent): void {
    if (!dragging || ev.pointerId !== pointerId) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const next = clampToViewport({ x: startLeft + dx, y: startTop + dy }, root);
    current = next;
    applyPosition(root, next);
  }

  function onPointerUp(ev: PointerEvent): void {
    if (!dragging || ev.pointerId !== pointerId) return;
    dragging = false;
    if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
    handle.classList.remove('is-dragging');
    pointerId = -1;
    if (current) {
      savePanelPosition(storageKey, current);
      onChange?.(current);
    }
  }

  handle.addEventListener('pointerdown', onPointerDown, { signal });
  handle.addEventListener('pointermove', onPointerMove, { signal });
  handle.addEventListener('pointerup', onPointerUp, { signal });
  handle.addEventListener('pointercancel', onPointerUp, { signal });

  // --- Keyboard fallback ---------------------------------------------------
  function onKey(ev: KeyboardEvent): void {
    if (!ev.ctrlKey || !ev.shiftKey) return;
    const rect = root.getBoundingClientRect();
    let { left, top } = rect;
    let moved = false;
    switch (ev.key) {
      case 'ArrowLeft':
        left -= KEYBOARD_STEP;
        moved = true;
        break;
      case 'ArrowRight':
        left += KEYBOARD_STEP;
        moved = true;
        break;
      case 'ArrowUp':
        top -= KEYBOARD_STEP;
        moved = true;
        break;
      case 'ArrowDown':
        top += KEYBOARD_STEP;
        moved = true;
        break;
    }
    if (!moved) return;
    ev.preventDefault();
    const next = clampToViewport({ x: left, y: top }, root);
    current = next;
    applyPosition(root, next);
    savePanelPosition(storageKey, next);
    onChange?.(next);
  }
  root.addEventListener('keydown', onKey, { signal });

  return {
    restore: () => applyPosition(root, current),
    reset: () => {
      current = null;
      savePanelPosition(storageKey, null);
      clearPosition(root);
      onChange?.(null);
    },
    destroy: () => ac.abort(),
  };
}

function applyPosition(root: HTMLElement, pos: PanelPosition | null): void {
  if (!pos) {
    clearPosition(root);
    return;
  }
  root.style.left = `${pos.x}px`;
  root.style.top = `${pos.y}px`;
  root.style.right = 'auto';
  root.style.bottom = 'auto';
  root.setAttribute('data-aw-moved', '1');
}

function clearPosition(root: HTMLElement): void {
  root.style.left = '';
  root.style.top = '';
  root.style.right = '';
  root.style.bottom = '';
  root.removeAttribute('data-aw-moved');
}

function clampToViewport(pos: PanelPosition, root: HTMLElement): PanelPosition {
  const rect = root.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - EDGE_MARGIN;
  const maxY = window.innerHeight - rect.height - EDGE_MARGIN;
  return {
    x: Math.max(EDGE_MARGIN, Math.min(pos.x, Math.max(EDGE_MARGIN, maxX))),
    y: Math.max(EDGE_MARGIN, Math.min(pos.y, Math.max(EDGE_MARGIN, maxY))),
  };
}
