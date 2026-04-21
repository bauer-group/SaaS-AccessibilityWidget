import { describe, it, expect, beforeEach } from 'vitest';
import { applyState } from '../src/features/apply.js';
import { createDefaultState } from '../src/state.js';

/**
 * ADR-0003 guarantee: the widget must NOT touch host ARIA/semantic attrs.
 * We plant attributes on host elements and verify that every feature
 * toggle leaves them intact.
 */
describe('no host ARIA mutation (ADR-0003)', () => {
  let heading: HTMLElement;
  let img: HTMLImageElement;
  let button: HTMLButtonElement;
  let link: HTMLAnchorElement;

  beforeEach(() => {
    document.body.replaceChildren();

    heading = document.createElement('h1');
    heading.setAttribute('aria-label', 'Original heading label');
    heading.setAttribute('role', 'heading');
    heading.textContent = 'Title';

    img = document.createElement('img');
    img.alt = 'Original alt text';
    img.setAttribute('aria-hidden', 'false');

    button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Click';

    link = document.createElement('a');
    link.href = '#x';
    link.setAttribute('aria-current', 'page');
    link.textContent = 'Nav';

    document.body.append(heading, img, button, link);
  });

  it('does not alter author ARIA after enabling every feature', () => {
    const s = createDefaultState();
    s.features = Object.fromEntries(
      Object.keys(s.features).map((k) => [k, true]),
    ) as typeof s.features;
    s.contrastMode = 'high';
    applyState(s);

    expect(heading.getAttribute('aria-label')).toBe('Original heading label');
    expect(heading.getAttribute('role')).toBe('heading');
    expect(img.alt).toBe('Original alt text');
    expect(img.getAttribute('aria-hidden')).toBe('false');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(link.getAttribute('aria-current')).toBe('page');
  });
});
