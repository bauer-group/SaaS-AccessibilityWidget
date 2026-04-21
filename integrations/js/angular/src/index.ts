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
    BFSGWidgetConfig?: WidgetConfig;
    BFSGWidget?: {
      open(): Promise<void>;
      close(): void;
      reset(): void;
      getState(): WidgetState | null;
    };
  }
}

@Component({
  selector: 'bfsg-widget',
  standalone: true,
  template: '',
})
export class BFSGWidgetComponent implements OnInit {
  @Input() loaderSrc = '/bfsg-widget-loader.min.js';
  @Input() cssHref = '/bfsg-widget.min.css';
  @Input() config: WidgetConfig = {};
  @Input() sri: Sri = {};

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.BFSGWidgetConfig = { ...(window.BFSGWidgetConfig ?? {}), ...this.config };

    if (this.cssHref && !document.querySelector('link[data-bfsg="css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.cssHref;
      link.dataset['bfsg'] = 'css';
      if (this.sri.css) {
        link.integrity = this.sri.css;
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
    if (this.loaderSrc && !document.querySelector('script[data-bfsg="loader"]')) {
      const s = document.createElement('script');
      s.src = this.loaderSrc;
      s.defer = true;
      s.dataset['bfsg'] = 'loader';
      if (this.sri.loader) {
        s.integrity = this.sri.loader;
        s.crossOrigin = 'anonymous';
      }
      document.head.appendChild(s);
    }
  }
}

export const openBFSGWidget = (): Promise<void> | undefined => window.BFSGWidget?.open();
export const closeBFSGWidget = (): void => window.BFSGWidget?.close();
export const resetBFSGWidget = (): void => window.BFSGWidget?.reset();
