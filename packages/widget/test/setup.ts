/**
 * Test environment setup.
 *
 * Both happy-dom@17 and jsdom@26 ship broken `localStorage` implementations
 * at the moment — happy-dom lacks `.clear()`, jsdom 26 sets the prototype to
 * plain Object instead of Storage (methods absent). Until upstream fixes,
 * we install a spec-compliant in-memory Storage before each suite.
 */
import { beforeEach } from 'vitest';

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
