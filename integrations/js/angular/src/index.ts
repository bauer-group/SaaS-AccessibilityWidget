import { Component, Input, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { WidgetConfig, WidgetState } from '@bauer-group/accessibility-widget';

export interface Sri {
  loader?: string;
  core?: string;
  css?: string;
}

declare global {
  interface Window {
    AccessibilityWidgetConfig?: WidgetConfig;
    AccessibilityWidget?: {
      open(): Promise<void>;
      close(): void;
      reset(): void;
      getState(): WidgetState | null;
    };
  }
}

@Component({
  selector: 'accessibility-widget',
  standalone: true,
  template: '',
})
export class AccessibilityWidgetComponent implements OnInit {
  @Input() loaderSrc = '/accessibility-widget-loader.min.js';
  @Input() cssHref = '/accessibility-widget.min.css';
  @Input() config: WidgetConfig = {};
  @Input() sri: Sri = {};

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.AccessibilityWidgetConfig = { ...(window.AccessibilityWidgetConfig ?? {}), ...this.config };

    if (this.cssHref && !document.querySelector('link[data-aw-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.cssHref;
      link.setAttribute('data-aw-css', '1');
      if (this.sri.css) {
        link.integrity = this.sri.css;
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
    if (this.loaderSrc && !document.querySelector('script[data-aw-loader]')) {
      const s = document.createElement('script');
      s.src = this.loaderSrc;
      s.defer = true;
      s.setAttribute('data-aw-loader', '1');
      if (this.sri.loader) {
        s.integrity = this.sri.loader;
        s.crossOrigin = 'anonymous';
      }
      document.head.appendChild(s);
    }
  }
}

export const openAccessibilityWidget = (): Promise<void> | undefined => window.AccessibilityWidget?.open();
export const closeAccessibilityWidget = (): void => window.AccessibilityWidget?.close();
export const resetAccessibilityWidget = (): void => window.AccessibilityWidget?.reset();
