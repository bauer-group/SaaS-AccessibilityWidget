const NAV_ID = 'aw-struct-nav';

export function structureNavToggle(label: string, emptyText: string): boolean {
  const existing = document.getElementById(NAV_ID);
  if (existing) {
    existing.remove();
    return false;
  }

  const nav = document.createElement('nav');
  nav.id = NAV_ID;
  nav.setAttribute('aria-label', label);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'aw-struct-nav__close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', label);
  closeBtn.addEventListener('click', () => nav.remove());
  nav.appendChild(closeBtn);

  const headings = document.querySelectorAll<HTMLHeadingElement>('h1, h2, h3');
  let firstFocusable: HTMLElement = closeBtn;

  if (headings.length === 0) {
    // No headings to list — surface a clear, localized message instead of an
    // empty overlay, and keep focus on the close button.
    const empty = document.createElement('p');
    empty.className = 'aw-struct-nav__empty';
    empty.textContent = emptyText;
    nav.appendChild(empty);
  } else {
    const ul = document.createElement('ul');
    headings.forEach((h, i) => {
      if (!h.id) h.id = `aw-h-${i}`;
      const level = Number(h.tagName.substring(1));
      const li = document.createElement('li');
      li.dataset.level = String(level);
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = (h.textContent ?? '').trim().slice(0, 80);
      a.addEventListener('click', () => {
        setTimeout(() => nav.remove(), 150);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    firstFocusable = ul.querySelector<HTMLAnchorElement>('a') ?? closeBtn;
  }

  document.body.appendChild(nav);
  setTimeout(() => firstFocusable.focus(), 10);
  return true;
}
