import { describe, it, expect, beforeEach } from 'vitest';
import { structureNavToggle } from '../src/features/structure-nav.js';

const LABEL = 'Structure navigation';
const EMPTY = 'No headings found on this page.';

describe('structureNavToggle', () => {
  beforeEach(() => document.body.replaceChildren());

  it('builds a heading list and reports open', () => {
    document.body.innerHTML = '<h1>One</h1><h2>Two</h2><p>x</p><h3>Three</h3>';
    const opened = structureNavToggle(LABEL, EMPTY);
    expect(opened).toBe(true);
    const links = document.querySelectorAll('#aw-struct-nav ul a');
    expect(links.length).toBe(3);
    expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe('#aw-h-0');
    expect(document.querySelector('.aw-struct-nav__empty')).toBeNull();
  });

  it('a second call closes the overlay and reports closed', () => {
    document.body.innerHTML = '<h1>One</h1>';
    expect(structureNavToggle(LABEL, EMPTY)).toBe(true);
    expect(structureNavToggle(LABEL, EMPTY)).toBe(false);
    expect(document.getElementById('aw-struct-nav')).toBeNull();
  });

  it('renders the empty-state message instead of an empty list when no headings exist', () => {
    const opened = structureNavToggle(LABEL, EMPTY);
    expect(opened).toBe(true);
    expect(document.querySelector('#aw-struct-nav ul')).toBeNull();
    const empty = document.querySelector('.aw-struct-nav__empty');
    expect(empty?.textContent).toBe(EMPTY);
    // The close control is still present so the user is never trapped.
    expect(document.querySelector('.aw-struct-nav__close')).not.toBeNull();
  });
});
