let maskEl: HTMLDivElement | null = null;
let handler: ((e: MouseEvent | TouchEvent) => void) | null = null;

export function readingMaskApply(on: boolean): void {
  if (on && !maskEl) {
    maskEl = document.createElement('div');
    maskEl.className = 'bfsg-reading-mask';
    maskEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(maskEl);
    handler = (e) => {
      const y = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;
      maskEl!.style.setProperty('--bfsg-mask-y', `${y}px`);
    };
    document.addEventListener('mousemove', handler as EventListener, { passive: true });
    document.addEventListener('touchmove', handler as EventListener, { passive: true });
  } else if (!on && maskEl) {
    if (handler) {
      document.removeEventListener('mousemove', handler as EventListener);
      document.removeEventListener('touchmove', handler as EventListener);
    }
    maskEl.remove();
    maskEl = null;
    handler = null;
  }
}
