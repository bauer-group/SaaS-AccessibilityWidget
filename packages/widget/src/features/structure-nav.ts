const NAV_ID = 'bfsg-struct-nav';

export function structureNavToggle(label: string): boolean {
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
  closeBtn.className = 'bfsg-struct-nav__close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', label);
  closeBtn.addEventListener('click', () => nav.remove());

  const ul = document.createElement('ul');
  document.querySelectorAll<HTMLHeadingElement>('h1, h2, h3').forEach((h, i) => {
    if (!h.id) h.id = `bfsg-h-${i}`;
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

  nav.appendChild(closeBtn);
  nav.appendChild(ul);
  document.body.appendChild(nav);

  setTimeout(() => ul.querySelector<HTMLAnchorElement>('a')?.focus(), 10);
  return true;
}
