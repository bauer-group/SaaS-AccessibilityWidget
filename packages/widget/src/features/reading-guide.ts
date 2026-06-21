let guideEl: HTMLDivElement | null = null;
let controller: AbortController | null = null;
let rafId: number | null = null;

export function readingGuideApply(on: boolean): void {
  if (on && !guideEl) {
    guideEl = document.createElement('div');
    guideEl.className = 'aw-reading-guide';
    guideEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guideEl);

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
        if (guideEl) guideEl.style.top = `${latestY - 16}px`;
      });
    };
    document.addEventListener('mousemove', onMove as EventListener, { passive: true, signal });
    document.addEventListener('touchmove', onMove as EventListener, { passive: true, signal });
  } else if (!on && guideEl) {
    controller?.abort();
    controller = null;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    guideEl.remove();
    guideEl = null;
  }
}
