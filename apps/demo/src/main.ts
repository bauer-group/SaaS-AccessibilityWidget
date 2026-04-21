declare global {
  interface Window {
    BFSGWidget?: { open(): Promise<void>; close(): void; reset(): void };
  }
}

document.getElementById('open-panel')?.addEventListener('click', () => {
  window.BFSGWidget?.open();
});

document.getElementById('reset-panel')?.addEventListener('click', () => {
  window.BFSGWidget?.reset();
});
