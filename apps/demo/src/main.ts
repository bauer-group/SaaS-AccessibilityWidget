declare global {
  interface Window {
    AccessibilityWidget?: { open(): Promise<void>; close(): void; reset(): void };
  }
}

document.getElementById('open-panel')?.addEventListener('click', () => {
  window.AccessibilityWidget?.open();
});

document.getElementById('reset-panel')?.addEventListener('click', () => {
  window.AccessibilityWidget?.reset();
});
