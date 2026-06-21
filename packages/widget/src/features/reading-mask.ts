let maskEl: HTMLDivElement | null = null;
let controller: AbortController | null = null;
let rafId: number | null = null;

export function readingMaskApply(on: boolean): void {
  if (on && !maskEl) {
    maskEl = document.createElement('div');
    maskEl.className = 'aw-reading-mask';
    maskEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(maskEl);

    controller = new AbortController();
    const { signal } = controller;
    let latestY = 0;
    const onMove = (e: MouseEvent | TouchEvent): void => {
      latestY = 'clientY' in e ? e.clientY : (e.touches[0]?.clientY ?? 0);
      // Coalesce a burst of pointer moves into one DOM write per frame, always
      // painting the most recent position.
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (maskEl) maskEl.style.setProperty('--aw-mask-y', `${latestY}px`);
      });
    };
    document.addEventListener('mousemove', onMove as EventListener, { passive: true, signal });
    document.addEventListener('touchmove', onMove as EventListener, { passive: true, signal });
  } else if (!on && maskEl) {
    controller?.abort();
    controller = null;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    maskEl.remove();
    maskEl = null;
  }
}
