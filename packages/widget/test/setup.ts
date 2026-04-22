/**
 * Test environment setup.
 *
 * Both happy-dom@17 and jsdom@26 ship broken `localStorage` implementations
 * at the moment — happy-dom lacks `.clear()`, jsdom 26 sets the prototype to
 * plain Object instead of Storage (methods absent). Until upstream fixes,
 * we install a spec-compliant in-memory Storage before each suite.
 *
 * jsdom 26 also has no PointerEvent constructor — any test that drives the
 * drag module or the FAB click path would blow up at runtime. We polyfill it
 * here as a thin MouseEvent extension carrying the two fields our code reads.
 */
import { beforeEach } from 'vitest';

// jsdom 26 does not expose `globalThis.CSS` — panel.ts uses `CSS.escape()`
// to build a safe attribute selector for focus restoration. Polyfill to the
// minimal surface our code actually calls.
const cssGlobal = (globalThis as unknown as { CSS?: { escape?(s: string): string } }).CSS;
if (!cssGlobal?.escape) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    writable: true,
    value: {
      ...(cssGlobal ?? {}),
      escape(s: string): string {
        return String(s).replace(/["\\]/g, '\\$&');
      },
    },
  });
}

if (typeof PointerEvent === 'undefined') {
  class PolyPointerEvent extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  Object.defineProperty(globalThis, 'PointerEvent', {
    configurable: true,
    writable: true,
    value: PolyPointerEvent,
  });
}

class InMemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length(): number {
    return this.data.size;
  }
  clear(): void {
    this.data.clear();
  }
  getItem(key: string): string | null {
    return this.data.has(key) ? (this.data.get(key) as string) : null;
  }
  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }
}

function installStorage(): void {
  const store = new InMemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: store,
  });
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: store,
    });
  }
}

installStorage();
beforeEach(installStorage);
