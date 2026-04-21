let guideEl: HTMLDivElement | null = null;
let handler: ((e: MouseEvent | TouchEvent) => void) | null = null;

export function readingGuideApply(on: boolean): void {
  if (on && !guideEl) {
    guideEl = document.createElement('div');
    guideEl.className = 'bfsg-reading-guide';
    guideEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guideEl);
    handler = (e) => {
      const y = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;
      guideEl!.style.top = `${y - 16}px`;
    };
    document.addEventListener('mousemove', handler as EventListener, { passive: true });
    document.addEventListener('touchmove', handler as EventListener, { passive: true });
  } else if (!on && guideEl) {
    if (handler) {
      document.removeEventListener('mousemove', handler as EventListener);
      document.removeEventListener('touchmove', handler as EventListener);
    }
    guideEl.remove();
    guideEl = null;
    handler = null;
  }
}
