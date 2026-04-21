const FOCUSABLE =
  'button,[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

export function createFocusTrap(root: HTMLElement): FocusTrap {
  function onKey(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const list = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
    );
    if (list.length === 0) {
      e.preventDefault();
      return;
    }
    const first = list[0]!;
    const last = list[list.length - 1]!;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && active === last) {
      first.focus();
      e.preventDefault();
    }
  }

  return {
    activate: () => root.addEventListener('keydown', onKey),
    deactivate: () => root.removeEventListener('keydown', onKey),
  };
}
