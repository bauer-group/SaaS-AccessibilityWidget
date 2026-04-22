import { describe, it, expect, vi } from 'vitest';
import { onWidgetEvent, dispatchWidgetEvent } from '../src/util/events.js';

describe('widget events', () => {
  it('delivers detail payload to subscribers', () => {
    const handler = vi.fn();
    const off = onWidgetEvent('stateChange', handler);
    dispatchWidgetEvent('stateChange', {
      state: {
        features: {} as never,
        fontSizeLevel: 1,
        lineHeightLevel: 1.5,
        letterSpacingLevel: 0,
        contrastMode: 'off',
      },
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0].state.fontSizeLevel).toBe(1);
    off();
  });

  it('unsubscribe stops further delivery', () => {
    const handler = vi.fn();
    const off = onWidgetEvent('close', handler);
    dispatchWidgetEvent('close', {});
    off();
    dispatchWidgetEvent('close', {});
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports native document.addEventListener as escape hatch', () => {
    const handler = vi.fn();
    document.addEventListener('accessibility-widget:localeChanged', handler as EventListener);
    dispatchWidgetEvent('localeChanged', { locale: 'fr' });
    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({ locale: 'fr' });
    document.removeEventListener('accessibility-widget:localeChanged', handler as EventListener);
  });

  it('isolated events do not cross-fire', () => {
    const a = vi.fn();
    const b = vi.fn();
    const offA = onWidgetEvent('open', a);
    const offB = onWidgetEvent('close', b);
    dispatchWidgetEvent('open', { trigger: null });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
    offA();
    offB();
  });
});
