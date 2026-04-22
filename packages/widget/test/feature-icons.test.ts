import { describe, it, expect } from 'vitest';
import { FEATURE_IDS } from '../src/types/index.js';
import { FEATURE_ICONS } from '../src/util/feature-icons.js';
import { buildIcon } from '../src/util/svg.js';

describe('feature-icons registry', () => {
  it('has an icon for every feature id', () => {
    for (const id of FEATURE_IDS) {
      expect(FEATURE_ICONS[id], `missing icon for ${id}`).toBeDefined();
    }
  });

  it('each icon builds a valid SVGSVGElement', () => {
    for (const id of FEATURE_IDS) {
      const svg = buildIcon(FEATURE_ICONS[id]);
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.getAttribute('viewBox')).toBeTruthy();
      expect(svg.getAttribute('focusable')).toBe('false');
      // Stroke-mode icons must not carry a fill override at the root.
      if (FEATURE_ICONS[id].stroke) {
        expect(svg.getAttribute('fill')).toBe('none');
        expect(svg.getAttribute('stroke')).toBe('currentColor');
      }
      // Must render at least one path or circle.
      const childCount = svg.querySelectorAll('path, circle').length;
      expect(childCount, `${id} has no shapes`).toBeGreaterThan(0);
    }
  });
});
