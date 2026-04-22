import { afterEach, describe, expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { AccessibilityWidget } from '../src/AccessibilityWidget.js';

function resetInjectedAssets(): void {
  document.querySelectorAll('[data-aw-loader],[data-aw-css]').forEach((el) => el.remove());
  delete (window as unknown as { AccessibilityWidgetConfig?: unknown }).AccessibilityWidgetConfig;
}

describe('<AccessibilityWidget /> — smoke', () => {
  afterEach(() => {
    cleanup();
    resetInjectedAssets();
  });

  it('injects the loader script and stylesheet exactly once', () => {
    const { rerender } = render(
      <AccessibilityWidget
        loaderSrc="/a/loader.min.js"
        cssHref="/a/widget.min.css"
        config={{ position: 'bottom-right' }}
      />,
    );

    expect(document.querySelectorAll('script[data-aw-loader]')).toHaveLength(1);
    expect(document.querySelectorAll('link[data-aw-css]')).toHaveLength(1);

    // A rerender must be idempotent — dedupe relies on data-aw-* markers.
    rerender(
      <AccessibilityWidget loaderSrc="/a/loader.min.js" cssHref="/a/widget.min.css" />,
    );
    expect(document.querySelectorAll('script[data-aw-loader]')).toHaveLength(1);
    expect(document.querySelectorAll('link[data-aw-css]')).toHaveLength(1);
  });

  it('merges config onto window.AccessibilityWidgetConfig without clobbering existing keys', () => {
    (window as unknown as { AccessibilityWidgetConfig?: Record<string, unknown> }).AccessibilityWidgetConfig = {
      debug: true,
    };

    render(<AccessibilityWidget loaderSrc="/a/loader.min.js" config={{ locale: 'de' }} />);

    const cfg = (window as unknown as { AccessibilityWidgetConfig?: Record<string, unknown> })
      .AccessibilityWidgetConfig;
    expect(cfg).toMatchObject({ debug: true, locale: 'de' });
  });

  it('wires SRI integrity attributes onto both injected tags', () => {
    render(
      <AccessibilityWidget
        loaderSrc="/a/loader.min.js"
        cssHref="/a/widget.min.css"
        sri={{ loader: 'sha384-LOADER', css: 'sha384-CSS' }}
      />,
    );

    const script = document.querySelector('script[data-aw-loader]') as HTMLScriptElement;
    const link = document.querySelector('link[data-aw-css]') as HTMLLinkElement;
    expect(script.integrity).toBe('sha384-LOADER');
    expect(script.crossOrigin).toBe('anonymous');
    expect(link.integrity).toBe('sha384-CSS');
    expect(link.crossOrigin).toBe('anonymous');
  });
});
