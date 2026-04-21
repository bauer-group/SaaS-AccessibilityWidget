# @bauer-group/accessibility-widget-angular

Angular 19 Standalone Component (SSR-safe).

```ts
import { Component } from '@angular/core';
import { BFSGWidgetComponent } from '@bauer-group/accessibility-widget-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BFSGWidgetComponent],
  template: `<bfsg-widget loaderSrc="/bfsg-widget/bfsg-widget-loader.min.js" [config]="{ locale: 'de' }" />`,
})
export class AppComponent {}
```

MIT © BAUER GROUP
