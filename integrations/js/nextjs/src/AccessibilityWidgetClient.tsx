'use client';
import {
  AccessibilityWidget,
  type AccessibilityWidgetProps,
} from '@bauer-group/accessibility-widget-react';

/**
 * Drop into app/layout.tsx:
 *
 *   import { AccessibilityWidgetClient } from '@bauer-group/accessibility-widget-nextjs';
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="de">
 *         <body>
 *           {children}
 *           <AccessibilityWidgetClient loaderSrc="/accessibility-widget/accessibility-widget-loader.min.js" />
 *         </body>
 *       </html>
 *     );
 *   }
 */
export function AccessibilityWidgetClient(props: AccessibilityWidgetProps) {
  return <AccessibilityWidget {...props} />;
}
