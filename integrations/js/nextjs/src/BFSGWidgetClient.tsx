'use client';
import { BFSGWidget, type BFSGWidgetProps } from '@bauer-group/accessibility-widget-react';

/**
 * Drop into app/layout.tsx:
 *
 *   import { BFSGWidgetClient } from '@bauer-group/accessibility-widget-nextjs';
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="de">
 *         <body>
 *           {children}
 *           <BFSGWidgetClient loaderSrc="/bfsg-widget/bfsg-widget-loader.min.js" />
 *         </body>
 *       </html>
 *     );
 *   }
 */
export function BFSGWidgetClient(props: BFSGWidgetProps) {
  return <BFSGWidget {...props} />;
}
