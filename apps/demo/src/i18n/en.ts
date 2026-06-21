/**
 * English page-chrome dictionary — the canonical source of keys AND the
 * runtime fallback for any unknown browser language. Keep `de.ts` in structural
 * lockstep (the `: Dict` annotation there enforces it at typecheck time).
 *
 * Values used with `data-i18n-html` may contain trusted inline markup
 * (`<strong>`, `<code>`, `<a>`); values used with `data-i18n` are plain text.
 */
export const en = {
  meta: {
    title: 'Accessibility Widget — one line of code · BFSG · WCAG 2.2 AA',
    description:
      'A lazy-loading accessibility widget for BFSG / EN 301 549 / WCAG 2.2 AA. One line of code, 28 languages, ~6 KB loader, zero tracking, no DOM/ARIA overrides of the host page. Try the live demo.',
  },

  nav: {
    home: 'Home',
    features: 'Features',
    profiles: 'Profiles',
    install: 'Install',
    api: 'API',
    compliance: 'Compliance',
    faq: 'FAQ',
    github: 'GitHub',
    skip: 'Skip to main content',
    configuration: 'Configuration',
    events: 'Events',
    playground: 'Playground',
    langLabel: 'Page language',
    langDe: 'Switch page to German',
    langEn: 'Switch page to English',
  },

  hero: {
    eyebrow: 'BFSG · EN 301 549 · WCAG 2.2 AA',
    title: 'Digital accessibility —',
    titleAccent: 'in one line of code',
    lede: 'A lazy-loading accessibility widget: ~6 KB loader, ~28 KB core, <strong>28 languages</strong>, no cookies, no tracking, and no DOM/ARIA override of your page.',
    codeCaption: 'Add this one line — that is it:',
    copy: 'Copy',
    copied: 'Copied ✓',
    openBtn: 'Open the widget',
    resetBtn: 'Reset settings',
    hint: 'Or use the keyboard shortcut <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> — or the button in the bottom-right corner.',
  },

  facts: {
    loaderT: 'Loader',
    loaderV: '≤ 6 KB',
    loaderU: 'gzip',
    coreT: 'Core',
    coreV: '≤ 30 KB',
    coreU: 'gzip',
    localesT: 'Locales',
    localesV: '28',
    localesU: 'languages',
    depsT: 'Dependencies',
    depsV: '0',
    depsU: 'zero runtime',
  },

  features: {
    heading: 'Why this widget',
    lead: 'An honest preference layer — not a magic compliance button. Built to add real value for users without touching your markup.',
    onelineT: 'One line to integrate',
    onelineB:
      'A single <code>&lt;script&gt;</code> tag, deferred. No build step, no framework lock-in. The core only loads when a visitor actually opens the panel.',
    nodomT: 'No DOM/ARIA override',
    nodomB:
      'The widget never rewrites your markup or ARIA. It layers user preferences on top — so it can never break a page that is already accessible.',
    privacyT: 'Zero tracking, zero cookies',
    privacyB:
      'No analytics, no third-party calls, no cookies. All preferences live in <code>localStorage</code> on the visitor’s device.',
    i18nT: '28 languages, RTL-ready',
    i18nB:
      'Auto-detects the browser language and renders the panel accordingly — including full right-to-left layout for Arabic, Hebrew, Persian and Urdu.',
    profilesT: 'Curated profiles',
    profilesB:
      'Six one-click presets (vision, motor, cognitive, seizure-safe, ADHD, screen-reader) bundle the right features for real needs.',
    lightT: 'Lightweight by design',
    lightB:
      'A ~6 KB loader — smaller than most analytics snippets. The heavier core is lazy-loaded on demand and budget-enforced at build time.',
    explore:
      'Explore the widget: <a href="/configuration.html">Configuration</a> · <a href="/api.html">API</a> · <a href="/events.html">Events</a> · <a href="/playground.html">Playground</a>.',
  },

  profiles: {
    heading: 'Try a profile',
    lead: 'One click activates a curated set of features via <code>AccessibilityWidget.applyProfile()</code>. Changes are <strong>visible immediately</strong> on this page and persist.',
    footnote:
      'No matching profile? <button type="button" class="link-btn" data-action="open">Pick every feature individually →</button>',
    visionLabel: 'Low vision',
    visionHint: 'Larger text · High contrast · Highlight links',
    motorLabel: 'Motor',
    motorHint: 'Big cursor · Animations paused · Thick focus',
    cognitiveLabel: 'Cognitive',
    cognitiveHint: 'Dyslexia font · Line spacing · Reading guide',
    seizureLabel: 'Seizure-safe',
    seizureHint: 'Animations paused · Grayscale',
    adhdLabel: 'ADHD',
    adhdHint: 'Reading mask · Animations paused · Focus ring',
    blindLabel: 'Blind (screen reader)',
    blindHint: 'Structure navigation · Highlight links · Focus ring',
  },

  trial: {
    heading: 'Language & reset',
    lead: 'Every change is persisted in <code>localStorage</code> and applied before the first render — no flash of unstyled content.',
    localeKicker: 'Live, no reload',
    localeTitle: 'Switch language',
    localeBody:
      '28 languages available. The panel re-renders live via <code>AccessibilityWidget.setLocale()</code>, persisted in widget state.',
    localeLabel: 'Widget language',
    resetKicker: 'Back to zero',
    resetTitle: 'Clear preferences',
    resetBody:
      'Clears the <code>localStorage</code> key and reloads the page. The widget returns to its <em>never-configured</em> state.',
    resetBtn: 'Reset & reload',
  },

  sample: {
    heading: 'Sample content',
    lead: 'This text reacts to every widget setting. Toggle font size, contrast or reading aids and watch it change here.',
    legalTitle: 'Legal background',
    legalBody1:
      'Since 28 June 2025, the German <a href="https://www.gesetze-im-internet.de/bfsg/" rel="noopener">Accessibility Strengthening Act (BFSG)</a> requires nearly all B2C providers to make their digital offerings accessible. It implements EU Directive (EU) 2019/882 (European Accessibility Act, EAA) technically via EN 301 549 — which in turn references <a href="https://www.w3.org/TR/WCAG22/" rel="noopener">WCAG 2.2 AA</a>.',
    legalBody2:
      'A widget never replaces clean code. But a well-built preference layer (contrast, font size, focus ring, TTS) is a real win for users — and a visible commitment from the operator.',
    animTitle: 'Animation test',
    animBody:
      'This dot pulses until you enable <em>pause animations</em> in the widget. The widget also respects <code>prefers-reduced-motion</code>.',
  },

  quickstart: {
    heading: 'Install',
    lead: 'One script tag covers 95 % of cases. For build tools and 13 framework/CMS/shop integrations, see the options below.',
    cdnKicker: 'Recommended',
    cdnTitle: 'CDN — one line',
    cdnBody:
      'The <code>v1</code> alias always serves the latest release in that major. Auto-detects language, renders the FAB bottom-right, persists preferences.',
    prodTitle: 'Production: pin a version + SRI',
    prodBody:
      'Pin an immutable <code>…/&lt;version&gt;/…</code> path and secure it with Subresource Integrity. Per-release hashes live at <code>…/&lt;version&gt;/integrity.json</code>.',
    npmKicker: 'Bundlers',
    npmTitle: 'npm',
    npmBody:
      'Install <code>@bauer-group/accessibility-widget</code> for typed config and asset paths in your build pipeline.',
    integrationsKicker: '13 integrations',
    integrationsTitle: 'Frameworks, CMS & shops',
    integrationsBody:
      'React · Vue · Angular · Svelte · Next.js · Nuxt · Astro · WordPress · TYPO3 · Drupal · Shopify · Shopware · Magento — maintained in their own repo.',
    integrationsLink: 'Open the integrations repo →',
    tabsLabel: 'Integration examples',
    note: 'A single <code>&lt;script&gt;</code> tag is enough — the wrappers below are conveniences, not requirements.',
  },

  api: {
    heading: 'Runtime API — live',
    lead: 'Every method on <code>window.AccessibilityWidget</code>, one click away. The result of the last call appears on the right.',
    controlHeading: 'Control',
    featuresHeading: 'Features & profiles',
    langHeading: 'Language',
    posHeading: 'FAB position',
    inspectHeading: 'Inspection',
    resultHeading: 'Result',
    resultPlaceholder: 'Click an API method on the left to see its result and return value.',
    methodsTitle: 'Methods',
    colMethod: 'Method',
    colSignature: 'Signature',
    colPurpose: 'Purpose',
    mOpen: 'Open the panel (loads the core on demand)',
    mClose: 'Close the panel',
    mReset: 'Clear all preferences + reload the page',
    mSet: 'Toggle a single feature',
    mApply: 'Apply a profile preset (6 profiles)',
    mLocale: 'Switch language at runtime (persistent, panel re-renders live)',
    mPosition: 'Move the FAB to { x, y } or back to the anchor with null',
    mState: 'Read the persisted state synchronously',
    mOn: 'Subscribe to an event, returns an unsubscribe function',
    eventsTitle: 'Events',
    colEvent: 'Event',
    colPayload: 'Payload',
    colFires: 'Fires on',
    eStateChange: 'Every state change (feature, profile, locale, reset)',
    eOpen: 'The panel opens',
    eClose: 'The panel closes',
    eProfile: 'A profile preset is applied',
    eLocale: 'The locale changes',
    eReset: 'All preferences are cleared',
  },

  events: {
    heading: 'Event stream',
    lead: 'Live log of all <code>AccessibilityWidget</code> events (CustomEvents on <code>document</code> under <code>accessibility-widget:*</code>). Privacy-friendly: payloads stay here, never sent anywhere.',
    clear: 'Clear log',
    cleared: 'Log cleared. New events appear here.',
    empty: 'No events yet. Click in the API explorer or in the panel.',
    refLead:
      'Subscribe with <code>AccessibilityWidget.on(name, cb)</code> — it returns an unsubscribe function.',
  },

  state: {
    heading: 'Live state',
    hint: 'JSON dump of the persisted widget state — updates live',
    note: 'Source: <code>window.AccessibilityWidget.getState()</code> — poll interval 500 ms.',
  },

  compliance: {
    heading: 'Compliance',
    lead: 'The widget is aligned with three overlapping frameworks:',
    bfsgBody:
      'Accessibility Strengthening Act — the national implementation of the EAA. Applies in Germany from 28 June 2025 to nearly all B2C providers.',
    bfsgLink: 'Legal text →',
    enBody:
      'The European standard for digital accessibility. References WCAG and adds ICT-specific requirements.',
    enLink: 'ETSI document →',
    wcagBody:
      'Web Content Accessibility Guidelines by the W3C. The de-facto global standard for accessible web design.',
    wcagLink: 'W3C Recommendation →',
  },

  faq: {
    heading: 'FAQ',
    q1: 'Does the widget make my site automatically compliant?',
    a1: 'No — and any vendor that promises automatic compliance is misleading you. No widget can repair broken markup or supply missing semantics. What it does add is a genuine, user-facing preference layer — contrast, text size, spacing, focus, reading aids and text-to-speech — on top of the accessible code you still own. Treat it as a complement to conformance work, never a replacement for it.',
    q2: 'Does it change my HTML or ARIA?',
    a2: 'No. The widget never rewrites your DOM or your ARIA attributes. Every preference is applied through its own isolated layer — data attributes on the root element and a scoped stylesheet — so it cannot break an already-accessible page or interfere with assistive technology.',
    q3: 'How big is it really?',
    a3: 'The loader is ≤ 6 KB gzip — smaller than most analytics snippets — and that is all that ships on first paint. The ≤ 30 KB core is fetched on demand, only once a visitor actually opens the panel. Both budgets are enforced automatically at build time, so they cannot regress unnoticed.',
    q4: 'Is there any tracking or cookies?',
    a4: 'None whatsoever. No analytics, no third-party requests, no cookies, no fingerprinting. Every preference is stored locally in the visitor’s browser via localStorage and never leaves their device.',
    q5: 'Is it GDPR-compliant? Do I need a consent banner?',
    a5: 'Yes, and no banner is required. Because the widget processes no personal data and sets no cookies, it raises no GDPR/DSGVO consent obligations. Preferences stay on the visitor’s device and are never transmitted to us or any third party.',
    q6: 'What does it cost and how is it licensed?',
    a6: 'Dual-licensed: AGPL-3.0-only for open-source projects, or a commercial license for closed-source and proprietary deployments. Contact BAUER GROUP for commercial terms and support options.',
  },

  scanner: {
    heading: 'Scanner test zone',
    hint: 'Contains <strong>intentional</strong> WCAG violations',
    lead: 'This page serves automated scanners (axe-core, pa11y, Lighthouse, Playwright-AxE) as a target. In a real product these barriers would be fixed — here they exist as stable test cases:',
    v1: '<code>&lt;img&gt;</code> without an <code>alt</code> attribute',
    v2: 'Link text “click here” (not contextual)',
    v3: 'Button with contrast &lt; 4.5:1',
    v4: 'Form <code>&lt;input&gt;</code> without a label',
    note: 'Preview port for the scanner: <code>http://localhost:4173</code> (after <code>pnpm demo:build &amp;&amp; pnpm demo:preview</code>).',
    imgMore: 'click here',
    imgMoreSuffix: ' for more.',
    grayBtn: 'Gray action',
    inputPh: 'Name',
    submit: 'Submit',
  },

  footer: {
    license: 'AGPL-3.0-only / commercial',
    versionLabel: 'Version',
    sri: 'SRI hashes',
    npmLink: 'Source (npm)',
    statement: 'Accessibility statement',
    impressum: 'Legal notice',
  },

  statement: {
    title: 'Accessibility statement',
    back: '← Back to the demo',
    intro:
      'BAUER GROUP is committed to making the <strong>Accessibility Widget</strong> website accessible in accordance with the German Accessibility Strengthening Act (BFSG) and EN 301 549 / WCAG 2.2 AA.',
    conformanceTitle: 'Conformance status',
    conformanceBody:
      'This website is <strong>partially conformant</strong>. The barriers listed on the <a href="/">demo page</a> are <em>intentional</em> and serve as a scanner test target. In a real production system they would be fixed.',
    contactTitle: 'Contact / feedback (§ 14 BFSG)',
    contactBody:
      'BAUER GROUP<br />Web: <a href="https://www.bauer-group.com" rel="noopener">www.bauer-group.com</a>',
    enforcementTitle: 'Enforcement procedure',
    enforcementBody:
      'If you do not receive a satisfactory response, you may contact the federal conciliation body:<br />Schlichtungsstelle des Bundes für Barrierefreiheit<br />Mauerstraße 53, 10117 Berlin, Germany<br />E-Mail: <a href="mailto:info@schlichtungsstelle-bfsg.de">info@schlichtungsstelle-bfsg.de</a>',
    createdTitle: 'Preparation of this statement',
    createdBody: 'Created on 21 April 2026. Last reviewed: 21 April 2026.',
  },

  impressum: {
    title: 'Legal notice',
    back: '← Back to the demo',
    body: 'This is a demo page without production content.',
    addressName: 'BAUER GROUP',
    addressLines: 'Demo address',
    web: 'Web',
  },

  config: {
    kicker: 'Reference · interactive',
    heading: 'Configuration',
    lead: 'Every option of <code>window.AccessibilityWidgetConfig</code>, end to end. Change a control to build the snippet live, preview panel-affecting options instantly, or <strong>Apply &amp; reload</strong> to see load-time options take effect.',
    badgeLive: 'live',
    legendLive: '— applies instantly',
    badgeReload: 'reload',
    legendReload: '— applies after “Apply & reload”',
    snippetTitle: 'Your config',
    snippetEmpty: 'Defaults only — change a control to build your config.',
    preview: 'Preview in panel',
    apply: 'Apply & reload',
    reset: 'Reset',
    note: '“Apply & reload” stashes this config in sessionStorage and reloads, so even load-time options take effect across the demo.',
    grp: {
      assets: 'Asset loading',
      locale: 'Localization',
      branding: 'UI & branding',
      persistence: 'Persistence',
      features: 'Feature gating',
      legal: 'Legal & compliance',
      behavior: 'Behaviour',
    },
    f: {
      corePath: { l: 'Core path', d: 'URL of the on-demand core bundle.' },
      cssPath: { l: 'CSS path', d: 'URL of the widget stylesheet.' },
      coreIntegrity: {
        l: 'Core SRI hash',
        d: 'Subresource-Integrity hash for the core bundle (sha384-…).',
      },
      cssIntegrity: {
        l: 'CSS SRI hash',
        d: 'Subresource-Integrity hash for the stylesheet.',
      },
      locale: {
        l: 'Widget locale',
        d: 'Panel language. “auto” detects from the page/browser.',
      },
      position: { l: 'FAB position', d: 'Anchor corner of the button.' },
      offset: { l: 'Offset x / y (px)', d: 'Distance from the anchor corner.' },
      zIndex: {
        l: 'z-index',
        d: 'Stacking order of the FAB. Default is one below max int32.',
      },
      primaryColor: { l: 'Primary colour', d: 'FAB background colour.' },
      buttonLabel: {
        l: 'Button label',
        d: 'Override the FAB aria-label. Empty → localized default.',
      },
      storageKey: { l: 'Storage key', d: 'localStorage key for user preferences.' },
      initialFeatures: {
        l: 'Initial features',
        d: 'Enabled for first-time visitors (before any saved state).',
      },
      disabledFeatures: {
        l: 'Disabled features',
        d: 'Removed from the panel entirely (also blocked from profiles).',
      },
      statementUrl: {
        l: 'Statement URL',
        d: 'Link to your accessibility statement (rendered in the footer). Default: no link. javascript:/data: are rejected.',
      },
      disclaimer: { l: 'Disclaimer', d: 'Free-form footer text (plain text — no HTML).' },
      hidePoweredBy: {
        l: 'Hide “Powered by”',
        d: 'White-label: suppress the attribution line.',
      },
      draggableFab: {
        l: 'Draggable FAB',
        d: 'Let end users move the button (pointer or Shift+Arrow).',
      },
      keyboardShortcut: {
        l: 'Keyboard shortcut',
        d: 'Combo to open the panel, e.g. ctrl+alt+a, f2. Empty string disables it.',
      },
      respectReducedMotion: {
        l: 'Respect reduced motion',
        d: 'Honor prefers-reduced-motion for motion features.',
      },
      hideOnPrint: { l: 'Hide on print', d: 'Hide the FAB in @media print.' },
      debug: { l: 'Debug', d: 'console.warn normally-silent failures.' },
    },
  },
};
